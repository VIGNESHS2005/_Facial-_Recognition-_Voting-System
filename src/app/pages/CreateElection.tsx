import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Trash2, ArrowLeft, Calendar } from 'lucide-react';

export default function CreateElection() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [positions, setPositions] = useState(['President', 'Vice President', 'Secretary', 'Treasurer']);
  const [newPosition, setNewPosition] = useState('');
  const [candidates, setCandidates] = useState<Array<{
    position: string;
    name: string;
    department: string;
    year: string;
    manifesto: string;
    imageUrl: string;
  }>>([]);
  const [currentCandidate, setCurrentCandidate] = useState({
    position: '',
    name: '',
    department: '',
    year: '',
    manifesto: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isAdmin, createElection, addCandidate } = useVoting();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate('/admin-login');
    return null;
  }

  const handleAddPosition = () => {
    if (newPosition.trim() && !positions.includes(newPosition.trim())) {
      setPositions([...positions, newPosition.trim()]);
      setNewPosition('');
    }
  };

  const handleRemovePosition = (position: string) => {
    setPositions(positions.filter(p => p !== position));
    setCandidates(candidates.filter(c => c.position !== position));
  };

  const handleAddCandidate = () => {
    if (!currentCandidate.position || !currentCandidate.name) {
      toast.error('Please fill in position and candidate name');
      return;
    }
    
    setCandidates([...candidates, currentCandidate]);
    setCurrentCandidate({
      position: '',
      name: '',
      department: '',
      year: '',
      manifesto: '',
      imageUrl: '',
    });
    toast.success('Candidate added');
  };

  const handleRemoveCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !startDate || !endDate) {
      toast.error('Please fill in all election details');
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }
    
    if (candidates.length === 0) {
      toast.error('Please add at least one candidate');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create election
      const electionResult = await createElection({
        title,
        description,
        startDate,
        endDate,
        positions,
      });
      
      if (!electionResult.success || !electionResult.election) {
        toast.error(electionResult.message || 'Failed to create election');
        setIsSubmitting(false);
        return;
      }
      
      // Add all candidates
      for (const candidate of candidates) {
        await addCandidate({
          electionId: electionResult.election.id,
          ...candidate,
        });
      }
      
      toast.success('Election created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Failed to create election. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Election</h1>
          <p className="text-gray-600 mt-2">Set up a new election with candidates</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Election Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Election Details
              </CardTitle>
              <CardDescription>Basic information about the election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Election Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Student Council Election 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this election"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Positions */}
          <Card>
            <CardHeader>
              <CardTitle>Positions</CardTitle>
              <CardDescription>Define the positions for this election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a position (e.g., Sports Captain)"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPosition())}
                />
                <Button type="button" onClick={handleAddPosition}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {positions.map((position) => (
                  <div
                    key={position}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-900 rounded-lg"
                  >
                    <span className="text-sm font-medium">{position}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePosition(position)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Candidates */}
          <Card>
            <CardHeader>
              <CardTitle>Add Candidates</CardTitle>
              <CardDescription>Add candidates for each position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={currentCandidate.position}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, position: e.target.value })}
                  >
                    <option value="">Select position</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Candidate Name *</Label>
                  <Input
                    placeholder="Full name"
                    value={currentCandidate.name}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    placeholder="e.g., Computer Science"
                    value={currentCandidate.department}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, department: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    placeholder="e.g., 3rd Year"
                    value={currentCandidate.year}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, year: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Image URL</Label>
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    value={currentCandidate.imageUrl}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, imageUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Manifesto</Label>
                  <Textarea
                    placeholder="Campaign promises and goals..."
                    value={currentCandidate.manifesto}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, manifesto: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="button" onClick={handleAddCandidate} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                </div>
              </div>

              {/* Candidates List */}
              {candidates.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Candidates ({candidates.length})</Label>
                  <div className="space-y-2">
                    {candidates.map((candidate, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white"
                      >
                        <div>
                          <p className="font-semibold">{candidate.name}</p>
                          <p className="text-sm text-gray-600">
                            {candidate.position} • {candidate.department} • {candidate.year}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCandidate(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Election...' : 'Create Election'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
