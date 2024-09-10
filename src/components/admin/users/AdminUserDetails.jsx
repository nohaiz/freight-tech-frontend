import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminUserServices";
import "bulma/css/bulma.min.css";
import "./adminUserDetails.css";

const AdminUserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await adminServices.showUser(userId);
        setUser(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleDelete = async () => {
    try {
      await adminServices.deleteUser(userId);
      navigate("/admins/shippers");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/admins/users/${userId}/edit`);
  };

  return (
    <div className="background">
      <div className="box">
        <div className="content">
          <h1 className="title">User Details</h1>
          {user && (
            <div className="user-details">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Verified User:</strong>{" "}
                {user.verifiedUser ? "Yes" : "No"}
              </p>
              <p>
                <strong>Roles:</strong>{" "}
                {user.roles
                  .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
                  .join(", ")}
              </p>
              <div className="buttons">
                <button className="button is-dark is-link" onClick={handleEdit}>
                  Edit
                </button>
                <button
                  className="button is-dark is-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
