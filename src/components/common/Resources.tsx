
import { Link } from 'react-router-dom';

const Resources = () => {
  return (
    <div className="bg-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Resources</h2>
        <div className="flex flex-col items-center space-y-4">
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>
          <Link to="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link to="/blog" className="hover:underline">
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Resources;
