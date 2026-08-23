import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { searchBooks } from "../api/books";
import type { Book } from "../types/book";
import BookCard from "../components/BookCard";
import BookFilters from "../components/BookFilters";
import {
  filterAndSortBooks,
  type BookFilterOptions,
} from "../utils/bookFilters";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<BookFilterOptions>({
    genre: "",
    minRating: "",
    language: "",
    sortBy: "",
  });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError("");
        setBooks(await searchBooks(query));
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load books.");
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [query]);

  const genres = useMemo(
    () => [...new Set(books.flatMap((book) => book.genre))].sort(),
    [books]
  );

  const languages = useMemo(
    () =>
      [...new Set(books.map((book) => book.language).filter(Boolean) as string[])].sort(),
    [books]
  );

  const filteredBooks = useMemo(
    () => filterAndSortBooks(books, filters),
    [books, filters]
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = searchTerm.trim();
    navigate(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
  };

  return (
    <main className="min-h-screen bg-background px-5 py-10 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl">
          <Search
            size={19}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title, author, or genre"
            className="w-full rounded-md border border-primary/30 bg-background py-3 pl-10 pr-4 outline-none focus:border-primary"
          />
        </form>

        <BookFilters
          filters={filters}
          setFilters={setFilters}
          genres={genres}
          languages={languages}
        />

        <header className="mt-10">
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            Search results for "{query}"
          </h1>
          <p className="mt-2 text-sm opacity-70">
            {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
          </p>
        </header>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">Loading books...</div>
        ) : error ? (
          <div className="flex min-h-[300px] items-center justify-center text-center">{error}</div>
        ) : filteredBooks.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center text-center">
            <div>
              <h2 className="font-heading text-2xl font-bold">No books found</h2>
              <p className="mt-2 text-sm opacity-60">
                Try changing your filters or search.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResults;
