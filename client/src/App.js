import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Listings from './pages/Listings';
import CreateListing from './pages/CreateListing';
import ListingDetails from './pages/ListingDetails';
import ChatAssistant from './pages/ChatAssistant';
import EditListing from './pages/EditListing';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/create" element={<CreateListing />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/listings/:id/edit" element={<EditListing />} />
        <Route path="/chat" element={<ChatAssistant />} />
      </Routes>
    </>
  );
}

export default App;
