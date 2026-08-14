// import React, { useEffect, useState } from 'react'
// import { books } from '../data/books'
// import { useParams, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { addFavourite, removeFavourite, checkFavourite } from '../api/favourites'
// import { Heart } from 'lucide-react'
// const BookDetails = () => {
//     const {id} = useParams();
//     const navigate = useNavigate();
//     const {isAuthenticated} = useAuth();
//     console.log("isAuthenticated:", isAuthenticated);
//     const [isFavourite, setIsFavourite] = useState(false)
//     const [favouriteLoading, setFavouriteLoading] = useState(false)
//     useEffect(()=>{
//       const loadFavouriteStatus = async()=>{
//         if(!id || !isAuthenticated){
//           setIsFavourite(false)
//           return
//         }
//         try{
//           const favouriteStatus = await checkFavourite(id);
//           setIsFavourite(favouriteStatus)
//         }catch(error){
//           console.error("Failed to check favourite status: ", error)
//         }
//       }
//       loadFavouriteStatus();
//     }, [id,isAuthenticated])
//     const handleFavourite = async()=>{
//       if(!isAuthenticated){
//         navigate("/login")
//         return
//       }
//       if(!id || favouriteLoading){
//         return
//       }
//       try{
//         setFavouriteLoading(true);
//         if(isFavourite){
//           await removeFavourite(id);
//           setIsFavourite(false)
//         }else{
//           await addFavourite(id)
//           setIsFavourite(true)
//         }
//       }catch(error){
//         console.error("Failed to update favourite: ", error)
//       }finally{
//         setFavouriteLoading(false)
//       }
//     }
//     const book = books.find((book)=>book.id === id)
//     if(!book){
//         return (
//             <div>
//                 not found
//             </div>
//         )
//     }
//   return (
//     <div className="flex gap-8">
//   <div className='my-20 mx-15 w-[250px]'>
//     <img
//     src={book.cover}
//     alt={book.title}
//     className="w-[250px]"
//   />
//   <button type="button"
//           onClick={handleFavourite}
//           disabled={favouriteLoading}
//           className="mt-4 flex w-full items-center justify-center gap-2 py-3 transition-opacity hover:opacity-60">
//     <Heart size={24} strokeWidth={1.5} fill={isFavourite? "currentColor" : "none"}/>
//     <span className='text-lg'>{isFavourite? "Saved" : "Save"}</span>

//   </button>
//   </div>
//   <div className='my-20'>
//     <h1 className='font-heading text-5xl pb-2 fo'>{book.title}</h1>

//     <p className='font-heading text-xl pb-4 opacity-70'>{book.author}</p>

//     <p className='pb-2 text-2xl'><span className='opacity-70 line-clamp-1'>Description </span>{book.description}</p>

//     <p className='pb-2'>
//       <span className='opacity-70 line-clamp-1 text-3xl'>⭐ {book.rating} </span>
      
//       <span className='px-2 opacity-80 text-2xl'>
//         ({book.ratingsCount} ratings)
//         </span>
//     </p>


//     <p className=''><span className='line-clamp-1 opacity-70'>Published Year </span>{book.year}</p>

//     <p>{book.pages} pages</p>

//     <div>
//       {book.genre.map((genre) => (
//         <span key={genre}>{genre}</span>
//       ))}
//     </div>
//   </div>
// </div>
//   )
// }

// export default BookDetails

import { useEffect, useState } from "react";
import { books } from "../data/books";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  addFavourite,
  removeFavourite,
  checkFavourite,
} from "../api/favourites";
import { Heart } from "lucide-react";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useAuth();

  console.log(
    "BookDetails isAuthenticated:",
    isAuthenticated
  );

  const [isFavourite, setIsFavourite] =
    useState(false);

  const [favouriteLoading, setFavouriteLoading] =
    useState(false);

  const book = books.find(
    (book) => book.id === id
  );
//   if (loading) {
//   return (
//     <div className="my-20">
//       Loading...
//     </div>
//   );
// }
// if (!book) {
//   return (
//     <div>
//       not found
//     </div>
//   );
// }

  useEffect(() => {
    const loadFavouriteStatus = async () => {
      if (loading) {
      return;
    }
      if (!id || !isAuthenticated) {
        setIsFavourite(false);
        return;
      }

      try {
        console.log(
          "Checking favourite for book:",
          id
        );

        const favouriteStatus =
          await checkFavourite(id);

        console.log(
          "Favourite status:",
          favouriteStatus
        );

        setIsFavourite(favouriteStatus);
      } catch (error) {
        console.error(
          "Failed to check favourite status:",
          error
        );
      }
    };

    // THIS WAS MISSING
    loadFavouriteStatus();

  }, [id, isAuthenticated, loading]);

  const handleFavourite = async () => {

  if (loading) {
    return;
  }
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!id || favouriteLoading) {
      return;
    }

    try {
      setFavouriteLoading(true);

      if (isFavourite) {
        console.log(
          "Removing favourite:",
          id
        );

        await removeFavourite(id);

        setIsFavourite(false);

      } else {
        console.log(
          "Adding favourite:",
          id
        );

        await addFavourite(id);

        setIsFavourite(true);
      }

    } catch (error) {
      console.error(
        "Failed to update favourite:",
        error
      );

    } finally {
      setFavouriteLoading(false);
    }
  };

  if (!book) {
    return (
      <div>
        not found
      </div>
    );
  }

  return (
    <div className="flex gap-8">

      <div className="my-20 mx-15 w-[250px]">

        <img
          src={book.cover}
          alt={book.title}
          className="my-20 ml-12 w-[250px]"
        />

        <button
          type="button"
          onClick={handleFavourite}
          disabled={favouriteLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 py-3 transition-opacity hover:opacity-60 disabled:opacity-50"
        >

          <Heart
            size={24}
            strokeWidth={1.5}
            fill={
              isFavourite
                ? "currentColor"
                : "none"
            }
          />

          <span className="text-lg">
            {isFavourite
              ? "Saved"
              : "Save"}
          </span>

        </button>

      </div>

      <div className="my-20">

        <h1 className="font-heading text-5xl pb-2">
          {book.title}
        </h1>

        <p className="font-heading text-xl pb-4 opacity-70">
          {book.author}
        </p>

        <p className="pb-2 text-2xl">

          <span className="opacity-70 line-clamp-1">
            Description
          </span>

          {book.description}

        </p>

        <p className="pb-2">

          <span className="opacity-70 line-clamp-1 text-3xl">
            ⭐ {book.rating}
          </span>

          <span className="px-2 opacity-80 text-2xl">
            ({book.ratingsCount} ratings)
          </span>

        </p>

        <p>
          <span className="line-clamp-1 opacity-70">
            Published Year
          </span>

          {book.year}
        </p>

        <p>
          {book.pages} pages
        </p>

        <div>
          {book.genre.map((genre) => (
            <span key={genre}>
              {genre}
            </span>
          ))}
        </div>

      </div>

    </div>
  );
};

export default BookDetails;