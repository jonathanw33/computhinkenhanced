import React, { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [userMetadata, setUser, Metadata] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (err) {
        console.error("Error fetching access token:", err);
        setError(err);
      }
    };

    if (isAuthenticated) {
      fetchAccessToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        {/* <h2>{user.name}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3> */}
        {/* {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
        {accessToken && <p>Access Token: {accessToken}</p>}
        {error && <p>Error fetching access token: {error.message}</p>} */}
      </div>
    )
  );
};

export default Profile;