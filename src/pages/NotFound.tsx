import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/icons';
import { Button } from '../components/ui/Button';
import Layout from '../components/common/Layout';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button variant="primary" leftIcon={<Icons.home className="w-4 h-4 mr-2" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;