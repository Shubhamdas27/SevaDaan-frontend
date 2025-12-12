import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import NGOProfile from '../components/ngo/NGOProfile';
import { Spinner } from '../components/ui/Spinner';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { NGO } from '../types';
import { 
  useNGOs, 
  usePrograms, 
  useTestimonials, 
  useMedia, 
  useNotices 
} from '../hooks/useApiHooks';

const NGODetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getNGOById } = useNGOs();
  const { programs, fetchPrograms } = usePrograms();
  const { testimonials, fetchTestimonials } = useTestimonials();
  const { media, fetchMedia } = useMedia();
  const { notices, fetchNotices } = useNotices();
  
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNGOData = async () => {
      if (!id) {
        setError('NGO ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch NGO details and related data
        const [ngoData] = await Promise.all([
          getNGOById(id),
          fetchPrograms({ ngoId: id }),
          fetchTestimonials(id),
          fetchMedia({ ngoId: id }),
          fetchNotices({ ngoId: id })
        ]);
        
        setNgo(ngoData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load NGO data');
        setNgo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !ngo) {
    return (
      <Layout>
        <Card className="container py-16 border-error-300 bg-error-50">
          <CardContent className="text-center p-6">
            <h2 className="text-2xl font-bold text-error-600 mb-4">Error</h2>
            <p className="text-error-600 mb-4">{error || 'NGO not found'}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <NGOProfile
        ngo={ngo}
        programs={programs}
        testimonials={testimonials}
        mediaItems={media}
        notices={notices}
      />
    </Layout>
  );
};

export default NGODetail;