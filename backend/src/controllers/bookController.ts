import type { Request, Response } from "express";

export interface ApiBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string[];
  rating: number;
  ratingsCount: number;
  year: number;
  description: string;
  pages: number;
  language: string;
  source: "open-library" | "google-books";
}

type OpenLibraryBook = {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  edition_key?: string[];
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
  first_publish_year?: number;
  number_of_pages_median?: number;
  language?: string[];
};

type GoogleVolume = {
  id: string;

  volumeInfo?: {
    title?: string;
    authors?: string[];

    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };

    categories?: string[];

    averageRating?: number;
    ratingsCount?: number;

    publishedDate?: string;

    pageCount?: number;

    language?: string;

    description?: string;
  };
};

const FALLBACK_COVER =
  "https://placehold.co/300x450?text=No+cover";

/*
|--------------------------------------------------------------------------
| CACHE
|--------------------------------------------------------------------------
*/

/*
 * Search cache
 *
 * Stores search results for 5 minutes.
 */
const searchCache = new Map<
  string,
  {
    expiresAt: number;
    value: ApiBook[];
  }
>();

/*
 * Individual book cache
 *
 * Stores individual book details for 30 minutes.
 *
 * This means:
 *
 * Home
 *   ↓
 * Book
 *   ↓
 * Back
 *   ↓
 * Book
 *
 * does NOT have to hit Open Library / Google Books again.
 */
const bookCache = new Map<
  string,
  {
    expiresAt: number;
    value: ApiBook;
  }
>();

const SEARCH_CACHE_TTL =
  5 * 60 * 1000;

const BOOK_CACHE_TTL =
  30 * 60 * 1000;

/*
|--------------------------------------------------------------------------
| LANGUAGE
|--------------------------------------------------------------------------
*/

const languageName = (
  code?: string
) => {
  if (!code) {
    return "Unknown";
  }

  const names: Record<string, string> = {
    eng: "English",
    en: "English",

    fre: "French",
    fra: "French",

    ger: "German",
    deu: "German",

    spa: "Spanish",

    ita: "Italian",

    por: "Portuguese",

    hin: "Hindi",

    tel: "Telugu",

    tam: "Tamil",

    jpn: "Japanese",

    kor: "Korean",

    chi: "Chinese",
    zho: "Chinese",
  };

  return (
    names[code.toLowerCase()] ||
    code.toUpperCase()
  );
};

/*
|--------------------------------------------------------------------------
| OPEN LIBRARY → BOOKD BOOK
|--------------------------------------------------------------------------
*/

const toOpenLibraryBook = (
  book: OpenLibraryBook
): ApiBook | null => {
  const workId =
    book.key
      ?.split("/")
      .pop();

  if (!workId || !book.title) {
    return null;
  }

  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : book.edition_key?.[0]
      ? `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-L.jpg`
      : FALLBACK_COVER;

  return {
    id: `ol_${workId}`,

    title: book.title,

    author:
      book.author_name?.join(", ") ||
      "Unknown author",

    cover,

    genre:
      book.subject?.slice(0, 5) ||
      [],

    rating:
      book.ratings_average || 0,

    ratingsCount:
      book.ratings_count || 0,

    year:
      book.first_publish_year || 0,

    description:
      "No description is available for this book.",

    pages:
      book.number_of_pages_median || 0,

    language:
      languageName(
        book.language?.[0]
      ),

    source:
      "open-library",
  };
};

/*
|--------------------------------------------------------------------------
| GOOGLE BOOKS → BOOKD BOOK
|--------------------------------------------------------------------------
*/

const toGoogleBook = (
  book: GoogleVolume
): ApiBook | null => {
  const info =
    book.volumeInfo;

  if (!info?.title) {
    return null;
  }

  return {
    id: `gb_${book.id}`,

    title: info.title,

    author:
      info.authors?.join(", ") ||
      "Unknown author",

    cover: (
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      FALLBACK_COVER
    ).replace(
      "http:",
      "https:"
    ),

    genre:
      info.categories?.slice(0, 5) ||
      [],

    rating:
      info.averageRating || 0,

    ratingsCount:
      info.ratingsCount || 0,

    year:
      Number.parseInt(
        info.publishedDate || "",
        10
      ) || 0,

    description:
      info.description ||
      "No description is available for this book.",

    pages:
      info.pageCount || 0,

    language:
      languageName(
        info.language
      ),

    source:
      "google-books",
  };
};

