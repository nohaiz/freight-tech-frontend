import React, { useEffect, useState } from "react";
import profileServices from "../../services/user/profileServices";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./userDetails.css";

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
      <div className="background">
        <div className="box">
          <div className="content">
            <h1 className="title">User Details</h1>
            {userProfile && (
              <div className="user-details">
                <p>
                  <strong>Username:</strong> {userProfile.username}
                </p>
                <p>
                  <strong>Email:</strong> {userProfile.email}
                </p>
                <div className="buttons">
                  <Link to={`/users/${userId}/edit`}>
                    <button className="button is-dark is-link">
                      Edit Profile
                    </button>
                  </Link>
                  <button
                    className="button is-dark is-danger"
                    onClick={() => handleDelete(userId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
