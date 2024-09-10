import "./adminUserForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminUserServices";

const AdminCreateUserForm = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: [],
    verifiedUser: false,
  });
  const [allRoles] = useState(["admin", "driver", "shipper"]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "role") {
        setUser((prevUser) => ({
          ...prevUser,
          role: checked
            ? [...prevUser.role, value]
            : prevUser.role.filter((role) => role !== value),
        }));
      } else if (name === "verifiedUser") {
        setUser((prevUser) => ({
          ...prevUser,
          verifiedUser: checked,
        }));
      }
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!user.role || user.role.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    try {
      const response = await adminServices.createUser(user);

      if (response && response.userId) {
        const hasDriverRole = response.role && response.role.includes("driver");
        const hasShipperRole =
          response.role && response.role.includes("shipper");

        if (hasDriverRole) {
          navigate("/admins/drivers");
        } else if (hasShipperRole) {
          navigate("/admins/shippers");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      setError("Failed to submit user data.");
    }
  };

  return (
    <>
      <div className="background">
        <div className="box">
          <h1 className="title">Create User</h1>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username:</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Email:</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Password:</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirm Password:</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Roles:</label>
              <div className="control roles-container">
                {allRoles.map((role) => (
                  <label key={role} className="checkbox role-checkbox">
                    <input
                      type="checkbox"
                      name="role"
                      value={role}
                      checked={user.role.includes(role)}
                      onChange={handleChange}
                    />
                    <span className="role-name">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="label">Verified User:</label>
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="verifiedUser"
                    checked={user.verifiedUser}
                    onChange={handleChange}
                  />
                  Verified
                </label>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link is-dark" type="submit">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCreateUserForm;
