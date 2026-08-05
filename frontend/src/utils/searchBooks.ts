import type { Book } from "../types/book";

export const searchBooks = (
  books: Book[],
  query: string
): Book[] => {
  const searchTerm = query.toLowerCase().trim();

  // If nothing was searched, return nothing
  if (!searchTerm) {
    return [];
  }

  return books.filter((book) => {
    const titleMatch = book.title
      .toLowerCase()
      .includes(searchTerm);

    const authorMatch = book.author
      .toLowerCase()
      .includes(searchTerm);

    const genreMatch = book.genre.some((genre) =>
      genre.toLowerCase().includes(searchTerm)
    );

    return titleMatch || authorMatch || genreMatch;
  });
};