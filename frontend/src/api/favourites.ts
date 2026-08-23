const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem(
    "token"
  );
};

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "You must be logged in."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type":
      "application/json",
  };
};

export interface Favourite {
  _id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
};

/*
|--------------------------------------------------------------------------
| ADD FAVOURITE
|--------------------------------------------------------------------------
*/

export const addFavourite =
  async (
    bookId: string
  ): Promise<Favourite> => {
    const response =
      await fetch(
        `${API_URL}/favourites/${encodeURIComponent(
          bookId
        )}`,
        {
          method: "POST",
          headers:
            getAuthHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to add favourite."
      );
    }

    return data.favourite;
  };

/*
|--------------------------------------------------------------------------
| REMOVE FAVOURITE
|--------------------------------------------------------------------------
*/

export const removeFavourite =
  async (
    bookId: string
  ): Promise<void> => {
    const response =
      await fetch(
        `${API_URL}/favourites/${encodeURIComponent(
          bookId
        )}`,
        {
          method: "DELETE",
          headers:
            getAuthHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to remove favourite."
      );
    }
  };

/*
|--------------------------------------------------------------------------
| CHECK FAVOURITE
|--------------------------------------------------------------------------
*/

export const checkFavourite =
  async (
    bookId: string
  ): Promise<boolean> => {
    const token =
      getToken();

    if (!token) {
      return false;
    }

    const response =
      await fetch(
        `${API_URL}/favourites/${encodeURIComponent(
          bookId
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to check favourite."
      );
    }

    return Boolean(
      data.isFavourite
    );
  };

/*
|--------------------------------------------------------------------------
| GET MY FAVOURITES
|--------------------------------------------------------------------------
*/

export const getMyFavourites =
  async (): Promise<
    Favourite[]
  > => {
    const response =
      await fetch(
        `${API_URL}/favourites`,
        {
          method: "GET",
          headers:
            getAuthHeaders(),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to get favourites."
      );
    }

    return data.favourites || [];
  };