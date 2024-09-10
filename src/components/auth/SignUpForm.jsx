import "../auth/auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/auth/authServices";

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
      <div className="background">
        <div className="box">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
              {errors.username && (
                <p className="help is-danger">{errors.username}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Email</label>
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
              <label className="label">Password</label>
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

            <div className="field">
              <label className="label">Confirm Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="help is-danger">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="field">
              <label className="label">Are you a Shipper?</label>
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="verifiedUser"
                    value={true}
                    checked={formData.verifiedUser === true}
                    onChange={() =>
                      setFormData({ ...formData, verifiedUser: true })
                    }
                  />
                  Yes
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="verifiedUser"
                    value={false}
                    checked={formData.verifiedUser === false}
                    onChange={() =>
                      setFormData({ ...formData, verifiedUser: false })
                    }
                  />
                  No
                </label>
              </div>
              {errors.verifiedUser && (
                <p className="help is-danger">{errors.verifiedUser}</p>
              )}
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link is-dark " type="submit">
                  Sign Up
                </button>
              </div>
            </div>
            {errors.general && (
              <p className="help is-danger">{errors.general}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
