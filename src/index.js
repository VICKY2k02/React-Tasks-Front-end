import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
//import UserProfileCard from './UserProfiles/UserProfileCard';
import App from './components/UserCardMain';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*<UserProfileCard/>*/}
    <App/>
  </React.StrictMode>
);


reportWebVitals();
