import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Stories from '../components/Stories';
import Topstories from '../components/Topstories';
import '../styles/HomePage.css';

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stories, setStories] = useState([]);
  const [noStoriesMessage, setNoStoriesMessage] = useState('');

  useEffect(() => {
    // Check for JWT token to determine if the user is authenticated
    const token = localStorage.getItem('auth-token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    
    try {
      const response = await fetch(`http://localhost:3000/api/story/category/${category}`);
      const data = await response.json();
      
      if (data.stories.length > 0) {
        setStories(data.stories);
        setNoStoriesMessage(''); // Clear "No stories available" message
      } else {
        setStories([]);
        setNoStoriesMessage(`No stories available for ${category}`);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setNoStoriesMessage('Error fetching stories.');
    }
  };

  return (
    <div className="homepage">
      <Navbar isAuthenticated={isAuthenticated} />
      <Stories onSelectCategory={handleCategorySelect} />
      
      <div className="stories-section">
        <h2>Top Stories About {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
        {noStoriesMessage && <p>{noStoriesMessage}</p>}
        
        <div className="topstories-container">
          {stories.length > 0 ? (
            stories.map((story) => (
              <Topstories key={story._id} story={story} />
            ))
          ) : (
            <p>No stories available</p>
          )}
        </div>

        {/* Add "See more" button if there are many stories */}
        {stories.length > 4 && (
          <button className="see-more-button" onClick={() => {/* Implement pagination or load more stories */}}>
            See more
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
