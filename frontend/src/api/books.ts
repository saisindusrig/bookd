const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| SEARCH BOOKS
|--------------------------------------------------------------------------
*/

export const searchBooks = async (
  query: string,
  limit = 40
) => {
  const response = await fetch(
    `${API_URL}/books?q=${encodeURIComponent(
      query
    )}&limit=${limit}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch books."
    );
  }

  return data.books || [];
};

/*
|--------------------------------------------------------------------------
| GET SINGLE BOOK
|--------------------------------------------------------------------------
*/

export const getBook = async (
  id: string
) => {
  const response = await fetch(
    `${API_URL}/books/${encodeURIComponent(
      id
    )}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch book."
    );
  }

  return data.book || data;
};

/*
|--------------------------------------------------------------------------
| GET MULTIPLE BOOKS
|--------------------------------------------------------------------------
*/

export const getBooksByIds = async (
  ids: string[]
) => {
  if (!ids.length) {
    return [];
  }

  const response = await fetch(
    `${API_URL}/books/batch?ids=${ids
      .map((id) =>
        encodeURIComponent(id)
      )
      .join(",")}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch books."
    );
  }

  return data.books || [];
};