import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation

const Categories = ({ category, categoryName, categoryImage, onSelectCategory }) => {
  return (
    <div className="category-box" onClick={onSelectCategory}>
      <div className="category-top">
        <div className="category-text">{category}</div>
      </div>
      <img src={categoryImage} alt={category} />
    </div>
  );
};

export default Categories;
