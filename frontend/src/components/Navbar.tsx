import NavbarSearch from "./NavbarSearch";

import {
  useEffect,
  useState,
} from "react";

import {
  Search as SearchBar,
  X,
  Menu,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

const Navbar = () => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  useEffect(() => {
    const handleScroll =
      () => {
        const isScrolled =
          window.scrollY > 200;

        setScrolled(
          isScrolled
        );

        if (!isScrolled) {
          setSearchOpen(
            false
          );
        }
      };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-16 items-center border-b bg-primary text-background">
        {/* BOOKD */}

        <h1
          className={`absolute left-1/2 -translate-x-1/2 font-heading text-2xl sm:text-3xl ${
            searchOpen
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }`}
        >
          <Link to="/">
            BOOKD
          </Link>
        </h1>

        {/* HAMBURGER */}

        <button
          type="button"
          onClick={() =>
            setIsOpen(
              (previous) =>
                !previous
            )
          }
          className="absolute left-4 top-1/2 z-[60] -translate-y-1/2"
          aria-label={
            isOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            isOpen
          }
        >
          {isOpen ? (
            <X
              size={24}
              className="text-primary"
            />
          ) : (
            <Menu
              size={24}
              className="text-background"
            />
          )}
        </button>

        {/* SIDEBAR */}

        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-[min(18rem,85vw)] border-r border-primary/20 bg-background text-primary shadow-xl transition-transform duration-300 ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-6 pt-20">
            {/* USER */}

            {isAuthenticated &&
              user && (
                <p className="mb-6 break-words text-xl font-bold">
                  Hello,{" "}
                  {user.username
                    .charAt(0)
                    .toUpperCase() +
                    user.username.slice(
                      1
                    )}
                </p>
              )}

            {/* LINKS */}

            <nav className="flex flex-col">
              <Link
                to="/top-books"
                onClick={() =>
                  setIsOpen(false)
                }
                className="block border-b border-black/20 px-4 py-3 transition-colors hover:bg-primary hover:text-background"
              >
                Top Books
              </Link>

              <Link
                to="/search"
                onClick={() =>
                  setIsOpen(false)
                }
                className="block border-b border-black/20 px-4 py-3 transition-colors hover:bg-primary hover:text-background"
              >
                Find A Book
              </Link>

              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="block border-b border-black/20 px-4 py-3 transition-colors hover:bg-primary hover:text-background"
                >
                  Profile
                </Link>
              )}
            </nav>

            {/* SIGN OUT */}

            {isAuthenticated && (
              <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full border border-black/20 px-4 py-3 text-center transition-colors hover:bg-primary hover:text-background"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* OVERLAY */}

        {isOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setIsOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/30"
          />
        )}

        {/* RIGHT SIDE */}

        <div className="ml-auto mr-4 flex items-center gap-3 sm:gap-4">
          {/* LOGIN / SIGNUP */}

          {!isAuthenticated &&
            !searchOpen && (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  to="/login"
                  className="text-xs transition-opacity hover:opacity-70 sm:text-sm"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="text-xs transition-opacity hover:opacity-70 sm:text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

          {/* SEARCH */}

          {scrolled && (
            <div
              className={`flex items-center transition-all duration-300 ${
                searchOpen
                  ? "w-[min(55vw,420px)]"
                  : "w-6"
              }`}
            >
              <div
                className={`relative flex-1 overflow-hidden transition-all duration-300 ${
                  searchOpen
                    ? "mr-2 opacity-100"
                    : "pointer-events-none w-0 opacity-0"
                }`}
              >
                {searchOpen && (
                  <NavbarSearch />
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(
                    (previous) =>
                      !previous
                  )
                }
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
                  <SearchBar
                    size={22}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;