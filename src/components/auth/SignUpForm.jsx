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

    if (!email.trim()) errors.email = "*";
    if (!password || password.length < 8)
      errors.password = "*";
    if (password !== confirmPassword)
      errors.confirmPassword = "*";
    if (verifiedUser === null) errors.verifiedUser = "*";

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
      <div className="columns is-vcentered">
        <div className="column">
          <form onSubmit={handleSubmit} className="sign-up-form-container">
            <h1 className="title is-2 has-text-centered custom-title">Sign Up</h1>
            <div className="custom-field">
              {errors.general && <p className="notification is-danger">{errors.general}</p>}
              <label className="label has-text-white">Username</label>
              <input
                className="input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              {errors.email && <p className="help is-danger">{errors.email}</p>}
              <label className="label has-text-white">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.password && (
                <p className="help is-danger">{errors.password}</p>
              )}
              <label className="label has-text-white">Password</label>
              <input
                className="input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.confirmPassword && (
                <p className="help is-danger">{errors.confirmPassword}</p>
              )}
              <label className="label has-text-white">Confirm Password</label>
              <input
                className="input"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.verifiedUser && (
                <p className="help is-danger">{errors.verifiedUser}</p>
              )}
              <div className="radio-button">
                <label className="label has-text-white">Are you a Shipper?</label>
                <label className="radio">Yes</label>
                <input
                  type="radio"
                  name="verifiedUser"
                  value={true}
                  checked={formData.verifiedUser === true}
                  onChange={() =>
                    setFormData({ ...formData, verifiedUser: true })
                  }
                />
                <label className="radio">No</label>
                <input
                  type="radio"
                  name="verifiedUser"
                  value={false}
                  checked={formData.verifiedUser === false}
                  onChange={() =>
                    setFormData({ ...formData, verifiedUser: false })
                  }
                />
              </div>
            </div>
            <button className="button has-background-warning" type="submit">
              Sign Up
            </button>
          </form >
        </div>
        <div className="column custom-image">
          <img src="/illustration.png" alt="illustration" />
        </div>
      </div >
    </>
  );
};

export default SignUpForm;
