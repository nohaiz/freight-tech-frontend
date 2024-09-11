import React, { useEffect, useState } from "react";
import profileServices from "../../services/user/profileServices";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./userForm.css";

const UsersForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });

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
    <div className="background">
      <div className="box details">
        <h1 className="title">Edit User</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <div className="control">
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="username">
              Username
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button className="button has-background-warning" type="submit">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersForm;
