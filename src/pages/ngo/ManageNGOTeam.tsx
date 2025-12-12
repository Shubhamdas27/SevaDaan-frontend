import React, { useState, useEffect } from 'react';
import apiService from '../../lib/apiService';
import useLiveUpdates from '../../hooks/useLiveUpdates';
import liveUpdateService from '../../services/liveUpdateService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, ModalFooter } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import Loader from '../../components/Loader';
import ErrorDisplay from '../../components/ErrorDisplay';


// Type definitions
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Manager {
  _id: string;
  userId: User;
  permissions: string[];
  isActive?: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  permissions: string[];
  role?: string;
}

interface UpdateManagerData {
  permissions: string[];
  isActive?: boolean;
}

interface PermissionOption {
  value: string;
  label: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const ManageNGOTeam: React.FC = () => {
  useLiveUpdates(); // Initialize live updates
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentManager, setCurrentManager] = useState<Manager | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    permissions: []
  });
  const { toast } = useToast();

  // Permissions options
  const permissionOptions: PermissionOption[] = [
    { value: 'programs_manage', label: 'Manage Programs' },
    { value: 'volunteers_manage', label: 'Manage Volunteers' },
    { value: 'donations_view', label: 'View Donations' },
    { value: 'reports_view', label: 'View Reports' },
  ];
  
  // Helper function to format error messages
  const formatErrorMessage = (err: ApiError): string => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.message) return err.message;
    return 'An unknown error occurred';
  };

  // Fetch managers data
  const fetchManagers = React.useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.getManagers();
      if (response && Array.isArray(response)) {
        setManagers(response as Manager[]);
        setError('');
      } else if (response && typeof response === 'object' && 'managers' in response) {
        setManagers((response as any).managers);
        setError('');
      } else {
        setManagers([]);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching managers:', err);
      setManagers([]);
      setError(formatErrorMessage(err as ApiError) || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  // Set up real-time event listeners
  useEffect(() => {
    const handleManagerAdded = (newManager: Manager) => {
      setManagers(prev => [...prev, newManager]);
      toast.success('New team member added');
    };

    const handleManagerUpdated = (updatedManager: Manager) => {
      setManagers(prev => 
        prev.map(manager => 
          manager._id === updatedManager._id ? updatedManager : manager
        )
      );
      toast.success('Team member updated');
    };

    const handleManagerDeleted = (data: { managerId: string; email: string }) => {
      setManagers(prev => 
        prev.filter(manager => manager._id !== data.managerId)
      );
      toast.success(`Team member ${data.email} removed`);
    };

    // Subscribe to live updates
    liveUpdateService.onManagerAdded(handleManagerAdded);
    liveUpdateService.onManagerUpdated(handleManagerUpdated);
    liveUpdateService.onManagerDeleted(handleManagerDeleted);

    // Cleanup listeners on unmount
    return () => {
      liveUpdateService.offManagerAdded(handleManagerAdded);
      liveUpdateService.offManagerUpdated(handleManagerUpdated);
      liveUpdateService.offManagerDeleted(handleManagerDeleted);
    };
  }, []); // Empty dependency array to prevent re-subscribing

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, permissions: [...prev.permissions, value] };
      } else {
        return { ...prev, permissions: prev.permissions.filter(p => p !== value) };
      }
    });
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      permissions: []
    });
  };

  const handleAddManager = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setError('');
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.password) {        throw new Error('Password is required');
      }
      
      // Make API call
      const managerData: FormData = {
        ...formData,
        role: 'ngo_manager'
      };
      await apiService.addManager(managerData);
      
      // Success handling
      setShowAddModal(false);
      resetForm();
      toast.success('Team member added successfully');
      fetchManagers();
    } catch (err) {
      console.error('Error adding manager:', err);
      const errorMessage = formatErrorMessage(err as ApiError) || 'Failed to add team member';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEditManager = (manager: Manager): void => {
    setCurrentManager(manager);
    setFormData({
      name: manager.userId.name,
      email: manager.userId.email,
      phone: manager.userId.phone || '',
      password: '',
      permissions: manager.permissions || []
    });
    setShowEditModal(true);
  };

  const handleUpdateManager = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!currentManager || !currentManager._id) {
        throw new Error('No manager selected for update');
      }
        setError('');
      const updateData: UpdateManagerData = {
        permissions: formData.permissions,
        isActive: true
      };
      await apiService.updateManagerPermissions(currentManager._id, updateData);
      
      setShowEditModal(false);
      resetForm();
      toast.success('Team member updated successfully');
      fetchManagers();
    } catch (err) {
      console.error('Error updating manager:', err);
      const errorMessage = formatErrorMessage(err as ApiError) || 'Failed to update team member';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRemoveManager = async (managerId: string): Promise<void> => {
    if (!managerId) {
      setError('Invalid manager ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        setError('');
        await apiService.deleteManager(managerId);
        toast.success('Team member removed successfully');
        fetchManagers();
      } catch (err) {
        console.error('Error removing manager:', err);
        const errorMessage = formatErrorMessage(err as ApiError) || 'Failed to remove team member';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Manage NGO Team</h3>
          <Button onClick={() => setShowAddModal(true)}>
            Add Team Member
          </Button>
        </div>
        <div className="p-6">          {error && (
            <ErrorDisplay 
              variant="error" 
              message={error} 
              onClose={() => setError('')} 
            />
          )}
          
          {loading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {managers.length > 0 ? (
                    managers.map((manager) => (
                      <tr key={manager._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {manager.userId.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {manager.userId.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {manager.userId.phone || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {manager.permissions && manager.permissions.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {manager.permissions.map((permission, idx) => (
                                <li key={idx}>
                                  {permissionOptions.find(p => p.value === permission)?.label || permission}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400">No specific permissions</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditManager(manager)}
                            >
                              <FaEdit className="mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveManager(manager._id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-600"
                            >
                              <FaTrash className="mr-1" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No team members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Manager Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Team Member"
        size="lg"
      >
        <form onSubmit={handleAddManager} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissionOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={formData.permissions.includes(option.value)}
                    onChange={handlePermissionChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddManager}
          >
            Add Team Member
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Manager Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Team Member"
        size="lg"
      >
        <form onSubmit={handleUpdateManager} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter full name"
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissionOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={formData.permissions.includes(option.value)}
                    onChange={handlePermissionChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateManager}
          >
            Update Team Member
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ManageNGOTeam;
