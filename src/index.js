import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import UserProfileCard from './UserProfiles/UserProfileCard';
import UserProfileCards from './UserProfiles/UserProfileCards';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProfileCard/>
  </React.StrictMode>
);


reportWebVitals();
