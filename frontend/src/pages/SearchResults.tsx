import { useSearchParams } from "react-router-dom";
import { books } from "../data/books";
import { searchBooks } from "../utils/searchBooks";
import BookCard from "../components/BookCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const results = searchBooks(books, query);

  return (
    <main className="px-6 py-10">

      <h1 className="font-heading text-3xl">
        Search results
      </h1>

      <p className="mt-2 opacity-70">
        Results for "{query}"
      </p>

      {results.length === 0 ? (
        <p className="mt-10 text-center opacity-60">
          No books found.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((book) => (
            <BookCard
             key={book.id}
              book={book}
            />
          ))}
        </div>
      )}

    </main>
  );
};

export default SearchResults;