/*
|--------------------------------------------------------------------------
| FETCH JSON
|--------------------------------------------------------------------------
*/

const requestJson =
  async <T>(
    url: string
  ): Promise<T> => {
    const response =
      await fetch(url, {
        signal:
          AbortSignal.timeout(
            8_000
          ),
      });

    if (!response.ok) {
      throw new Error(
        `Book provider responded with ${response.status}`
      );
    }

    return response.json() as Promise<T>;
  };

/*
|--------------------------------------------------------------------------
| SEARCH OPEN LIBRARY
|--------------------------------------------------------------------------
*/

const searchOpenLibrary =
  async (
    query: string,
    limit: number
  ) => {
    const params =
      new URLSearchParams({
        q: query,

        limit: String(limit),

        fields:
          "key,title,author_name,cover_i,edition_key,subject,ratings_average,ratings_count,first_publish_year,number_of_pages_median,language",
      });

    const data =
      await requestJson<{
        docs?: OpenLibraryBook[];
      }>(
        `https://openlibrary.org/search.json?${params.toString()}`
      );

    return (
      data.docs || []
    )
      .map(
        toOpenLibraryBook
      )
      .filter(
        (
          book
        ): book is ApiBook =>
          Boolean(book)
      );
  };

/*
|--------------------------------------------------------------------------
| SEARCH GOOGLE BOOKS
|--------------------------------------------------------------------------
*/

const searchGoogleBooks =
  async (
    query: string,
    limit: number
  ) => {
    const apiKey =
      process.env
        .GOOGLE_BOOKS_API_KEY;

    /*
     * Google Books is optional.
     */
    if (!apiKey) {
      return [];
    }

    const params =
      new URLSearchParams({
        q: query,

        maxResults: String(
          Math.min(
            limit,
            40
          )
        ),

        key: apiKey,
      });

    const data =
      await requestJson<{
        items?: GoogleVolume[];
      }>(
        `https://www.googleapis.com/books/v1/volumes?${params.toString()}`
      );

    return (
      data.items || []
    )
      .map(
        toGoogleBook
      )
      .filter(
        (
          book
        ): book is ApiBook =>
          Boolean(book)
      );
  };

/*
|--------------------------------------------------------------------------
| REMOVE DUPLICATES
|--------------------------------------------------------------------------
*/

const uniqueBooks = (
  books: ApiBook[]
) => {
  const seen =
    new Set<string>();

  return books.filter(
    (book) => {
      const key =
        `${book.title}|${book.author}`
          .toLowerCase()
          .trim();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    }
  );
};

/*
|--------------------------------------------------------------------------
| GET ONE BOOK BY ID
|--------------------------------------------------------------------------
*/

const getBookById = async (
  id: string
): Promise<ApiBook | null> => {
  if (!id) {
    return null;
  }

  /*
   * CHECK CACHE FIRST
   */

  const cached =
    bookCache.get(id);

  if (
    cached &&
    cached.expiresAt > Date.now()
  ) {
    return cached.value;
  }

  /*
   * OPEN LIBRARY
   */

  if (
    id.startsWith("ol_")
  ) {
    const workId =
      id.substring(3);

    if (!workId) {
      return null;
    }

    const params =
      new URLSearchParams({
        q: `key:/works/${workId}`,
        limit: "1",

        fields:
          "key,title,author_name,cover_i,edition_key,subject,ratings_average,ratings_count,first_publish_year,number_of_pages_median,language",
      });

    const data =
      await requestJson<{
        docs?: OpenLibraryBook[];
      }>(
        `https://openlibrary.org/search.json?${params.toString()}`
      );

    const book =
      data.docs?.[0];

    if (!book) {
      return null;
    }

    const result =
      toOpenLibraryBook(
        book
      );

    if (result) {
      bookCache.set(id, {
        value: result,
        expiresAt:
          Date.now() +
          BOOK_CACHE_TTL,
      });
    }

    return result;
  }

  /*
   * GOOGLE BOOKS
   */

  if (
    id.startsWith("gb_")
  ) {
    const apiKey =
      process.env
        .GOOGLE_BOOKS_API_KEY;

    if (!apiKey) {
      return null;
    }

    const volumeId =
      id.substring(3);

    if (!volumeId) {
      return null;
    }

    const data =
      await requestJson<GoogleVolume>(
        `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
          volumeId
        )}?key=${encodeURIComponent(
          apiKey
        )}`
      );

    const result =
      toGoogleBook(data);

    if (result) {
      bookCache.set(id, {
        value: result,
        expiresAt:
          Date.now() +
          BOOK_CACHE_TTL,
      });
    }

    return result;
  }

  return null;
};

