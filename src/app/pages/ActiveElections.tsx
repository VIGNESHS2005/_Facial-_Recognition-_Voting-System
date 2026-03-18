import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Vote, Calendar, Clock, LogOut, BarChart3 } from 'lucide-react';
import type { Election } from '../context/VotingContext';

export default function ActiveElections() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, getElections, logout } = useVoting();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/voter-login');
      return;
    }
    
    loadElections();
  }, [currentUser, navigate]);

  const loadElections = async () => {
    setLoading(true);
    try {
      const data = await getElections();
      setElections(data);
    } catch (error) {
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'gradient-success text-white';
      case 'upcoming':
        return 'gradient-primary text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canVote = (election: Election) => {
    return election.status === 'active' && !currentUser?.hasVoted?.[election.id];
  };

  const hasVoted = (election: Election) => {
    return currentUser?.hasVoted?.[election.id] || false;
  };

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5"></div>
      
      {/* Header */}
      <div className="relative z-10 glass-card border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Active Elections</h1>
            <p className="text-sm text-gray-600 font-medium">
              Welcome, <span className="text-teal-600 font-semibold">{currentUser?.name}</span> ({currentUser?.studentId})
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-2 hover:bg-gray-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading elections...</p>
          </div>
        ) : elections.length === 0 ? (
          <Card className="shadow-xl border-2 hover-lift">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Vote className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Elections Available</h3>
              <p className="text-gray-600 text-lg">
                There are currently no elections available. Check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <Card key={election.id} className="shadow-xl border-2 hover-lift hover:shadow-2xl transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl font-bold">{election.title}</CardTitle>
                    <Badge className={`${getStatusColor(election.status)} px-3 py-1 font-semibold`}>
                      {election.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{election.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Start: {formatDate(election.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>End: {formatDate(election.endDate)}</span>
                    </div>
                    {election.totalVotes !== undefined && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <BarChart3 className="h-4 w-4" />
                        <span>Total Votes: {election.totalVotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {canVote(election) ? (
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/vote/${election.id}`)}
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Cast Your Vote
                      </Button>
                    ) : hasVoted(election) ? (
                      <div className="space-y-2">
                        <Badge variant="outline" className="w-full justify-center py-2">
                          ✓ You have voted
                        </Badge>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/results/${election.id}`)}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Results
                        </Button>
                      </div>
                    ) : election.status === 'upcoming' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Election Not Started
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/results/${election.id}`)}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}