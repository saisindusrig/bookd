import {
  useEffect,
  useState,
} from "react";

import BookCard from "../components/BookCard";

import type { Book } from "../types/book";

import { searchBooks } from "../api/books";

import { getTopRatedBooks } from "../utils/bookFilters";

const TopBooks = () => {
  const [books, setBooks] =
    useState<Book[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTopBooks = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * There is no reliable "trending" endpoint
         * in your current providers.
         *
         * So BOOKD uses popular books and sorts
         * them by rating.
         */

        const result =
          await searchBooks(
            "best books",
            40
          );

        if (!cancelled) {
          setBooks(
            getTopRatedBooks(
              result,
              30
            )
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          console.error(
            "Failed to load top books:",
            requestError
          );

          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load top books."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTopBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          Top Books
        </h1>

        <p className="mt-2 text-sm opacity-70 sm:text-base">
          Highly rated books on BOOKD.
        </p>

        {loading && (
          <p className="mt-10 text-center text-sm opacity-70">
            Loading top books...
          </p>
        )}

        {error && (
          <p className="mt-10 text-center text-sm">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          books.length === 0 && (
            <p className="mt-10 text-center text-sm opacity-70">
              No books found.
            </p>
          )}

        {!loading &&
          !error &&
          books.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {books.map(
                (book) => (
                  <BookCard
                    key={`${book.source ?? "book"}-${book.id}`}
                    book={book}
                  />
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
};

export default TopBooks;