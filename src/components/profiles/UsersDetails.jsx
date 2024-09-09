import React, { useEffect, useState } from "react";
import profileServices from "../../services/user/profileServices";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserDetails = ({ handleDelete }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await profileServices.showUser(userId);
        setUserProfile(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <>
      <div>
        <h1>User Details</h1>
        <p>
          <strong>Username:</strong> {userProfile.username}
        </p>
        <p>
          <strong>Email:</strong> {userProfile.email}
        </p>
      </div>
      <Link to={`/users/${userId}/edit`}>
        <button>Edit Profile </button>
      </Link>
      <button onClick={() => handleDelete(userId)}>Delete Profile</button>
    </>
  );
};

export default UserDetails;
