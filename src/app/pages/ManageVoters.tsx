import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Users, Search, UserCheck, Mail, Trash2, AlertTriangle } from 'lucide-react';
import type { Voter } from '../context/VotingContext';

export default function ManageVoters() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filteredVoters, setFilteredVoters] = useState<Voter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const { isAdmin, getVoters, deleteVoter, clearAllData } = useVoting();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    loadVoters();
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVoters(voters);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredVoters(
        voters.filter(
          (voter) =>
            voter.name.toLowerCase().includes(query) ||
            voter.studentId.toLowerCase().includes(query) ||
            voter.email.toLowerCase().includes(query) ||
            voter.department.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, voters]);

  const loadVoters = async () => {
    setLoading(true);
    try {
      const data = await getVoters();
      setVoters(data);
      setFilteredVoters(data);
    } catch (error) {
      toast.error('Failed to load voters');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoter = async (studentId: string) => {
    setDeletingId(studentId);
    try {
      const result = await deleteVoter(studentId);
      if (result.success) {
        toast.success(`Voter ${studentId} deleted`);
        setVoters(prev => prev.filter(v => v.studentId !== studentId));
      } else {
        toast.error(result.message);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      const result = await clearAllData();
      if (result.success) {
        toast.success('All data cleared successfully');
        setVoters([]);
        setFilteredVoters([]);
        setShowClearConfirm(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setClearing(false);
    }
  };

  const getVotedElectionsCount = (voter: Voter) => {
    return voter.hasVoted ? Object.keys(voter.hasVoted).length : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Clear All Data?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete <strong>all voters, elections, candidates, and votes</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowClearConfirm(false)}
                disabled={clearing}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleClearAll}
                disabled={clearing}
              >
                {clearing ? 'Clearing...' : 'Yes, Clear All'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Voters</h1>
              <p className="text-gray-600 mt-2">View, search, and remove registered voters</p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading voters...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Registered Voters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{voters.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Voters Who Have Voted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {voters.filter(v => getVotedElectionsCount(v) > 0).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Voters Not Voted Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {voters.filter(v => getVotedElectionsCount(v) === 0).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search + Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registered Voters
                </CardTitle>
                <CardDescription>Search and manage all registered voters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, student ID, email, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredVoters.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery ? 'No voters found' : 'No registered voters'}
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery ? 'Try adjusting your search query' : 'Voters will appear here once they register'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department & Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voting Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredVoters.map((voter) => (
                          <tr key={voter.studentId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                                  <UserCheck className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                                  <div className="text-sm text-gray-500">{voter.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-sm text-gray-900">
                                <Mail className="h-4 w-4 text-gray-400" />
                                {voter.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{voter.department}</div>
                              <div className="text-sm text-gray-500">{voter.year}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{getVotedElectionsCount(voter)} elections voted</div>
                                {voter.registeredAt && (
                                  <div className="text-xs text-gray-500">
                                    Registered: {new Date(voter.registeredAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                disabled={deletingId === voter.studentId}
                                onClick={() => handleDeleteVoter(voter.studentId)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {deletingId === voter.studentId ? 'Deleting...' : 'Delete'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
