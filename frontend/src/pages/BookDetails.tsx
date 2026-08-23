import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getBook,
} from "../api/books";

import type { Book } from "../types/book";

import {
  useAuth,
} from "../context/AuthContext";

import {
  addFavourite,
  removeFavourite,
  checkFavourite,
} from "../api/favourites";

import {
  createRating,
  getMyRating,
  updateRating,
  deleteRating,
  getBookRatings,
  type Rating,
} from "../api/rating";

import {
  Heart,
  EllipsisVertical,
  Star,
  ArrowLeft,
} from "lucide-react";

import {
  formatRating,
} from "../utils/formatNumber";

interface LocationState {
  book?: Book;
}

const BookDetails = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    isAuthenticated,
    loading,
  } = useAuth();

  /*
   * =========================
   * ROUTER STATE
   * =========================
   */

  const locationState =
    location.state as
      | LocationState
      | null;

  const initialBook =
    locationState?.book || null;

  /*
   * =========================
   * BOOK
   * =========================
   */

  const [book, setBook] =
    useState<Book | null>(
      initialBook
    );

  const [bookLoading, setBookLoading] =
    useState(
      !initialBook
    );

  const [bookError, setBookError] =
    useState("");

  /*
   * =========================
   * BOOKD RATINGS
   * =========================
   */

  const [bookRatings, setBookRatings] =
    useState<Rating[]>([]);

  const [bookdRating, setBookdRating] =
    useState(0);

  const [ratingCount, setRatingCount] =
    useState(0);

  /*
   * =========================
   * FAVOURITE
   * =========================
   */

  const [isFavourite, setIsFavourite] =
    useState(false);

  const [
    favouriteLoading,
    setFavouriteLoading,
  ] = useState(false);

  /*
   * =========================
   * USER RATING
   * =========================
   */

  const [
    selectedRating,
    setSelectedRating,
  ] = useState(0);

  const [
    comment,
    setComment,
  ] = useState("");

  const [
    myRating,
    setMyRating,
  ] = useState<Rating | null>(
    null
  );

  const [
    ratingLoading,
    setRatingLoading,
  ] = useState(false);

  const [
    ratingError,
    setRatingError,
  ] = useState("");

  const [
    isEditingRating,
    setIsEditingRating,
  ] = useState(false);

  const [
    showRatingMenu,
    setShowRatingMenu,
  ] = useState(false);

  /*
   * =========================
   * BACK
   * =========================
   */

 const handleBack = () => {
  const historyState =
    window.history.state;

  if (
    historyState &&
    typeof historyState.idx ===
      "number" &&
    historyState.idx > 0
  ) {
    navigate(-1);
    return;
  }

  navigate("/", {
    replace: true,
  });
};

  /*
   * =========================
   * LOAD BOOK
   * =========================
   */

  useEffect(() => {
    if (!id) {
      setBookError(
        "Book ID is missing."
      );

      setBookLoading(false);

      return;
    }

    /*
     * IMPORTANT:
     *
     * If BookCard already gave us
     * the complete book, don't make
     * another request.
     */

    if (initialBook) {
      setBook(
        initialBook
      );

      setBookLoading(false);

      return;
    }

    let cancelled = false;

    const loadBook =
      async () => {
        try {
          setBookLoading(true);
          setBookError("");

          const result =
            await getBook(id);

          if (!cancelled) {
            setBook(result);
          }
        } catch (error) {
          if (!cancelled) {
            setBookError(
              error instanceof Error
                ? error.message
                : "Unable to load this book."
            );
          }
        } finally {
          if (!cancelled) {
            setBookLoading(false);
          }
        }
      };

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    initialBook,
  ]);

  /*
   * =========================
   * LOAD BOOKD RATINGS
   * =========================
   */

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const loadRatings =
      async () => {
        try {
          setRatingError("");

          /*
           * Run both requests at the
           * same time.
           */

          const [
            ratingsData,
            userRating,
          ] = await Promise.all([
            getBookRatings(id),

            isAuthenticated
              ? getMyRating(id)
              : Promise.resolve(
                  null
                ),
          ]);

          if (cancelled) {
            return;
          }

          setBookRatings(
            ratingsData.ratings
          );

          setBookdRating(
            ratingsData.bookdRating
          );

          setRatingCount(
            ratingsData.ratingCount
          );

          setMyRating(
            userRating
          );

          if (userRating) {
            setSelectedRating(
              userRating.rating
            );

            setComment(
              userRating.comment
            );
          } else {
            setSelectedRating(0);
            setComment("");
          }
        } catch (error) {
          if (!cancelled) {
            console.error(
              "Failed to load book ratings:",
              error
            );

            setRatingError(
              "Failed to load ratings."
            );
          }
        }
      };

    loadRatings();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    isAuthenticated,
  ]);

  /*
   * =========================
   * LOAD FAVOURITE
   * =========================
   */

  useEffect(() => {
    if (
      loading ||
      !id ||
      !isAuthenticated
    ) {
      setIsFavourite(false);

      return;
    }

    let cancelled = false;

    const loadFavourite =
      async () => {
        try {
          const status =
            await checkFavourite(
              id
            );

          if (!cancelled) {
            setIsFavourite(
              status
            );
          }
        } catch (error) {
          if (!cancelled) {
            console.error(
              "Failed to load favourite status:",
              error
            );
          }
        }
      };

    loadFavourite();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    isAuthenticated,
    loading,
  ]);

  /*
   * =========================
   * OTHER REVIEWS
   * =========================
   */

  const otherRatings =
    bookRatings.filter(
      (rating) =>
        rating._id !==
        myRating?._id
    );

  /*
   * =========================
   * SUBMIT / UPDATE RATING
   * =========================
   */

  const handleRatingSubmit =
    async () => {
      if (!isAuthenticated) {
        navigate("/login");

        return;
      }

      if (!id) {
        return;
      }

      if (
        selectedRating === 0
      ) {
        setRatingError(
          "Please select a rating."
        );

        return;
      }

      if (!comment.trim()) {
        setRatingError(
          "Please write a comment."
        );

        return;
      }

      try {
        setRatingLoading(true);
        setRatingError("");

        let savedRating: Rating;

        /*
         * UPDATE
         */

        if (
          isEditingRating &&
          myRating
        ) {
          savedRating =
            await updateRating(
              id,
              {
                rating:
                  selectedRating,

                comment:
                  comment.trim(),
              }
            );
        }

        /*
         * CREATE
         */

        else {
          savedRating =
            await createRating(
              id,
              {
                rating:
                  selectedRating,

                comment:
                  comment.trim(),
              }
            );
        }

        /*
         * Build the new ratings array
         * BEFORE setting state.
         *
         * This avoids using stale
         * bookRatings state.
         */

        const updatedRatings =
          bookRatings.some(
            (rating) =>
              rating._id ===
              savedRating._id
          )
            ? bookRatings.map(
                (rating) =>
                  rating._id ===
                  savedRating._id
                    ? savedRating
                    : rating
              )
            : [
                savedRating,
                ...bookRatings,
              ];

        /*
         * Update review list.
         */

        setBookRatings(
          updatedRatings
        );

        /*
         * Update current user's review.
         */

        setMyRating(
          savedRating
        );

        /*
         * Recalculate BOOKD rating.
         */

        const total =
          updatedRatings.reduce(
            (
              sum,
              rating
            ) =>
              sum +
              rating.rating,
            0
          );

        const count =
          updatedRatings.length;

        const average =
          count > 0
            ? Number(
                (
                  total /
                  count
                ).toFixed(1)
              )
            : 0;

        setBookdRating(
          average
        );

        setRatingCount(
          count
        );

        /*
         * Exit editing mode.
         */

        setIsEditingRating(
          false
        );

        setShowRatingMenu(
          false
        );
      } catch (error) {
        console.error(
          "Failed to submit rating:",
          error
        );

        setRatingError(
          error instanceof Error
            ? error.message
            : "Failed to submit rating."
        );
      } finally {
        setRatingLoading(
          false
        );
      }
    };

  /*
   * =========================
   * DELETE RATING
   * =========================
   */

  const handleRatingDelete =
    async () => {
      if (
        !id ||
        !myRating
      ) {
        return;
      }

      try {
        setRatingLoading(true);
        setRatingError("");

        await deleteRating(
          id
        );

        /*
         * Remove deleted rating.
         */

        const updatedRatings =
          bookRatings.filter(
            (rating) =>
              rating._id !==
              myRating._id
          );

        setBookRatings(
          updatedRatings
        );

        /*
         * Recalculate BOOKD rating.
         */

        const total =
          updatedRatings.reduce(
            (
              sum,
              rating
            ) =>
              sum +
              rating.rating,
            0
          );

        const count =
          updatedRatings.length;

        const average =
          count > 0
            ? Number(
                (
                  total /
                  count
                ).toFixed(1)
              )
            : 0;

        setBookdRating(
          average
        );

        setRatingCount(
          count
        );

        /*
         * Reset user's rating.
         */

        setMyRating(null);

        setSelectedRating(
          0
        );

        setComment("");

        setShowRatingMenu(
          false
        );
      } catch (error) {
        console.error(
          "Failed to delete rating:",
          error
        );

        setRatingError(
          error instanceof Error
            ? error.message
            : "Failed to delete rating."
        );
      } finally {
        setRatingLoading(
          false
        );
      }
    };

  /*
   * =========================
   * CANCEL EDITING
   * =========================
   */

  const handleCancelEdit =
    () => {
      if (myRating) {
        setSelectedRating(
          myRating.rating
        );

        setComment(
          myRating.comment
        );
      }

      setIsEditingRating(
        false
      );

      setRatingError("");
    };

  /*
   * =========================
   * FAVOURITE
   * =========================
   */

  const handleFavourite =
    async () => {
      if (loading) {
        return;
      }

      if (!isAuthenticated) {
        navigate("/login");

        return;
      }

      if (
        !id ||
        favouriteLoading
      ) {
        return;
      }

      try {
        setFavouriteLoading(
          true
        );

        if (isFavourite) {
          await removeFavourite(
            id
          );

          setIsFavourite(
            false
          );
        } else {
          await addFavourite(
            id
          );

          setIsFavourite(
            true
          );
        }
      } catch (error) {
        console.error(
          "Failed to update favourite:",
          error
        );
      } finally {
        setFavouriteLoading(
          false
        );
      }
    };

  /*
   * =========================
   * LOADING
   * =========================
   */

  if (bookLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm opacity-70">
          Loading book...
        </p>
      </main>
    );
  }

  /*
   * =========================
   * ERROR
   * =========================
   */

  if (!book) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <p className="text-sm opacity-70">
          {bookError ||
            "Book not found."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          className="mt-5 border border-primary px-5 py-2 text-sm transition-opacity hover:opacity-60"
        >
          Go Home
        </button>
      </main>
    );
  }

  /*
   * =========================
   * PAGE
   * =========================
   */

  return (
    <main className="w-full px-5 pb-16 sm:px-8 lg:px-12">
      {/* BACK BUTTON */}

      <button
        type="button"
        onClick={
          handleBack
        }
        aria-label="Go back"
        className="mb-8 mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary hover:text-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <ArrowLeft
          size={20}
          strokeWidth={1.75}
        />
      </button>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:gap-12">
        {/* COVER */}

        <div className="w-full shrink-0 lg:w-[250px]">
          <img
            src={book.cover}
            alt={`Cover of ${book.title}`}
            className="mx-auto w-full max-w-[250px] object-cover shadow-sm"
          />

          {/* SAVE */}

          <button
            type="button"
            onClick={
              handleFavourite
            }
            disabled={
              favouriteLoading
            }
            className="mt-4 flex w-full items-center justify-center gap-2 py-3 transition-opacity hover:opacity-60 disabled:opacity-50"
          >
            <Heart
              size={22}
              strokeWidth={1.5}
              fill={
                isFavourite
                  ? "currentColor"
                  : "none"
              }
            />

            <span>
              {isFavourite
                ? "Saved"
                : "Save"}
            </span>
          </button>

          {/* BOOKD RATING */}

          <div className="mt-2 flex items-center justify-center gap-2 py-2 text-sm">
            <Star
              size={18}
              fill="currentColor"
            />

            <span>
              {bookdRating > 0
                ? formatRating(
                    bookdRating
                  )
                : "N/A"}
            </span>

            <span className="opacity-60">
              BOOKD
            </span>
          </div>

          {ratingCount > 0 && (
            <p className="text-center text-xs opacity-60">
              {ratingCount}{" "}
              {ratingCount === 1
                ? "rating"
                : "ratings"}
            </p>
          )}
        </div>

        {/* BOOK INFORMATION */}

        <div className="min-w-0 flex-1">
          {/* TITLE */}

          <h1 className="break-words font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {book.title}
          </h1>

          {/* AUTHOR */}

          <p className="mt-2 break-words font-heading text-xl opacity-70 sm:text-2xl">
            {book.author}
          </p>

          {/* API RATING */}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-2xl opacity-70 sm:text-3xl">
              <Star
                color="#FF9900"
                fill="#FF9900"
                size={26}
              />

              {formatRating(
                book.rating
              )}
            </span>

            <span className="text-sm opacity-70 sm:text-base">
              ({book.ratingsCount}{" "}
              ratings)
            </span>
          </div>

          {/* DESCRIPTION */}

          <div className="mt-8 max-w-3xl">
            <p className="mb-2 text-sm opacity-70">
              Description
            </p>

            <p className="break-words text-sm leading-7 sm:text-base">
              {book.description ||
                "No description available."}
            </p>
          </div>

          {/* DETAILS */}

          <div className="mt-8 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:text-base lg:grid-cols-3">
            <div>
              <p className="opacity-70">
                Published Year
              </p>

              <p>
                {book.year ||
                  "Unknown"}
              </p>
            </div>

            {book.pages > 0 && (
              <div>
                <p className="opacity-70">
                  Pages
                </p>

                <p>
                  {book.pages}
                </p>
              </div>
            )}

            <div>
              <p className="opacity-70">
                Genre
              </p>

              <p>
                {book.genre.join(
                  ", "
                )}
              </p>
            </div>
          </div>

          {/* BOOKD RATING SECTION */}

          <section className="mt-14 sm:mt-16">
            <h2 className="font-heading text-2xl sm:text-3xl">
              BOOKD Rating
            </h2>

            {/* NEW REVIEW */}

            {!myRating &&
              !isEditingRating && (
                <div className="mt-6 max-w-xl">
                  <p className="mb-3 text-sm opacity-70">
                    Rate this book
                  </p>

                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setSelectedRating(
                              star
                            )
                          }
                          className="p-1 text-2xl transition-opacity hover:opacity-60 sm:text-3xl"
                          aria-label={`Rate ${star} out of 5`}
                        >
                          {star <=
                          selectedRating
                            ? "★"
                            : "☆"}
                        </button>
                      )
                    )}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(
                      event
                    ) =>
                      setComment(
                        event.target.value
                      )
                    }
                    placeholder="Write your review..."
                    rows={5}
                    maxLength={1000}
                    className="w-full resize-y border border-primary/30 bg-transparent p-3 text-sm outline-none focus:border-primary sm:p-4 sm:text-base"
                  />

                  {ratingError && (
                    <p className="mt-2 text-sm">
                      {ratingError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={
                      handleRatingSubmit
                    }
                    disabled={
                      ratingLoading
                    }
                    className="mt-4 w-full border border-primary px-6 py-3 text-sm transition-opacity hover:opacity-60 disabled:opacity-50 sm:w-auto sm:text-base"
                  >
                    {ratingLoading
                      ? "Saving..."
                      : "Submit Rating"}
                  </button>
                </div>
              )}

            {/* YOUR REVIEW */}

            {myRating &&
              !isEditingRating && (
                <div className="relative mt-6 max-w-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 text-sm opacity-60">
                        Your Review
                      </p>

                      <div className="text-xl">
                        {"★".repeat(
                          myRating.rating
                        )}
                        {"☆".repeat(
                          5 -
                            myRating.rating
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowRatingMenu(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        aria-label="Review options"
                        className="p-1 opacity-70 transition-opacity hover:opacity-100"
                      >
                        <EllipsisVertical
                          size={22}
                        />
                      </button>

                      {showRatingMenu && (
                        <div className="absolute right-0 top-8 z-10 w-32 border border-primary/20 bg-background text-primary shadow-md">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingRating(
                                true
                              );

                              setShowRatingMenu(
                                false
                              );

                              setRatingError(
                                ""
                              );
                            }}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-primary hover:text-background"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={
                              handleRatingDelete
                            }
                            disabled={
                              ratingLoading
                            }
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-primary hover:text-background disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 break-words text-sm leading-6 sm:text-base">
                    {myRating.comment}
                  </p>

                  <p className="mt-2 text-xs opacity-60 sm:text-sm">
                    {new Date(
                      myRating.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

            {/* EDIT */}

            {myRating &&
              isEditingRating && (
                <div className="mt-6 max-w-xl">
                  <p className="mb-3 text-sm opacity-70">
                    Edit your review
                  </p>

                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setSelectedRating(
                              star
                            )
                          }
                          className="p-1 text-2xl transition-opacity hover:opacity-60 sm:text-3xl"
                          aria-label={`Rate ${star} out of 5`}
                        >
                          {star <=
                          selectedRating
                            ? "★"
                            : "☆"}
                        </button>
                      )
                    )}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(
                      event
                    ) =>
                      setComment(
                        event.target.value
                      )
                    }
                    rows={5}
                    maxLength={1000}
                    className="w-full resize-y border border-primary/30 bg-transparent p-3 text-sm outline-none focus:border-primary sm:p-4 sm:text-base"
                  />

                  {ratingError && (
                    <p className="mt-2 text-sm">
                      {ratingError}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={
                        handleRatingSubmit
                      }
                      disabled={
                        ratingLoading
                      }
                      className="mt-4 w-full border border-primary px-6 py-3 text-sm transition-opacity hover:opacity-60 disabled:opacity-50 sm:w-auto"
                    >
                      {ratingLoading
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleCancelEdit
                      }
                      disabled={
                        ratingLoading
                      }
                      className="mt-1 w-full px-4 py-3 text-sm opacity-70 transition-opacity hover:opacity-100 sm:mt-4 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
          </section>

          {/* OTHER REVIEWS */}

          <section className="mt-14 sm:mt-16">
            <h2 className="font-heading text-2xl sm:text-3xl">
              Other BOOKD Reviews
            </h2>

            {otherRatings.length === 0 ? (
              <p className="mt-6 text-sm opacity-70 sm:text-base">
                No other BOOKD reviews yet.
              </p>
            ) : (
              <div className="mt-6 space-y-8">
                {otherRatings.map(
                  (rating) => (
                    <article
                      key={rating._id}
                      className="max-w-xl"
                    >
                      <div className="text-lg sm:text-xl">
                        {"★".repeat(
                          rating.rating
                        )}
                        {"☆".repeat(
                          5 -
                            rating.rating
                        )}
                      </div>

                      <p className="mt-2 break-words text-sm leading-6 sm:text-base">
                        {rating.comment}
                      </p>

                      <p className="mt-2 text-xs opacity-60 sm:text-sm">
                        {new Date(
                          rating.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default BookDetails;