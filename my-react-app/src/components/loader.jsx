// Loader.js
import React from 'react';
import '../css/style.css'

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className='loader-box'>
        <div className="loader"></div>
        <p>Loading</p>
      </div>
    </div>
  );
};

export default Loader;
