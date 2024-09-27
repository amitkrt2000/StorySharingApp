import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // To get the story ID from the URL
import '../styles/StoryPage.css';

const StoryPage = () => {
  const { storyId } = useParams();  // Grab the story ID from URL
  const [story, setStory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/story/${storyId}`);
        const data = await response.json();
        setStory(data.story);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStory();
  }, [storyId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!story) {
    return <p>Loading...</p>;
  }

  return (
    <div className="story-page">
      <h1>{story.heading}</h1>
      <p>{story.description}</p>
      <div className="slides">
        {story.slides.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.imageUrl} alt={`Slide ${index + 1}`} />
            <div className="slide-actions">
              <button>Like</button>
              <button>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryPage;
