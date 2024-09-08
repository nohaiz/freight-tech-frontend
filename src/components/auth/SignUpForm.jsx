import "../auth/auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/authServices";

const SignUpForm = (prop) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    verifiedUser: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const { email, password, confirmPassword, verifiedUser } = formData;

    if (!email.trim()) errors.email = "Email is required.";
    if (!password || password.length < 8)
      errors.password = "Password must be at least 8 characters long.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    if (verifiedUser === null) errors.verifiedUser = "Please select an option.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({});
      const response = await authServices.signup(formData);

      if (response.error || response.message) {
        setErrors({
          general: `User data entry invalid. Please try again. ${response.error}`,
        });
      } else {
        prop.setUser(response);
        navigate(`/${response.role}s/orders`);
      }
    } catch (error) {
      console.error(error);
      setErrors({
        general: "User data entry invalid. Please try again.",
      });
    }

    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      verifiedUser: null,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p>{errors.username}</p>}

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p>{errors.password}</p>}

        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

        <label>Are you a Shipper?</label>
        <input
          type="radio"
          name="verifiedUser"
          value={true}
          checked={formData.verifiedUser === true}
          onChange={() => setFormData({ ...formData, verifiedUser: true })}
        />
        <label>Yes</label>

        <input
          type="radio"
          name="verifiedUser"
          value={false}
          checked={formData.verifiedUser === false}
          onChange={() => setFormData({ ...formData, verifiedUser: false })}
        />
        <label>No</label>
        {errors.verifiedUser && <p>{errors.verifiedUser}</p>}

        <button type="submit">Sign Up</button>
        {errors.general && <p>{errors.general}</p>}
      </form>
    </>
  );
};

export default SignUpForm;
