import NavbarSearch from "./NavbarSearch";
import { useState, useEffect } from "react";
import { Search as SearchBar, X, Menu } from "lucide-react";
import Search from "./Search";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 200;

      setScrolled(isScrolled);

      // Close navbar search when we return to the hero
      if (!isScrolled) {
        setSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="relative sticky top-0 z-50 flex h-16 items-center border-b bg-primary text-background">

    

      <h1
        className={`absolute left-1/2 -translate-x-1/2 font-heading text-3xl transition-all duration-300 ${
          searchOpen
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }`}
      >
        <Link to='/'>BOOKD</Link>
      
      </h1>


      {/* ==================================================
          HAMBURGER
      ================================================== */}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-4 top-1/2 z-50 -translate-y-1/2"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <span className="text-primary">
            <X />
          </span>
        ) : (
          <span className="text-background">
            <Menu />
          </span>
        )}
      </button>


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-primary/20 bg-background text-primary shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-20">
          <nav className="space-y-1">

            <a
              href="#"
              className="block border-b border-b-black/20 px-4 py-3 hover:bg-primary/90 hover:text-background"
            >
              Top Books
            </a>

            <a
              href="#"
              className="block border-b border-b-black/20 px-4 py-3 hover:bg-primary/90 hover:text-background"
            >
              Find A Book
            </a>

            <a
              href="#"
              className="block border-b border-b-black/20 px-4 py-3 hover:bg-primary/90 hover:text-background"
            >
              Sign Out
            </a>

          </nav>
        </div>
      </aside>


      {/* ==================================================
          SEARCH
      ================================================== */}

      {scrolled && (
        <div
          className={`absolute right-4 top-1/2 flex -translate-y-1/2 items-center transition-all duration-300 ${
            searchOpen
              ? "w-[min(70vw,420px)]"
              : "w-6"
          }`}
        >

          {/* SEARCH INPUT */}

          <div
            className={`relative flex-1 overflow-hidden transition-all duration-300 ${
              searchOpen
                ? "opacity-100"
                : "pointer-events-none w-0 opacity-0"
            }`}
          >
            
              <NavbarSearch/>
              
          </div>


          {/* SEARCH / CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="ml-2 shrink-0"
            aria-label={searchOpen ? "Close search" : "Open search"}
          >
            {searchOpen ? (
              <X size={22} />
            ) : (
              <SearchBar size={22} />
            )}
          </button>

        </div>
      )}

    </nav>
  );
};

export default Navbar;



