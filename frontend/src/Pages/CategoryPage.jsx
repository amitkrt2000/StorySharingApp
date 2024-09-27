import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // To get the category from the URL
import StoryCard from '../components/StoryCard';  // Reuse StoryCard component for displaying stories
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();  // Grab category from URL
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoriesByCategory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/story/category/${category}`);
        const data = await response.json();
        setStories(data.stories);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStoriesByCategory();
  }, [category]);

  return (
    <div className="category-page">
      <h1>Stories in {category} Category</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="story-list">
        {stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
