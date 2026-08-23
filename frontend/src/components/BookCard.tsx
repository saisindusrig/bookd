import { useNavigate } from "react-router-dom";
import type { Book } from "../types/book";
import { formatRating } from "../utils/formatNumber";

interface BookCardProps {
  book: Book;
}

const BookCard = ({
  book,
}: BookCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/book/${encodeURIComponent(
        book.id
      )}`,
      {
        state: {
          book,
        },
      }
    );
  };

  return (
    <article
      onClick={handleClick}
      className="group min-w-0 cursor-pointer"
    >
      {/* COVER */}

      <div className="relative w-full overflow-hidden">
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="aspect-[2/3] w-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* BOOK INFORMATION */}

      <div className="min-w-0 px-1 sm:px-2">
        {/* TITLE */}

        <div className="relative mt-2">
          <h3
            title={book.title}
            className="line-clamp-2 min-h-[2.5rem] overflow-hidden text-center text-sm font-bold leading-5"
          >
            {book.title}
          </h3>

          {/* DESKTOP TOOLTIP */}

          <div
            className="
              pointer-events-none
              invisible
              absolute
              bottom-full
              left-1/2
              z-50
              mb-2
              w-max
              max-w-[260px]
              -translate-x-1/2
              rounded-md
              bg-black
              px-3
              py-2
              text-xs
              font-normal
              leading-4
              text-white
              opacity-0
              shadow-lg
              transition-all
              duration-200
              group-hover:visible
              group-hover:opacity-100
              max-sm:hidden
            "
          >
            {book.title}

            <span
              className="
                absolute
                left-1/2
                top-full
                -translate-x-1/2
                border-x-4
                border-t-4
                border-x-transparent
                border-t-black
              "
            />
          </div>
        </div>

        {/* AUTHOR */}

        <p
          title={book.author}
          className="mt-1 line-clamp-2 text-center text-xs leading-4 opacity-70 sm:text-sm"
        >
          {book.author}
        </p>

        {/* API RATING */}

        <p className="mt-1 text-center text-xs opacity-80 sm:text-sm">
          ★{" "}
          {formatRating(
            book.rating
          )}
        </p>
      </div>
    </article>
  );
};

export default BookCard;