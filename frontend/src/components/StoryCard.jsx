import React from 'react';
import '../styles/StoryCard.css';

const StoryCard = ({ story }) => {
  return (
    <div className="story-card">
      <img src={story.slides[0]?.imageUrl} alt={story.heading} className="story-image" />
      <div className="story-content">
        <h2>{story.heading}</h2>
        <p>{story.description}</p>
        <div className="story-actions">
          <button className="like-button">Like</button>
          <button className="bookmark-button">Bookmark</button>
          <button className="download-button">Download</button>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
