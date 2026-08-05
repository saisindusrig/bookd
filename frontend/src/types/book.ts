export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string[];
  rating: number;
  ratingsCount: number;
  year: number;
  description: string;
  pages: number;
  language: string;
  trending?: boolean;
}

