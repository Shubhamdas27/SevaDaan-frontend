import { Badge } from '../components/ui/Badge';
import { getStatusVariant } from './utils';

/**
 * Centralized status badge utility for consistent status rendering across the app
 */
export function getStatusBadge(status: string): JSX.Element | null {
  if (!status) return null;
  
  const variant = getStatusVariant(status);
  const displayText = status.charAt(0).toUpperCase() + status.slice(1);
  
  return <Badge variant={variant}>{displayText}</Badge>;
}

/**
 * Status badge for Program entities
 */
export function getProgramStatusBadge(status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'): JSX.Element | null {
  return getStatusBadge(status);
}

/**
 * Status badge for Volunteer Opportunity entities
 */
export function getVolunteerStatusBadge(status: 'open' | 'closed' | 'filled' | 'cancelled' | 'completed'): JSX.Element | null {
  return getStatusBadge(status);
}

/**
 * Status badge for Grant entities
 */
export function getGrantStatusBadge(status: 'open' | 'closed' | 'reviewing' | 'review' | 'approved' | 'rejected'): JSX.Element | null {
  // Handle legacy status values
  const normalizedStatus = status === 'reviewing' ? 'review' : status;
  return getStatusBadge(normalizedStatus);
}

/**
 * Status badge for general application statuses
 */
export function getApplicationStatusBadge(status: 'pending' | 'approved' | 'rejected' | 'processing'): JSX.Element | null {
  return getStatusBadge(status);
}
