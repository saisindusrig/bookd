import BookCard from "./BookCard";
import type { Book } from "../types/book";

interface BookSectionProps {
  title: string;
  books: Book[];
}

const BookSection = ({
  title,
  books,
}: BookSectionProps) => {
  if (!books.length) {
    return null;
  }

  return (
    <section className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-5 flex items-center justify-between sm:mb-6">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          {title}
        </h2>
      </div>

      <div className="grid w-full grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {books.map((book) => (
          <BookCard
            key={`${book.source ?? "book"}-${book.id}`}
            book={book}
          />
        ))}
      </div>
    </section>
  );
};

export default BookSection;