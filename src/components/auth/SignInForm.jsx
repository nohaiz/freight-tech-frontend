import "../auth/auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/auth/authServices";

const SignInForm = (prop) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const { email, password } = formData;

    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";

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
      const response = await authServices.signin(formData);
      if (response.error || response.message) {
        setErrors({ general: "User data entry invalid. Please try again." });
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
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Sign In</button>
      {errors.general && <p>{errors.general}</p>}
    </form>
  );
};

export default SignInForm;
