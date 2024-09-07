import "../nav/nav.css";
import { Link } from "react-router-dom";

const Navbar = ({ user, handleSignout }) => {
  return (
    <nav>
      {!user ? (
        <>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      ) : (
        <a onClick={handleSignout} href="/">
          Sign Out
        </a>
      )}
    </nav>
  );
};

export default Navbar;
