import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Register from './components/Register';
import Login from './components/Login.jsx';
import AddStoryModal from './components/AddStoryModal';
import CategoryPage from './Pages/CategoryPage.jsx';  // New import
import StoryPage from './Pages/AddStory.jsx';  // New import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-story" element={<AddStoryModal />} />
        <Route path="/category/:category" element={<CategoryPage />} />  {/* New route for categories */}
        <Route path="/story/:storyId" element={<StoryPage />} />  {/* New route for individual stories */}
      </Routes>
    </Router>
  );
}

export default App;
