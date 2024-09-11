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

    const hasDriverRole = user.role.includes("driver");
    const hasShipperRole = user.role.includes("shipper");

    if (hasDriverRole && hasShipperRole) {
      setError("Cannot assign both 'driver' and 'shipper' roles.");
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
      <div className="columns-two is-vcentered">
        <div className="column">
          <form onSubmit={handleSubmit} className="sign-up-form-container">
            <h1 className="title is-2 has-text-centered custom-title">
              Create User
            </h1>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
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
              <label className="label">Confirm Password</label>
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
              <label className="label">Roles</label>
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
              <label className="label">Verified User</label>
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

            <button className="button has-background-warning" type="submit">
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCreateUserForm;
