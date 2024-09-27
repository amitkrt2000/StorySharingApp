import React, { useState } from 'react';
import '../styles/AddStoryModal.css';
import closeIcon from '../assets/closeIcon.jpg'; // Adjust path if necessary

const AddStoryModal = ({ onClose }) => {
  const [boxes, setBoxes] = useState(4); // Start with 4 slides by default
  const [currentSlide, setCurrentSlide] = useState(1); // Keep track of the current slide
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [success, setSuccess] = useState(false); // To show success message

  const [slideData, setSlideData] = useState({
    1: { heading: '', description: '', imageUrl: '', category: '' },
    2: { heading: '', description: '', imageUrl: '', category: '' },
    3: { heading: '', description: '', imageUrl: '', category: '' },
    4: { heading: '', description: '', imageUrl: '', category: '' }
  }); // Store data for each slide

  const maxBoxes = 6; // Max number of slides
  const minBoxes = 3; // Min number of slides

  // Handle data changes for each input field based on the current slide
  const handleInputChange = (field, value) => {
    if (field === 'category') {
      // Apply the selected category to all slides
      const updatedSlideData = { ...slideData };
      for (let i = 1; i <= boxes; i++) {
        updatedSlideData[i] = {
          ...updatedSlideData[i],
          category: value
        };
      }
      setSlideData(updatedSlideData);
    } else {
      // Update for the specific field of the current slide
      setSlideData({
        ...slideData,
        [currentSlide]: {
          ...slideData[currentSlide],
          [field]: value
        }
      });
    }
  };

  const handleAddBox = () => {
    if (boxes < maxBoxes) {
      setBoxes(boxes + 1);
      setSlideData({
        ...slideData,
        [boxes + 1]: { heading: '', description: '', imageUrl: '', category: slideData[1]?.category || '' }
      }); // Add empty data for the new slide, with the category copied from the first slide
    }
  };

  const handleRemoveBox = () => {
    if (boxes > minBoxes) {
      const updatedSlideData = { ...slideData };
      delete updatedSlideData[boxes]; // Remove data for the last slide

      setBoxes(boxes - 1);
      setSlideData(updatedSlideData);

      if (currentSlide > boxes - 1) {
        setCurrentSlide(boxes - 1); // Adjust the current slide if it goes beyond available slides
      }
    }
  };

  const handleNext = () => {
    if (currentSlide < boxes) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handlePostStory = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    setSuccess(false); // Reset success state
  
    // Retrieve the auth token from localStorage
    const token = localStorage.getItem('auth-token');
    
    if (!token) {
      setError('User is not authenticated. Please log in.');
      setLoading(false);
      return;
    }
  
    try {
        const response = await fetch('http://localhost:3000/api/story/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Correct backticks
          },
          body: JSON.stringify({
            slides: slideData,
          }),
        });
      
  
      if (response.ok) {
        // Success response
        const data = await response.json();
        setSuccess(true);
        console.log("Story created successfully:", data);
      } else if (response.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else {
        throw new Error('Failed to create story');
      }
    } catch (err) {
      setError(err.message);
      console.error("Error creating story:", err);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={closeIcon} alt="Close" className="close-icon" onClick={onClose} />

        <div className="box-container">
          {[...Array(boxes)].map((_, index) => (
            <div key={index} className={`box ${currentSlide === index + 1 ? 'active' : ''}`}>
              <p>{`Slide ${index + 1}`}</p>
              {index === boxes - 1 && boxes > minBoxes && (
                <img src={closeIcon} alt="Remove" className="remove-icon" onClick={handleRemoveBox} />
              )}
            </div>
          ))}
          {boxes < maxBoxes && (
            <p className="add-more" onClick={handleAddBox}>
              Add more
            </p>
          )}
        </div>

        <div className="form">
          <label className="label">Heading:</label>
          <input
            type="text"
            placeholder={`Heading for Slide ${currentSlide}`}
            value={slideData[currentSlide]?.heading || ''}
            onChange={(e) => handleInputChange('heading', e.target.value)}
            className="input-field"
          />

          <label className="label">Description:</label>
          <textarea
            placeholder={`Description for Slide ${currentSlide}`}
            value={slideData[currentSlide]?.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="input-field description"
          />

          <label className="label">Image:</label>
          <input
            type="text"
            placeholder={`Image URL for Slide ${currentSlide}`}
            value={slideData[currentSlide]?.imageUrl || ''}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            className="input-field"
          />

          <label className="label">Category:</label>
          <select
            className="input-field"
            value={slideData[currentSlide]?.category || 'select'}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="select">Select category</option>
            <option value="food">Food</option>
            <option value="health">Health and Fitness</option>
            <option value="travel">Travel</option>
            <option value="movie">Movie</option>
            <option value="education">Education</option>
          </select>
        </div>

        <div className="button-container">
          <button className="btn previous" onClick={handlePrevious} disabled={currentSlide === 1}>
            Previous
          </button>
          <button className="btn next" onClick={handleNext} disabled={currentSlide === boxes}>
            Next
          </button>
        </div>
        <button className="btn post" onClick={handlePostStory} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>

        {error && <p className="error-message">Error: {error}</p>}
        {success && <p className="success-message">Story posted successfully!</p>}
      </div>
    </div>
  );
};

export default AddStoryModal;
