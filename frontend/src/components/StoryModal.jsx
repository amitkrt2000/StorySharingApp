// StoryModal.jsx (updated)

import React, { useState } from 'react';
import '../styles/StoryModal.css';
import closeIcon from '../assets/closeIcon.jpg';  // Close icon image
import likeIcon from '../assets/like.png';        // Like icon image
import bookmarkIcon from '../assets/bookmark.png'; // Bookmark icon image
import downloadIcon from '../assets/download.png'; // Download icon image
import shareIcon from '../assets/share.png';      // Share icon image

const StoryModal = ({ story, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentSlide = story.slides[currentSlideIndex];

  // Handle like functionality
  const handleLike = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth-token');
    if (!token) {
      // Redirect to login if not authenticated
      alert("Please log in to like the story");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/story/like/${story._id}/${currentSlideIndex}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsLiked(!isLiked); // Toggle like state
      } else {
        alert('Error liking the slide');
      }
    } catch (error) {
      console.error('Error liking slide:', error);
    }
  };

  // Handle bookmark functionality
  const handleBookmark = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert("Please log in to bookmark the story");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/story/bookmark/${story._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked); // Toggle bookmark state
      } else {
        alert('Error bookmarking the story');
      }
    } catch (error) {
      console.error('Error bookmarking story:', error);
    }
  };

  // Handle share functionality
  const handleShare = () => {
    const storyLink = `http://localhost:5173/story/${story._id}`;
    navigator.clipboard.writeText(storyLink).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // Handle download functionality
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSlide.imageUrl;  // Assuming imageUrl is the URL to the image
    link.download = `slide-${story._id}-${currentSlideIndex}.jpg`; // Download as jpg
    link.click();
  };

  const handleNext = () => {
    if (currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="story-modal">
      <img src={closeIcon} alt="Close" className="close-icon" onClick={onClose} />
      
      <div className="slide-container">
        <img src={currentSlide.imageUrl} alt={`Slide ${currentSlideIndex + 1}`} />

        {/* Actions */}
        <div className="slide-actions">
          {/* Like */}
          <img
            src={likeIcon}
            alt="Like"
            className={`action-icon ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          />
          {/* Bookmark */}
          <img
            src={bookmarkIcon}
            alt="Bookmark"
            className={`action-icon ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmark}
          />
          {/* Share */}
          <img
            src={shareIcon}
            alt="Share"
            className="action-icon"
            onClick={handleShare}
          />
          {/* Download */}
          <img
            src={downloadIcon}
            alt="Download"
            className="action-icon"
            onClick={handleDownload}
          />
        </div>

        {/* Navigation */}
        <div className="slide-navigation">
          {currentSlideIndex > 0 && <button onClick={handlePrev}>Previous</button>}
          {currentSlideIndex < story.slides.length - 1 && <button onClick={handleNext}>Next</button>}
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
