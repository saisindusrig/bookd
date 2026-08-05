import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import BookDetails from "../pages/BookDetails";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/book/:id" element={<BookDetails/>}/>
    </Routes>
  );
};

export default AppRoutes;