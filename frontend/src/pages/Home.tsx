// frontend/src/pages/Home.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { searchBooks } from "../api/books";
import BookSection from "../components/BookSection";
import type { Book } from "../types/book";

const Home = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      try {
        setLoading(true);
        setError("");

        // ONE API REQUEST instead of requesting
        // every category separately.
        const results = await searchBooks(
          "popular books",
          40
        );

        if (!cancelled) {
          setBooks(results);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load books."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------

  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(
      `/search?query=${encodeURIComponent(query)}`
    );
  };

  // -----------------------------------------
  // DISCOVER
  // -----------------------------------------

  const handleDiscover = () => {
    navigate("/search");
  };

  // -----------------------------------------
  // BOOK SECTIONS
  // -----------------------------------------

  const trendingBooks = useMemo(() => {
    return [...books]
      .sort(
        (a, b) =>
          (b.ratingsCount || 0) -
          (a.ratingsCount || 0)
      )
      .slice(0, 7);
  }, [books]);

  const topRatedBooks = useMemo(() => {
    return [...books]
      .filter(
        (book) =>
          Number(book.rating) > 0
      )
      .sort(
        (a, b) =>
          (b.rating || 0) -
          (a.rating || 0)
      )
      .slice(0, 7);
  }, [books]);

  const fantasyBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.genre?.some((genre) =>
          genre
            .toLowerCase()
            .includes("fantasy")
        )
      )
      .slice(0, 7);
  }, [books]);

  const mysteryBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.genre?.some((genre) => {
          const value =
            genre.toLowerCase();

          return (
            value.includes("mystery") ||
            value.includes("thriller") ||
            value.includes("crime")
          );
        })
      )
      .slice(0, 7);
  }, [books]);

  const romanceBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.genre?.some((genre) =>
          genre
            .toLowerCase()
            .includes("romance")
        )
      )
      .slice(0, 7);
  }, [books]);

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm opacity-70">
          Loading books...
        </p>
      </main>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <p className="text-sm opacity-70">
          {error}
        </p>

        <button
          onClick={() =>
            window.location.reload()
          }
          className="mt-5 border border-primary px-5 py-2 text-sm hover:opacity-60 transition-opacity"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="pb-16">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="px-5 pt-20 pb-16 text-center">

        

        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight">
          Find your next <span className="opacity-60">
             favourite book.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base md:text-lg opacity-70">
          Discover books, save your favourites,
          rate what you read, and find your next
          great story.
        </p>

        {/* SEARCH */}

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex max-w-2xl items-center border border-primary/30 bg-background px-4 py-3 shadow-sm transition-all focus-within:border-primary"
        >
          <Search
            size={20}
            className="mr-3 shrink-0 opacity-60"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search for a book, author..."
            className="w-full bg-transparent text-sm outline-none placeholder:opacity-50"
          />

          <button
            type="submit"
            className="ml-3 shrink-0 bg-primary px-5 py-2 text-sm text-background transition-opacity hover:opacity-80"
          >
            Search
          </button>
        </form>

        {/* DISCOVER BUTTON */}

        <button
          type="button"
          onClick={handleDiscover}
          className="mt-5 text-sm underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100"
        >
          Discover books →
        </button>

      </section>

      {/* =====================================
          BOOK SECTIONS
      ====================================== */}

      {trendingBooks.length > 0 && (
        <BookSection
          title="Trending Now"
          books={trendingBooks}
        />
      )}

      {topRatedBooks.length > 0 && (
        <BookSection
          title="Top Rated"
          books={topRatedBooks}
        />
      )}

      {fantasyBooks.length > 0 && (
        <BookSection
          title="Fantasy"
          books={fantasyBooks}
        />
      )}

      {mysteryBooks.length > 0 && (
        <BookSection
          title="Mystery & Thriller"
          books={mysteryBooks}
        />
      )}

      {romanceBooks.length > 0 && (
        <BookSection
          title="Romance"
          books={romanceBooks}
        />
      )}

      {books.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm opacity-70">
            No books found.
          </p>
        </div>
      )}

    </main>
  );
};

export default Home;