import React from 'react';
import { Icons } from '../icons';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Grant } from '../../types';
import { formatDate, formatCurrency } from '../../lib/utils';
import { getGrantStatusBadge } from '../../lib/status-utils';

interface GrantCardProps {
  grant: Grant;
  isNgo: boolean;
}

const GrantCard: React.FC<GrantCardProps> = ({ grant, isNgo }) => {
  return (
    <Card isHoverable>
      <CardContent>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold">{grant.title}</h3>
          {getGrantStatusBadge(grant.status)}
        </div>
        <div className="flex items-center text-sm text-slate-500 mb-1">
          <Icons.calendar className="w-4 h-4 mr-1" />
          <span>Deadline: {formatDate(grant.deadline)}</span>
        </div>
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Icons.dollarSign className="w-4 h-4 mr-1" />
          <span>Amount: {formatCurrency(grant.amount)}</span>
        </div>
        <p className="text-slate-600 mb-4">
          {grant.description.length > 150
            ? `${grant.description.substring(0, 150)}...`
            : grant.description
          }
        </p>
        <div className="mb-4">
          <div className="flex items-start mb-2">
            <Icons.info className="w-4 h-4 text-primary-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Eligibility Criteria</h4>
              <p className="text-sm text-slate-600">
                {grant.eligibilityCriteria.length > 100
                  ? `${grant.eligibilityCriteria.substring(0, 100)}...`
                  : grant.eligibilityCriteria
                }
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Provider: {grant.provider}
          </p>
        </div>
        <div className="flex justify-between items-center">
          {isNgo && grant.status === 'open' && grant.applicationLink ? (
            <a href={grant.applicationLink}>
              <Button variant="primary" rightIcon={<Icons.externalLink className="w-4 h-4" />}>
                Apply Now
              </Button>
            </a>
          ) : (
            <Button 
              variant="primary" 
              disabled={!isNgo || grant.status !== 'open'}
              title={!isNgo ? "Only NGOs can apply for grants" : grant.status !== 'open' ? "This grant is not open for applications" : ""}
            >
              {isNgo ? "Apply Now" : "NGOs Only"}
            </Button>
          )}
          <a href={`/grants/${grant.id}`} className="text-primary-600 hover:text-primary-700 text-sm">
            View Details
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrantCard;