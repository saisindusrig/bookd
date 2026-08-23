import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getMyFavourites,
  type Favourite,
} from "../api/favourites";

import {
  getMyRatings,
  type Rating,
} from "../api/rating";

import {
  getBooksByIds,
} from "../api/books";

import type {
  Book,
} from "../types/book";

import BookCard from "../components/BookCard";

import {
  formatRating,
} from "../utils/formatNumber";

const Profile = () => {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const [
    favourites,
    setFavourites,
  ] = useState<Favourite[]>(
    []
  );

  const [
    favouriteBooks,
    setFavouriteBooks,
  ] = useState<Book[]>(
    []
  );

  const [
    ratings,
    setRatings,
  ] = useState<Rating[]>(
    []
  );

  const [
    ratedBooks,
    setRatedBooks,
  ] = useState<Book[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated ||
      !user
    ) {
      return;
    }

    let cancelled = false;

    const loadProfileData =
      async () => {
        try {
          setLoading(true);
          setError("");

          /*
           * Get saved books and ratings
           * at the same time.
           */

          const [
            favouriteData,
            ratingData,
          ] = await Promise.all([
            getMyFavourites(),
            getMyRatings(),
          ]);

          if (cancelled) {
            return;
          }

          setFavourites(
            favouriteData
          );

          setRatings(
            ratingData
          );

          /*
           * Extract book IDs.
           */

          const favouriteIds =
            favouriteData.map(
              (favourite) =>
                favourite.bookId
            );

          const ratingIds =
            ratingData.map(
              (rating) =>
                rating.bookId
            );

          /*
           * Fetch actual books.
           *
           * The backend already supports:
           *
           * GET /books/batch?ids=...
           */

          const [
            savedBooks,
            reviewedBooks,
          ] = await Promise.all([
            getBooksByIds(
              favouriteIds
            ),

            getBooksByIds(
              ratingIds
            ),
          ]);

          if (cancelled) {
            return;
          }

          setFavouriteBooks(
            savedBooks
          );

          setRatedBooks(
            reviewedBooks
          );
        } catch (profileError) {
          if (!cancelled) {
            console.error(
              "Failed to load profile:",
              profileError
            );

            setError(
              profileError instanceof
                Error
                ? profileError.message
                : "Failed to load your profile data."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadProfileData();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    isAuthenticated,
    user,
  ]);

  /*
   * Loading
   */

  if (
    authLoading ||
    loading
  ) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5">
        <p className="font-heading text-center text-sm opacity-70 sm:text-base">
          Loading profile...
        </p>
      </main>
    );
  }

  /*
   * Not logged in
   */

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5">
        <p className="font-heading text-center">
          Please log in to view
          your profile.
        </p>
      </main>
    );
  }

  /*
   * Error
   */

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-sm">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="mt-5 border border-primary px-5 py-2 text-sm transition-colors hover:bg-primary hover:text-background"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl overflow-x-hidden px-5 py-10 sm:px-8 lg:px-12">
      {/* =========================
          PROFILE HEADER
      ========================= */}

      <section className="mb-14 sm:mb-16">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">
          Profile
        </h1>

        <div className="mt-6">
          <p className="break-words text-xl font-semibold sm:text-2xl">
            {user.username}
          </p>

          <p className="mt-1 break-all text-sm opacity-70 sm:text-base">
            {user.email}
          </p>
        </div>
      </section>

      {/* =========================
          SAVED BOOKS
      ========================= */}

      <section className="mb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Saved Books
          </h2>

          <span className="shrink-0 text-xs opacity-60 sm:text-sm">
            {favourites.length}{" "}
            {favourites.length === 1
              ? "book"
              : "books"}
          </span>
        </div>

        {favouriteBooks.length ===
        0 ? (
          <p className="text-sm opacity-60 sm:text-base">
            You haven't saved
            any books yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {favouriteBooks.map(
              (book) => (
                <BookCard
                  key={`${book.source ?? "book"}-${book.id}`}
                  book={book}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* =========================
          MY RATINGS
      ========================= */}

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            My Ratings & Reviews
          </h2>

          <span className="shrink-0 text-xs opacity-60 sm:text-sm">
            {ratings.length}{" "}
            {ratings.length === 1
              ? "review"
              : "reviews"}
          </span>
        </div>

        {ratings.length ===
        0 ? (
          <p className="text-sm opacity-60 sm:text-base">
            You haven't rated
            any books yet.
          </p>
        ) : (
          <div className="space-y-10">
            {ratings.map(
              (rating) => {
                /*
                 * Find the actual book
                 * associated with this rating.
                 */

                const book =
                  ratedBooks.find(
                    (item) =>
                      item.id ===
                      rating.bookId
                  );

                return (
                  <article
                    key={rating._id}
                    className="border-b border-primary/20 pb-8"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words font-heading text-xl font-bold sm:text-2xl">
                          {book?.title ||
                            "Unknown Book"}
                        </h3>

                        {book?.author && (
                          <p className="mt-1 text-sm opacity-60">
                            {book.author}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 text-lg">
                        <span>
                          {"★".repeat(
                            rating.rating
                          )}
                        </span>

                        <span className="opacity-30">
                          {"☆".repeat(
                            5 -
                              rating.rating
                          )}
                        </span>

                        <span className="ml-2 text-sm opacity-60">
                          {formatRating(
                            rating.rating
                          )}
                        </span>
                      </div>
                    </div>

                    {/* COMMENT */}

                    {rating.comment && (
                      <div className="mt-4 max-w-3xl">
                        <p className="break-words text-sm leading-7 opacity-80 sm:text-base">
                          "{rating.comment}"
                        </p>
                      </div>
                    )}

                    {/* DATE */}

                    <p className="mt-3 text-xs opacity-50 sm:text-sm">
                      {new Date(
                        rating.createdAt
                      ).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month:
                            "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;