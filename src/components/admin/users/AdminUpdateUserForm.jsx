import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminUserServices";

const AdminUpdateUserForm = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    roles: [],
    verifiedUser: false,
  });
  const [allRoles, setAllRoles] = useState(["admin", "driver", "shipper"]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await adminServices.showUser(userId);
        if (userDetails) {
          setUser({
            username: userDetails.username,
            email: userDetails.email,
            roles: Array.isArray(userDetails.roles) ? userDetails.roles : [],
            verifiedUser: userDetails.verifiedUser || false,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details.");
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "roles") {
        setUser((prevUser) => ({
          ...prevUser,
          roles: checked
            ? [...prevUser.roles, value]
            : prevUser.roles.filter((role) => role !== value),
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

    if (!user.roles || user.roles.length === 0) {
      setError("At least one role must be selected.");
      return;
    }

    try {
      const updatedUserData = {
        username: user.username,
        email: user.email,
        roles: user.roles,
        verifiedUser: user.verifiedUser,
      };

      const response = await adminServices.updateUser(userId, updatedUserData);

      if (response) {
        const roles = response?.roles || [];
        const hasDriverRole = roles.includes("driver");
        const hasShipperRole = roles.includes("shipper");

        if (hasDriverRole) {
          navigate("/admins/drivers");
        } else if (hasShipperRole) {
          navigate("/admins/shippers");
        } else {
          navigate(`/admins/users/${response.userId}`);
        }
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      setError("Failed to submit user data.");
    }
  };

  return (
    <div>
      <h1>Update User</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
          <label>Roles:</label>
          {allRoles.map((role) => (
            <div key={role}>
              <input
                type="checkbox"
                name="roles"
                value={role}
                checked={user.roles.includes(role)}
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default AdminUpdateUserForm;
