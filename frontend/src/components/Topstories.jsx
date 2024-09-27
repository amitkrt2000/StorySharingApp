import React from 'react';
import StoryCard from './StoryCard';
import '../styles/Topstories.css';

const Topstories = ({ story }) => {
  return (
    <div className="story-card">
      <StoryCard story={story} />
    </div>
  );
};

export default Topstories;
