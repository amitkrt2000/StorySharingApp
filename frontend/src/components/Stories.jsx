import React from 'react';
import '../styles/Stories.css';
import Categories from './Categories';

const Stories = ({ onSelectCategory }) => {
  const categories = [
    { 
      name: 'All', 
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D' 
    },
    { 
      name: 'Food', 
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D' 
    },
    { 
      name: 'Health & Fitness', 
      image: 'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D' 
    },
    { 
      name: 'Movies', 
      image: 'https://images.unsplash.com/photo-1658999167159-3f6659cace61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW92aWVzfGVufDB8fDB8fHww' 
    },
    { 
      name: 'Education', 
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWR1Y2F0aW9ufGVufDB8fDB8fHww' 
    },
  ];

  return (
    <div className="categories">
      {categories.map((category, index) => (
        <Categories
          key={index}
          category={category.name}
          categoryName={category.name.toLowerCase()}
          categoryImage={category.image}
          onSelectCategory={() => onSelectCategory(category.name.toLowerCase())}
        />
      ))}
    </div>
  );
};

export default Stories;
