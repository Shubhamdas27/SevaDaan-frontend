import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { StatusBadge } from '../../ui/StatusBadge';

interface Program {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  capacity?: number;
}

const ProgramManagementTable: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: '1',
      title: 'Women Empowerment Workshop',
      description: 'A workshop focused on skills development for women in rural areas.',
      location: 'Nashik, Maharashtra',
      startDate: '2025-06-15T10:00:00Z',
      endDate: '2025-06-15T16:00:00Z',
      status: 'upcoming',
      capacity: 50
    },
    {
      id: '2',
      title: 'Rural Health Camp',
      description: 'Free medical checkups and awareness sessions for village residents.',
      location: 'Madurai, Tamil Nadu',
      startDate: '2025-07-10T09:00:00Z',
      endDate: '2025-07-10T17:00:00Z',
      status: 'upcoming',
      capacity: 100
    },
    {
      id: '3',
      title: 'Digital Literacy Program',
      description: 'Teaching basic computer skills to underprivileged youth.',
      location: 'Jaipur, Rajasthan',
      startDate: '2025-05-01T09:00:00Z',
      endDate: '2025-06-30T17:00:00Z',
      status: 'ongoing',
      capacity: 30
    },
    {
      id: '4',
      title: 'Clean Water Initiative',
      description: 'Installation of water purifiers in schools and community centers.',
      location: 'Darjeeling, West Bengal',
      startDate: '2025-04-15T08:00:00Z',
      endDate: '2025-05-15T18:00:00Z',
      status: 'completed',
      capacity: 20
    },
    {
      id: '5',
      title: 'Organic Farming Workshop',
      description: 'Training farmers on sustainable agricultural practices.',
      location: 'Coimbatore, Tamil Nadu',
      startDate: '2025-03-10T10:00:00Z',
      endDate: '2025-03-12T16:00:00Z',
      status: 'completed',
      capacity: 40
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<Partial<Program>>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    capacity: 0
  });

  const handleAddClick = () => {
    setModalMode('add');
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
      capacity: 0
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (program: Program) => {
    setModalMode('edit');
    setSelectedProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      location: program.location,
      startDate: new Date(program.startDate).toISOString().split('T')[0],
      endDate: program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : '',
      status: program.status,
      capacity: program.capacity
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this program?');
    if (confirmDelete) {
      setPrograms(programs.filter(program => program.id !== id));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const newProgram: Program = {
        id: Date.now().toString(),
        title: formData.title || '',
        description: formData.description || '',
        location: formData.location || '',
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        status: formData.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
        capacity: formData.capacity
      };
      
      setPrograms([...programs, newProgram]);
    } else if (modalMode === 'edit' && selectedProgram) {
      const updatedPrograms = programs.map(program => {
        if (program.id === selectedProgram.id) {
          return {
            ...program,
            title: formData.title || program.title,
            description: formData.description || program.description,
            location: formData.location || program.location,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : program.startDate,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : program.endDate,
            status: formData.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled' || program.status,
            capacity: formData.capacity !== undefined ? formData.capacity : program.capacity
          };
        }
        return program;
      });
      
      setPrograms(updatedPrograms);
    }
    
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Program Management</CardTitle>
          <Button onClick={handleAddClick} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Add Program
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-3 text-sm font-medium text-slate-600">Title</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Location</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <div className="font-medium">{program.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{program.description.substring(0, 60)}...</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-slate-400 mr-1" />
                      {program.location}
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <div>{formatDate(program.startDate)}</div>
                    {program.endDate && program.startDate !== program.endDate && (
                      <div className="text-xs text-slate-500">to {formatDate(program.endDate)}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={program.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(program)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(program.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={modalMode === 'add' ? 'Add New Program' : 'Edit Program'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Program Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter program title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter program description"
                required
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-slate-200 py-2 px-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-slate-700 mb-1">
                  Capacity
                </label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === 'add' ? 'Create Program' : 'Update Program'}
              </Button>
            </div>
          </form>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default ProgramManagementTable;
