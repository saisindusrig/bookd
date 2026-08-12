
import NavbarSearch from "./NavbarSearch";
import { useState, useEffect } from "react";
import { Search as SearchBar, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

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
    <nav className="sticky top-0 z-50 flex h-16 items-center border-b bg-primary text-background">
      {/* BOOKD Logo */}
      <h1
        className={`absolute left-1/2 -translate-x-1/2 font-heading text-3xl transition-all duration-300 ${
          searchOpen
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }`}
      >
        <Link to="/">BOOKD</Link>
      </h1>

      {/* Hamburger */}
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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-primary/20 bg-background text-primary shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-20">
          {/* User */}
          {isAuthenticated && user && (
            <p className="mb-6 text-xl font-bold">
              {user.username}
            </p>
          )}

          <nav>
            {/* Top Books */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block border-b border-b-black/20 px-4 py-3 hover:bg-primary/90 hover:text-background"
            >
              Top Books
            </Link>

            {/* Find A Book */}
            <Link
              to="/search"
              onClick={() => setIsOpen(false)}
              className="block border-b border-b-black/20 px-4 py-3 hover:bg-primary/90 hover:text-background"
            >
              Find A Book
            </Link>

            {/* Sign Out */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                className="block w-full border-b border-b-black/20 px-4 py-3 text-left hover:bg-primary/90 hover:text-background"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </aside>

      {/* Right Side */}
      <div className="ml-auto mr-4 flex items-center gap-4">
        {/* Login / Sign Up */}
        {!isAuthenticated && !searchOpen && (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm hover:opacity-70"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-sm hover:opacity-70"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Navbar Search */}
        {scrolled && (
          <div
            className={`flex items-center transition-all duration-300 ${
              searchOpen
                ? "w-[min(70vw,420px)]"
                : "w-6"
            }`}
          >
            {/* Search Input */}
            <div
              className={`relative flex-1 overflow-hidden transition-all duration-300 ${
                searchOpen
                  ? "mr-2 opacity-100"
                  : "pointer-events-none w-0 opacity-0"
              }`}
            >
              {searchOpen && <NavbarSearch />}
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="shrink-0"
              aria-label={
                searchOpen
                  ? "Close search"
                  : "Open search"
              }
            >
              {searchOpen ? (
                <X size={22} />
              ) : (
                <SearchBar size={22} />
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

