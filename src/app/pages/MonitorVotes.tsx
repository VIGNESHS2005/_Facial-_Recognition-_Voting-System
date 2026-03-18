import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft, Activity, BarChart3, Users, TrendingUp } from 'lucide-react';
import type { Election } from '../context/VotingContext';

export default function MonitorVotes() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAdmin, getElections, getResults, getVoters } = useVoting();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    
    loadElections();
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (selectedElection) {
      loadResults(selectedElection);
    }
  }, [selectedElection]);

  const loadElections = async () => {
    setLoading(true);
    try {
      const data = await getElections();
      setElections(data);
      
      if (data.length > 0) {
        setSelectedElection(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (electionId: string) => {
    try {
      const data = await getResults(electionId);
      setResults(data);
    } catch (error) {
      toast.error('Failed to load results');
    }
  };

  const getVoterTurnout = () => {
    if (!results) return { percentage: 0, voted: 0, total: 0 };
    
    // This is a simplified calculation
    const voted = results.totalVotes || 0;
    const total = 100; // You would get this from total registered voters
    const percentage = total > 0 ? (voted / total) * 100 : 0;
    
    return { percentage, voted, total };
  };

  const currentElection = elections.find(e => e.id === selectedElection);
  const turnout = getVoterTurnout();

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
          <h1 className="text-3xl font-bold text-gray-900">Monitor Votes</h1>
          <p className="text-gray-600 mt-2">Track real-time voting activity and analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        ) : elections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Elections Available</h3>
              <p className="text-gray-600 mb-4">
                Create an election to start monitoring votes
              </p>
              <Button onClick={() => navigate('/admin/create-election')}>
                Create Election
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Election Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Election</CardTitle>
                <CardDescription>Choose an election to monitor</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedElection} onValueChange={setSelectedElection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election.id} value={election.id}>
                        {election.title} ({election.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {currentElection && (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Total Votes Cast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">
                        {results?.totalVotes || 0}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Across all positions
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Voter Turnout
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">
                        {turnout.percentage.toFixed(1)}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {turnout.voted} voters participated
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Election Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 capitalize">
                        {currentElection.status}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Current election state
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Turnout Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Voter Turnout Progress
                    </CardTitle>
                    <CardDescription>
                      Track how many voters have participated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Participation Rate</span>
                          <span className="font-semibold text-gray-900">
                            {turnout.voted} / {turnout.total} voters
                          </span>
                        </div>
                        <Progress value={turnout.percentage} className="h-4" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Voted</p>
                          <p className="text-2xl font-bold text-green-600">{turnout.voted}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Not Voted</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {turnout.total - turnout.voted}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Position-wise Results */}
                {results && results.results && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Live Results by Position
                      </CardTitle>
                      <CardDescription>
                        Real-time vote counts for each position
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {Object.entries(results.results).map(([position, candidates]: [string, any[]]) => {
                          const totalVotesForPosition = candidates.reduce((sum, c) => sum + c.votes, 0);
                          
                          return (
                            <div key={position} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{position}</h3>
                                <span className="text-sm text-gray-600">
                                  {totalVotesForPosition} votes
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                {candidates.map((candidate) => {
                                  const percentage = totalVotesForPosition > 0
                                    ? (candidate.votes / totalVotesForPosition) * 100
                                    : 0;
                                  
                                  return (
                                    <div key={candidate.id} className="space-y-1">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-900">
                                          {candidate.name}
                                        </span>
                                        <span className="text-gray-600">
                                          {candidate.votes} votes ({percentage.toFixed(1)}%)
                                        </span>
                                      </div>
                                      <Progress value={percentage} className="h-2" />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => loadResults(selectedElection)}>
                    Refresh Data
                  </Button>
                  <Button onClick={() => navigate(`/results/${selectedElection}`)}>
                    View Full Results
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
