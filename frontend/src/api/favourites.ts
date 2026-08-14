const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

export interface Favourite {
  _id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
}

export const addFavourite = async (
  bookId: string
): Promise<Favourite> => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(
    `${API_URL}/favourites/${bookId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add favourite"
    );
  }

  return data.favourite;
};

export const removeFavourite = async (
  bookId: string
): Promise<void> => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(
    `${API_URL}/favourites/${bookId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to remove favourite"
    );
  }
};

export const checkFavourite = async (
  bookId: string
): Promise<boolean> => {
  const token = getToken();

  if (!token) {
    return false;
  }

  const response = await fetch(
    `${API_URL}/favourites/${bookId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to check favourite"
    );
  }

  return data.isFavourite;
};

export const getMyFavourites = async (): Promise<
  Favourite[]
> => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(
    `${API_URL}/favourites`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get favourites"
    );
  }

  return data.favourites;
};