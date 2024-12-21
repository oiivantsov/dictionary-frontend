import React, { useState } from 'react';

const FloatingSearchButton = ({ onClick }) => (
  <button
    className="floating-search-button"
    onClick={onClick}
    title="Search Words"
  >
    🔍
  </button>
);

export default FloatingSearchButton;
