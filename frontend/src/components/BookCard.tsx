import React from 'react'
import type { Book } from '../types/book'
import BookDetails from '../pages/BookDetails'
import { useNavigate } from 'react-router-dom'
const BookCard = ({book:{id,cover,title, author,rating}}: {book : Book}) => {
  const navigate = useNavigate();
  return (
    <div className='w-full overflow-hidden'
    onClick={()=>navigate(`/book/${id}`)}
    >
        <div>
            <img src={cover} className='aspect-2/3 w-full object-cover shadow-sm'/>
        </div>
        <div className="px-2">
    <h3 className="mt-2 w-full text-sm font-bold">
      {title}
    </h3>

    <p className="mt-0 line-clamp-2 text-sm opacity-70">
      {author}
    </p>
    <p className='text-sm'>{rating}</p>
    
  </div>

    </div>
  )
}

export default BookCard