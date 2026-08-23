import type { Book } from "../types/book";

export interface BookFilterOptions {
  genre: string;
  minRating: string;
  language: string;
  sortBy: string;
}

export function filterAndSortBooks(
  books: Book[],
  filters: BookFilterOptions
): Book[] {
  let result = [...books];

  if (filters.genre) {
    result = result.filter((book) =>
      book.genre.some(
        (genre) =>
          genre
            .toLowerCase()
            .includes(
              filters.genre.toLowerCase()
            )
      )
    );
  }

  if (filters.minRating) {
    const minimumRating = Number(
      filters.minRating
    );

    result = result.filter(
      (book) =>
        book.rating >= minimumRating
    );
  }

  if (filters.language) {
    result = result.filter(
      (book) =>
        book.language
          ?.toLowerCase() ===
        filters.language.toLowerCase()
    );
  }

  switch (filters.sortBy) {
    case "rating-high":
      result.sort(
        (a, b) =>
          b.rating - a.rating
      );
      break;

    case "rating-low":
      result.sort(
        (a, b) =>
          a.rating - b.rating
      );
      break;

    case "newest":
      result.sort(
        (a, b) =>
          b.year - a.year
      );
      break;

    case "oldest":
      result.sort(
        (a, b) =>
          a.year - b.year
      );
      break;

    case "most-reviewed":
      result.sort(
        (a, b) =>
          b.ratingsCount -
          a.ratingsCount
      );
      break;

    default:
      break;
  }

  return result;
}

/*
 * Sort books by rating.
 *
 * If two books have the same rating,
 * the book with more ratings comes first.
 */
export function getTopRatedBooks(
  books: Book[],
  limit = 14
): Book[] {
  return [...books]
    .filter(
      (book) => book.rating > 0
    )
    .sort((a, b) => {
      if (
        b.rating !== a.rating
      ) {
        return b.rating - a.rating;
      }

      return (
        b.ratingsCount -
        a.ratingsCount
      );
    })
    .slice(0, limit);
}

/*
 * Get books belonging to a genre.
 *
 * We use includes() instead of exact matching
 * because APIs return values such as:
 *
 * "Science Fiction"
 * "Science fiction"
 * "Fiction / Science Fiction"
 */
export function getGenreBooks(
  books: Book[],
  genres: string[],
  limit = 14
): Book[] {
  const normalizedGenres =
    genres.map((genre) =>
      genre.toLowerCase()
    );

  return books
    .filter((book) =>
      book.genre.some((bookGenre) => {
        const normalized =
          bookGenre.toLowerCase();

        return normalizedGenres.some(
          (genre) =>
            normalized.includes(
              genre
            )
        );
      })
    )
    .sort((a, b) => {
      if (
        b.rating !== a.rating
      ) {
        return b.rating - a.rating;
      }

      return (
        b.ratingsCount -
        a.ratingsCount
      );
    })
    .slice(0, limit);
}

/*
 * Trending fallback.
 *
 * Your APIs don't reliably give us a true
 * "trending" field, so BOOKD uses highly-rated
 * books as the fallback.
 */
export function getTrendingBooks(
  books: Book[],
  limit = 14
): Book[] {
  const explicitlyTrending =
    books.filter(
      (book) =>
        book.trending === true
    );

  const highlyRated =
    books
      .filter(
        (book) =>
          book.rating > 0
      )
      .sort((a, b) => {
        if (
          b.rating !== a.rating
        ) {
          return b.rating - a.rating;
        }

        return (
          b.ratingsCount -
          a.ratingsCount
        );
      });

  const combined = [
    ...explicitlyTrending,
    ...highlyRated,
  ];

  const seen = new Set<string>();

  return combined
    .filter((book) => {
      const key =
        `${book.source ?? ""}-${book.id}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, limit);
}