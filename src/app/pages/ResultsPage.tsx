import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Trophy, TrendingUp, Users } from 'lucide-react';

export default function ResultsPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { getResults } = useVoting();
  const navigate = useNavigate();

  useEffect(() => {
    if (!electionId) {
      navigate('/elections');
      return;
    }
    
    loadResults();
  }, [electionId, navigate]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await getResults(electionId!);
      
      if (data && data.success) {
        setResults(data);
      } else {
        toast.error('Failed to load results');
        navigate('/elections');
      }
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/elections')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Elections
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{results.election.title}</h1>
              <p className="text-gray-600 mt-2">{results.election.description}</p>
            </div>
            <Badge className="bg-purple-500">
              {results.election.status}
            </Badge>
          </div>
          
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Total Votes: {results.totalVotes}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {Object.entries(results.results).map(([position, candidates]: [string, any[]]) => {
            const totalVotesForPosition = candidates.reduce((sum, c) => sum + c.votes, 0);
            const winner = candidates[0]; // Already sorted by votes

            return (
              <Card key={position}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {position}
                  </CardTitle>
                  <CardDescription>
                    {totalVotesForPosition} total votes cast for this position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidates.map((candidate, index) => {
                      const percentage = getPercentage(candidate.votes, totalVotesForPosition);
                      const isWinner = index === 0 && candidate.votes > 0;

                      return (
                        <div
                          key={candidate.id}
                          className={`p-4 rounded-lg border-2 ${
                            isWinner
                              ? 'border-yellow-400 bg-yellow-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {candidate.imageUrl && (
                              <img
                                src={candidate.imageUrl}
                                alt={candidate.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                      {candidate.name}
                                    </h3>
                                    {isWinner && (
                                      <Trophy className="h-5 w-5 text-yellow-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {candidate.department} • {candidate.year}
                                  </p>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-gray-900">
                                    {candidate.votes}
                                  </p>
                                  <p className="text-sm text-gray-600">votes</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Vote Share</span>
                                  <span className="font-semibold text-gray-900">{percentage}%</span>
                                </div>
                                <Progress value={percentage} className="h-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {results.election.status === 'completed' && (
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardContent className="py-6 text-center">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Election Completed
              </h3>
              <p className="text-sm text-green-700">
                These are the final results. Thank you for participating in this election.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
