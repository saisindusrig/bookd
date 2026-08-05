import { Search as SearchBar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }
  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <SearchBar
        size={18}
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-background/80"
      />

      <input
        type="text"
        placeholder="Search books, authors..."
        className="w-full border-b border-background bg-transparent py-1 pl-8 pr-2 text-background outline-none placeholder:text-background/60"
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
      />
      </form>
      
    </div>
  );
};

export default NavbarSearch;