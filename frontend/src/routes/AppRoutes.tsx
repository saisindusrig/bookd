import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import BookDetails from "../pages/BookDetails";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import TopBooks from "../pages/TopBooks";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/top-books"
        element={<TopBooks />}
      />

      <Route
        path="/search"
        element={<SearchResults />}
      />

      <Route
        path="/book/:id"
        element={<BookDetails />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />
    </Routes>
  );
};

export default AppRoutes;