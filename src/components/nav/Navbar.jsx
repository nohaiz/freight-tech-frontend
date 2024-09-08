import "../nav/nav.css";
import { Link } from "react-router-dom";

const Navbar = ({ user, handleSignout }) => {
  return (
    <nav>
      {!user ? (
        <>
          <Link to="/auth/sign-in">Sign In</Link>
          <Link to="/auth/sign-up">Sign Up</Link>
        </>
      ) : (
        <>
          <Link to={`/${user.role}s/orders`}>Home</Link>
          <a onClick={handleSignout} href="/">
            Sign Out
          </a>
        </>
      )}
    </nav>
  );
};

export default Navbar;
