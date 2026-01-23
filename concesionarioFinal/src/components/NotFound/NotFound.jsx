import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notFoundContainer">
      <div className="notFoundContent">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="homeButton">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;