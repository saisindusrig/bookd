const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export interface Rating {
  _id: string;

  userId:
    | string
    | {
        _id: string;
        username: string;
      };

  bookId: string;

  rating: number;

  comment: string;

  createdAt: string;

  updatedAt: string;
}

export interface BookRatingsResponse {
  ratings: Rating[];
  bookdRating: number;
  ratingCount: number;
}

const getToken = () => {
  return localStorage.getItem(
    "token"
  );
};

const authHeaders = () => {
  const token =
    getToken();

  if (!token) {
    throw new Error(
      "You must be logged in."
    );
  }

  return {
    "Content-Type":
      "application/json",

    Authorization:
      `Bearer ${token}`,
  };
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createRating =
  async (
    bookId: string,
    data: {
      rating: number;
      comment: string;
    }
  ): Promise<Rating> => {
    const response =
      await fetch(
        `${API_URL}/ratings/${encodeURIComponent(
          bookId
        )}`,
        {
          method: "POST",
          headers:
            authHeaders(),
          body: JSON.stringify(
            data
          ),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to create rating."
      );
    }

    return result.rating;
  };

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateRating =
  async (
    bookId: string,
    data: {
      rating: number;
      comment: string;
    }
  ): Promise<Rating> => {
    const response =
      await fetch(
        `${API_URL}/ratings/${encodeURIComponent(
          bookId
        )}`,
        {
          method: "PUT",
          headers:
            authHeaders(),
          body: JSON.stringify(
            data
          ),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to update rating."
      );
    }

    return result.rating;
  };

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteRating =
  async (
    bookId: string
  ): Promise<void> => {
    const response =
      await fetch(
        `${API_URL}/ratings/${encodeURIComponent(
          bookId
        )}`,
        {
          method: "DELETE",
          headers:
            authHeaders(),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to delete rating."
      );
    }
  };

/*
|--------------------------------------------------------------------------
| MY RATING
|--------------------------------------------------------------------------
*/

export const getMyRating =
  async (
    bookId: string
  ): Promise<Rating | null> => {
    const response =
      await fetch(
        `${API_URL}/ratings/${encodeURIComponent(
          bookId
        )}/me`,
        {
          method: "GET",
          headers:
            authHeaders(),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to get your rating."
      );
    }

    return result.rating ||
      null;
  };

/*
|--------------------------------------------------------------------------
| ALL BOOK RATINGS
|--------------------------------------------------------------------------
*/

export const getBookRatings =
  async (
    bookId: string
  ): Promise<BookRatingsResponse> => {
    const response =
      await fetch(
        `${API_URL}/ratings/${encodeURIComponent(
          bookId
        )}`,
        {
          method: "GET",
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to get book ratings."
      );
    }

    return {
      ratings:
        result.ratings || [],

      bookdRating:
        Number(
          result.bookdRating || 0
        ),

      ratingCount:
        Number(
          result.ratingCount || 0
        ),
    };
  };

/*
|--------------------------------------------------------------------------
| MY RATINGS
|--------------------------------------------------------------------------
*/

export const getMyRatings =
  async (): Promise<
    Rating[]
  > => {
    const response =
      await fetch(
        `${API_URL}/ratings/me`,
        {
          method: "GET",
          headers:
            authHeaders(),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to get your ratings."
      );
    }

    return result.ratings || [];
  };