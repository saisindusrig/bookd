import React from 'react'
import { books } from '../data/books'
import { useParams } from 'react-router-dom'
const BookDetails = () => {
    const {id} = useParams();
    const book = books.find((book)=>book.id === id)
    if(!book){
        return (
            <div>
                not found
            </div>
        )
    }
  return (
    <div className="flex gap-8">
  <img
    src={book.cover}
    alt={book.title}
    className="w-[250px] my-20 mx-15"
  />

  <div className='my-20'>
    <h1 className='font-heading text-5xl pb-2 fo'>{book.title}</h1>

    <p className='font-heading text-xl pb-4 opacity-70'>{book.author}</p>

    <p className='pb-2 text-2xl'><span className='opacity-70 line-clamp-1'>Description </span>{book.description}</p>

    <p className='pb-2'>
      <span className='opacity-70 line-clamp-1 text-3xl'>⭐ {book.rating} </span>
      
      <span className='px-2 opacity-80 text-2xl'>
        ({book.ratingsCount} ratings)
        </span>
    </p>


    <p className=''><span className='line-clamp-1 opacity-70'>Published Year </span>{book.year}</p>

    <p>{book.pages} pages</p>

    <div>
      {book.genre.map((genre) => (
        <span key={genre}>{genre}</span>
      ))}
    </div>
  </div>
</div>
  )
}

export default BookDetails