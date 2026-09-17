import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h2>Job Portal</h2>

        <div>
          <Link to="/">Jobs</Link>
          <Link to="/applications">
            My Applications
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;