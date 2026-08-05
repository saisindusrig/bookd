import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react"; 
const Search = () => { 
   const [query, setQuery] = useState("");
   const navigate = useNavigate();
   const handleSubmit = (e: React.FormEvent)=>{
      e.preventDefault();
      const trimmmedQuery = query.trim();
      if(!trimmmedQuery) return;
      navigate(`/search?q=${encodeURIComponent(trimmmedQuery)}`)

   }
  return ( 
  <form onSubmit={handleSubmit}
  className="mx-auto w-full max-w-2xl px-4">
   <div className="relative mx-auto w-full max-w-xl px-4">
     <SearchIcon size={18} className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-primary/60" /> 
     <input type="text" 
     placeholder="Search books, authors..." 
     className="w-full border border-black/20 bg-background text-primary px-5 py-3 pl-12 outline-none transition focus:border-primary" 
     value = {query}
     onChange={(e)=>{setQuery(e.target.value)}}
     /> 
  </div> 
  </form>
     )
     }; 
     export default Search;
