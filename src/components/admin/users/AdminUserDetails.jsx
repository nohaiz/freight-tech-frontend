import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminServices";

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
    <div>
      <h1>User Details</h1>
      {user && (
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Verified User:</strong> {user.verifiedUser ? "Yes" : "No"}
          </p>
          <p>
            <strong>Roles:</strong> {user.roles.join(", ")}
          </p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;
