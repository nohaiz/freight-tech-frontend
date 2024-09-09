import React, { useEffect, useState } from "react";
import profileServices from "../../services/user/profileServices";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UsersForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });

  const tempData = {
    email: "test99@gmail.com",
    userId: 7,
    username: "test99",
    verifiedUser: true,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await profileServices.showUser(userId);
        setUserProfile(userData);
        setFormData({
          email: userData.email,
          username: userData.username,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await profileServices.updateUser(userId, formData);
      navigate(`/users/${userId}`);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <div>
        <h1>Edit User</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default UsersForm;
