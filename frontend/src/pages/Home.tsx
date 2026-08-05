import React from 'react'
import BookSection from '../components/BookSection'
import type { Book } from '../types/book'
import Search from '../components/Search'
const trending: Book[] = [
  {
    id: "1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
    genre: ["Thriller", "Mystery", "Psychological"],
    rating: 4.5,
    ratingsCount: 18432,
    year: 2019,
    pages: 336,
    language: "English",
    trending: true,
    description:
      "A famous painter's shocking act of violence leaves everyone searching for the truth behind her silence."
  },

  {
    id: "2",
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
    genre: ["Fantasy", "Fiction", "Contemporary"],
    rating: 4.3,
    ratingsCount: 24321,
    year: 2020,
    pages: 304,
    language: "English",
    trending: true,
    description:
      "Between life and death there is a library, and within that library, the chance to try the lives you could have lived."
  },

  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    genre: ["Self-Help", "Psychology", "Productivity"],
    rating: 4.8,
    ratingsCount: 58231,
    year: 2018,
    pages: 320,
    language: "English",
    trending: true,
    description:
      "A practical guide to building good habits, breaking bad ones, and making small changes that create remarkable results."
  },

  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    genre: ["Classic", "Fiction", "Romance"],
    rating: 4.2,
    ratingsCount: 42112,
    year: 1925,
    pages: 180,
    language: "English",
     description:
      "Bilbo Baggins leaves his comfortable home and joins a dangerous adventure involving dwarves, dragons, and a mysterious ring."
  },

  {
    id: "5",
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    genre: ["Dystopian", "Science Fiction", "Classic"],
    rating: 4.7,
    ratingsCount: 67123,
    year: 1949,
    pages: 328,
    language: "English",
    trending: true,
    description:
      "In a world of constant surveillance, one man begins to question the system controlling every aspect of society."
  },

  {
    id: "6",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    genre: ["Classic", "Romance", "Fiction"],
    rating: 4.6,
    ratingsCount: 53212,
    year: 1813,
    pages: 432,
    language: "English",
     description:
      "Bilbo Baggins leaves his comfortable home and joins a dangerous adventure involving dwarves, dragons, and a mysterious ring."
  },
{
    id: "6",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    genre: ["Classic", "Romance", "Fiction"],
    rating: 4.6,
    ratingsCount: 53212,
    year: 1813,
    pages: 432,
    language: "English",
     description:
      "Bilbo Baggins leaves his comfortable home and joins a dangerous adventure involving dwarves, dragons, and a mysterious ring."
  }]
const Home = () => {
  return (
   <>
   <div className='text-6xl flex items-center justify-center p-13'>
        <h1>Discover books <span className='italic'>worth</span> reading.</h1>
        
      </div>
      
      <Search/>
   <BookSection title="Trending Now" books={trending}/>
   <BookSection title="Fantasy" books={trending}/>
   <BookSection title="Science Fiction" books={trending}/>
   </>
    
  )
}

export default Home