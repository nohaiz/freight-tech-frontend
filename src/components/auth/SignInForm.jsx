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
    <>
      <div className="columns is-vcentered">
        <div className="column">
          <form onSubmit={handleSubmit} className="form-container">
            <h1 className="title is-2 has-text-centered">Sign In</h1>
            {errors.general && <p className="notification is-danger">{errors.general}</p>}
            <label className="label has-text-white">Email:</label>
            <input
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="help is-danger">{errors.email}</p>}

            <label className="label has-text-white">Password:</label>
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <p className="help is-danger">{errors.password}</p>}

            <button className="button has-background-warning" type="submit">Sign In</button>

          </form>
        </div>
        <div className="column custom-image">
          <img src="/illustration.png" alt="illustration" />
        </div>
      </div>
    </>
  );


};

export default SignInForm;
