import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../StartButton/startbutton.scss'; // Import the SCSS file

const StartButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent default action if inside a form
    loginWithRedirect(); // Trigger Auth0 login
  };

  return (
    <button className="start-button" onClick={handleLogin}> {/* Use the same button class */}
      Start
    </button>
  );
};

export default StartButton;