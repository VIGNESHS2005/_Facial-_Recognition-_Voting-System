import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Activity, 
  BarChart3, 
  LogOut,
  Vote,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [elections, setElections] = useState<any[]>([]);
  const [voters, setVoters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isAdmin, logout, getElections, getVoters } = useVoting();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    
    loadDashboardData();
  }, [isAdmin, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [electionsData, votersData] = await Promise.all([
        getElections(),
        getVoters(),
      ]);
      
      setElections(electionsData);
      setVoters(votersData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = {
    totalElections: elections.length,
    activeElections: elections.filter(e => e.status === 'active').length,
    totalVoters: voters.length,
    totalVotes: elections.reduce((sum, e) => sum + (e.totalVotes || 0), 0),
  };

  const quickActions = [
    {
      title: 'Create Election',
      description: 'Set up a new election',
      icon: PlusCircle,
      color: 'bg-blue-500',
      onClick: () => navigate('/admin/create-election'),
    },
    {
      title: 'Manage Voters',
      description: 'View registered voters',
      icon: Users,
      color: 'bg-green-500',
      onClick: () => navigate('/admin/voters'),
    },
    {
      title: 'Monitor Votes',
      description: 'Track voting activity',
      icon: Activity,
      color: 'bg-purple-500',
      onClick: () => navigate('/admin/monitor'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Election Management System</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Elections
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalElections}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeElections} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Registered Voters
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalVoters}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total registered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Votes Cast
                  </CardTitle>
                  <Vote className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalVotes}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all elections
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Elections
                  </CardTitle>
                  <Activity className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.activeElections}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Currently running
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action) => (
                  <Card
                    key={action.title}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={action.onClick}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Elections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Elections</h2>
                <Button variant="outline" onClick={() => navigate('/admin/create-election')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </div>
              
              {elections.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Elections Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first election to get started
                    </p>
                    <Button onClick={() => navigate('/admin/create-election')}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Election
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {elections.slice(0, 6).map((election) => (
                    <Card key={election.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{election.title}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded ${
                            election.status === 'active' ? 'bg-green-100 text-green-700' :
                            election.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {election.status}
                          </span>
                        </div>
                        <CardDescription>{election.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Votes</span>
                          <span className="font-semibold">{election.totalVotes || 0}</span>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => navigate(`/results/${election.id}`)}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Results
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
