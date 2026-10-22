import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";
import ListingList from "./pages/ListingList";
import ListingShow from "./pages/ListingShow";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewListing from "./pages/NewListing";
import EditListing from "./pages/EditListing";

export default function App() {
  const [currUser, setCurrUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/currUser", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.currUser) {
          setCurrUser(data.currUser);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <Navbar
        currUser={currUser}
        setCurrUser={setCurrUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="container my-4">
        <Routes>
          <Route path="/" element={<ListingList />} />
          <Route path="/listings/:id" element={<ListingShow currUser={currUser} />} />
          <Route path="/bookings" element={<MyBookings currUser={currUser} />} />
          <Route path="/login" element={<Login setCurrUser={setCurrUser} />} />
          <Route path="/signup" element={<Signup setCurrUser={setCurrUser} />} />
          <Route path="/listings/new" element={<NewListing currUser={currUser} />} />
          <Route path="/listings/:id/edit" element={<EditListing currUser={currUser} />} />
        </Routes>
      </main>
      <Footer />
      <AIChatbot currUser={currUser} />
    </Router>
  );
}
