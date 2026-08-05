import React from 'react'
import BookCard from './BookCard'
import type { Book } from '../types/book'
const BookSection = ({title,books}:{title:string, books: Book[]}) => {
  return (
    <div>
    <div className='text-2xl p-5 font-heading'>{title.toUpperCase()}</div>
    <div className='grid grid-cols-3 gap-11 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 pr-5 pl-5 pb-12 '>
        
        {books.map((book) => (
  <BookCard key={book.id} book={book} />
  
)
)
}
    </div>
    
    </div>
  )
}

export default BookSection