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
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Roles:</label>
          {allRoles.map((role) => (
            <div key={role}>
              <input
                type="checkbox"
                name="role"
                value={role}
                checked={user.role.includes(role)}
                onChange={handleChange}
              />
              <label>{role}</label>
            </div>
          ))}
        </div>
        <div>
          <label>Verified User:</label>
          <input
            type="checkbox"
            name="verifiedUser"
            checked={user.verifiedUser}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AdminCreateUserForm;
