import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import BookDetails from "../pages/BookDetails";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/book/:id" element={<BookDetails/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;