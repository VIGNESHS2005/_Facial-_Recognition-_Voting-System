import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Database, RefreshCw, Vote, Users, Calendar, Trophy } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import type { Election, Candidate, Voter } from '../context/VotingContext';

export default function ViewAllData() {
  const [elections, setElections] = useState<Election[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [candidatesByElection, setCandidatesByElection] = useState<Record<string, Candidate[]>>({});
  const [loading, setLoading] = useState(true);

  const { isAdmin, getElections, getVoters, getCandidates } = useVoting();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    loadAllData();
  }, [isAdmin, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load elections
      const electionsData = await getElections();
      setElections(electionsData);

      // Load voters
      const votersData = await getVoters();
      setVoters(votersData);

      // Load candidates for each election
      const candidatesMap: Record<string, Candidate[]> = {};
      for (const election of electionsData) {
        const candidates = await getCandidates(election.id);
        candidatesMap[election.id] = candidates;
      }
      setCandidatesByElection(candidatesMap);

      toast.success('Data loaded successfully');
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalCandidates = () => {
    return Object.values(candidatesByElection).reduce((sum, candidates) => sum + candidates.length, 0);
  };

  const getTotalVotes = () => {
    return elections.reduce((sum, election) => sum + (election.totalVotes || 0), 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Database className="h-8 w-8" />
                Database Viewer
              </h1>
              <p className="text-muted-foreground mt-2">View all stored data in the system</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={loadAllData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading all data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Elections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{elections.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Candidates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{getTotalCandidates()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Voters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{voters.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Vote className="h-4 w-4" />
                    Total Votes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{getTotalVotes()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabbed Data View */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Data</CardTitle>
                <CardDescription>Browse all data tables in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="elections" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="elections">Elections</TabsTrigger>
                    <TabsTrigger value="candidates">Candidates</TabsTrigger>
                    <TabsTrigger value="voters">Voters</TabsTrigger>
                  </TabsList>

                  {/* Elections Tab */}
                  <TabsContent value="elections" className="space-y-4">
                    {elections.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Elections</h3>
                        <p className="text-gray-600">No election data found in the database</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {elections.map((election) => (
                          <Card key={election.id} className="border-l-4 border-l-purple-500">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-xl">{election.title}</CardTitle>
                                  <CardDescription className="mt-1">
                                    {election.description}
                                  </CardDescription>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  election.status === 'active' ? 'bg-green-100 text-green-800' :
                                  election.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {election.status}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Election ID:</span>
                                  <p className="font-mono text-xs mt-1 bg-gray-50 p-2 rounded">{election.id}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total Votes:</span>
                                  <p className="font-semibold mt-1">{election.totalVotes || 0}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Start Date:</span>
                                  <p className="font-medium mt-1">
                                    {new Date(election.startDate).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-600">End Date:</span>
                                  <p className="font-medium mt-1">
                                    {new Date(election.endDate).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {election.positions && election.positions.length > 0 && (
                                <div>
                                  <span className="text-gray-600 text-sm">Positions:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {election.positions.map((position, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                                      >
                                        {position}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {candidatesByElection[election.id] && candidatesByElection[election.id].length > 0 && (
                                <div className="pt-3 border-t">
                                  <span className="text-gray-600 text-sm">
                                    Candidates: {candidatesByElection[election.id].length}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Candidates Tab */}
                  <TabsContent value="candidates" className="space-y-4">
                    {getTotalCandidates() === 0 ? (
                      <div className="text-center py-12">
                        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Candidates</h3>
                        <p className="text-gray-600">No candidate data found in the database</p>
                      </div>
                    ) : (
                      Object.entries(candidatesByElection).map(([electionId, candidates]) => {
                        const election = elections.find(e => e.id === electionId);
                        if (!candidates.length) return null;

                        return (
                          <div key={electionId} className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              {election?.title || electionId}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {candidates.map((candidate) => (
                                <Card key={candidate.id} className="border-l-4 border-l-blue-500">
                                  <CardHeader>
                                    <div className="flex items-start gap-4">
                                      {candidate.imageUrl && (
                                        <img
                                          src={candidate.imageUrl}
                                          alt={candidate.name}
                                          className="w-16 h-16 rounded-full object-cover"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                                        <CardDescription>{candidate.position}</CardDescription>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                          {candidate.votes || 0}
                                        </div>
                                        <div className="text-xs text-gray-600">votes</div>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="text-gray-600">Department:</span>
                                        <p className="font-medium">{candidate.department}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Year:</span>
                                        <p className="font-medium">{candidate.year}</p>
                                      </div>
                                    </div>

                                    {candidate.manifesto && (
                                      <div>
                                        <span className="text-gray-600">Manifesto:</span>
                                        <p className="text-gray-700 mt-1 line-clamp-2">
                                          {candidate.manifesto}
                                        </p>
                                      </div>
                                    )}

                                    <div className="pt-2 border-t">
                                      <span className="text-gray-600">Candidate ID:</span>
                                      <p className="font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                                        {candidate.id}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>

                  {/* Voters Tab */}
                  <TabsContent value="voters" className="space-y-4">
                    {voters.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Voters</h3>
                        <p className="text-gray-600">No voter data found in the database</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Student Info
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Contact
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Department
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Voting History
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {voters.map((voter) => {
                              const votedCount = voter.hasVoted ? Object.keys(voter.hasVoted).length : 0;

                              return (
                                <tr key={voter.studentId} className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                    <div>
                                      <div className="font-medium text-gray-900">{voter.name}</div>
                                      <div className="text-sm text-gray-500 font-mono">{voter.studentId}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{voter.email}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm">
                                      <div className="text-gray-900">{voter.department}</div>
                                      <div className="text-gray-500">{voter.year}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm">
                                      <div className="font-medium text-gray-900">
                                        {votedCount} election{votedCount !== 1 ? 's' : ''}
                                      </div>
                                      {voter.hasVoted && votedCount > 0 && (
                                        <div className="mt-1">
                                          {Object.keys(voter.hasVoted).map((electionId) => {
                                            const election = elections.find(e => e.id === electionId);
                                            return (
                                              <div key={electionId} className="text-xs text-gray-500">
                                                ✓ {election?.title || electionId}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
