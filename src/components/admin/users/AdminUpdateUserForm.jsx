import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminUserServices";
import "./adminUserForm.css";

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

    const hasDriverRole = user.roles.includes("driver");
    const hasShipperRole = user.roles.includes("shipper");

    if (hasDriverRole && hasShipperRole) {
      setError("Cannot assign both 'driver' and 'shipper' roles.");
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
    <>
      <div className="columns-two">
        <div className="column">
          <form onSubmit={handleSubmit} className="sign-up-form-container">
            <h1 className="title is-2 has-text-centered custom-title">
              Update User
            </h1>
            {error && <p className="notification is-danger">{error}</p>}
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
              <label className="label">Roles</label>
              <div className="control roles-container">
                {allRoles.map((role) => (
                  <label key={role} className="checkbox role-checkbox">
                    <input
                      type="checkbox"
                      name="roles"
                      value={role}
                      checked={
                        Array.isArray(user.roles) && user.roles.includes(role)
                      }
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
                    checked={user.verifiedUser || false}
                    onChange={handleChange}
                  />
                  Verified
                </label>
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
    </>
  );
};

export default AdminUpdateUserForm;
