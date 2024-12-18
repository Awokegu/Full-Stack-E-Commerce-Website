import React from 'react';
import SUCCESSIMAGE from '../assest/Cancel.jpg'; // Ensure the file path is correct

const Cancel = () => {
  const handleButtonClick = () => {
    // Replace this with the desired action, e.g., navigate to homepage
    window.location.href = '/cart'; // Example: Redirect to homepage
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f0f8ff',
      }}
    >
      <img 
        src={SUCCESSIMAGE} 
        alt="Success" 
        style={{ 
          width: '50%', 
          maxWidth: '400px', 
          height: 'auto', 
          marginBottom: '20px' 
        }} 
      />
      <h1 style={{ color: '#28a745', fontSize: '2rem' }}>Payment Canceled</h1>
      <button
        onClick={handleButtonClick}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
     Go to Cart
      </button>
    </div>
  );
};

export default Cancel;
