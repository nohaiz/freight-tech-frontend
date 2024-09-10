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
    <div className="box">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email:</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
            {errors.email && <p className="help is-danger">{errors.email}</p>}
          </div>

          <div className="field">
            <label className="label">Password:</label>
            <div className="control">
              <input
                className="input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="help is-danger">{errors.password}</p>
            )}
          </div>

          <div className="field is-grouped button-container">
            <div className="control">
              <button className="button is-link" type="submit">
                Sign In
              </button>
            </div>
          </div>
          {errors.general && <p className="help is-danger">{errors.general}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