/*
|--------------------------------------------------------------------------
| SEARCH BOOKS
|--------------------------------------------------------------------------
*/

export const searchBooks =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const query =
        typeof req.query.q === "string" &&
        req.query.q.trim()
          ? req.query.q.trim()
          : "popular books";

      const limit =
        Math.min(
          Math.max(
            Number(
              req.query.limit
            ) || 24,
            1
          ),
          40
        );

      const cacheKey =
        `${query.toLowerCase()}:${limit}`;

      /*
       * SEARCH CACHE
       */

      const cached =
        searchCache.get(
          cacheKey
        );

      if (
        cached &&
        cached.expiresAt >
          Date.now()
      ) {
        return res.json({
          books:
            cached.value,
        });
      }

      /*
       * FETCH PROVIDERS IN PARALLEL
       */

      const [
        google,
        openLibrary,
      ] =
        await Promise.allSettled([
          searchGoogleBooks(
            query,
            limit
          ),

          searchOpenLibrary(
            query,
            limit
          ),
        ]);

      const results =
        uniqueBooks([
          ...(google.status ===
          "fulfilled"
            ? google.value
            : []),

          ...(openLibrary.status ===
          "fulfilled"
            ? openLibrary.value
            : []),
        ]).slice(
          0,
          limit
        );

      if (!results.length) {
        return res
          .status(502)
          .json({
            message:
              "Book providers are unavailable. Please try again shortly.",
          });
      }

      /*
       * SAVE SEARCH CACHE
       */

      searchCache.set(
        cacheKey,
        {
          value: results,

          expiresAt:
            Date.now() +
            SEARCH_CACHE_TTL,
        }
      );

      return res.json({
        books: results,
      });
    } catch (error) {
      console.error(
        "Search books error:",
        error
      );

      return res
        .status(502)
        .json({
          message:
            "Book providers are unavailable. Please try again shortly.",
        });
    }
  };

/*
|--------------------------------------------------------------------------
| GET BOOK
|--------------------------------------------------------------------------
*/

export const getBook =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const bookId =
        typeof req.params.bookId ===
        "string"
          ? req.params.bookId
          : "";

      if (!bookId) {
        return res
          .status(400)
          .json({
            message:
              "Book id is required.",
          });
      }

      const book =
        await getBookById(
          bookId
        );

      if (!book) {
        return res
          .status(404)
          .json({
            message:
              "Book not found.",
          });
      }

      return res.json({
        book,
      });
    } catch (error) {
      console.error(
        "Get book error:",
        error
      );

      return res
        .status(502)
        .json({
          message:
            "Book provider is unavailable. Please try again shortly.",
        });
    }
  };

/*
|--------------------------------------------------------------------------
| GET MULTIPLE BOOKS BY IDS
|--------------------------------------------------------------------------
*/

export const getBooksByIds =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const ids =
        typeof req.query.ids ===
        "string"
          ? [
              ...new Set(
                req.query.ids
                  .split(",")
                  .map(
                    (id) =>
                      id.trim()
                  )
                  .filter(
                    Boolean
                  )
              ),
            ].slice(
              0,
              25
            )
          : [];

      if (!ids.length) {
        return res
          .status(400)
          .json({
            message:
              "At least one book id is required.",
          });
      }

      const settled =
        await Promise.allSettled(
          ids.map(
            (id) =>
              getBookById(
                id
              )
          )
        );

      const books =
        settled.flatMap(
          (result) =>
            result.status ===
              "fulfilled" &&
            result.value
              ? [result.value]
              : []
        );

      return res.json({
        books,
      });
    } catch (error) {
      console.error(
        "Get books by IDs error:",
        error
      );

      return res
        .status(502)
        .json({
          message:
            "Unable to load books.",
        });
    }
  };