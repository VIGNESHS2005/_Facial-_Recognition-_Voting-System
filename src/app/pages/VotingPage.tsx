import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';
import { Vote, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import type { Election, Candidate } from '../context/VotingContext';

export default function VotingPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  
  const { currentUser, getElections, getCandidates, castVote } = useVoting();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/voter-login');
      return;
    }
    
    if (!electionId) {
      navigate('/elections');
      return;
    }
    
    loadElectionData();
  }, [currentUser, electionId, navigate]);

  const loadElectionData = async () => {
    setLoading(true);
    try {
      const elections = await getElections();
      const currentElection = elections.find(e => e.id === electionId);
      
      if (!currentElection) {
        toast.error('Election not found');
        navigate('/elections');
        return;
      }
      
      setElection(currentElection);
      
      const candidatesData = await getCandidates(electionId!);
      setCandidates(candidatesData);
    } catch (error) {
      toast.error('Failed to load election data');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSelect = (position: string, candidateId: string) => {
    setSelectedVotes({
      ...selectedVotes,
      [position]: candidateId,
    });
  };

  const handleSubmitVote = () => {
    const positions = [...new Set(candidates.map(c => c.position))];
    
    if (positions.length !== Object.keys(selectedVotes).length) {
      toast.error('Please select a candidate for each position');
      return;
    }
    
    setShowConfirmDialog(true);
  };

  const handleConfirmVote = async () => {
    setSubmitting(true);
    
    try {
      const votes = Object.entries(selectedVotes).map(([position, candidateId]) => ({
        position,
        candidateId,
      }));
      
      const result = await castVote(electionId!, votes);
      
      if (result.success) {
        setTransactionHash(result.transactionHash || '');
        setVoteSuccess(true);
        setShowConfirmDialog(false);
        
        setTimeout(() => {
          navigate('/elections');
        }, 5000);
      } else {
        toast.error(result.message || 'Failed to cast vote');
        setShowConfirmDialog(false);
      }
    } catch (error) {
      toast.error('Failed to submit vote. Please try again.');
      setShowConfirmDialog(false);
    } finally {
      setSubmitting(false);
    }
  };

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.position]) {
      acc[candidate.position] = [];
    }
    acc[candidate.position].push(candidate);
    return acc;
  }, {} as Record<string, Candidate[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election...</p>
        </div>
      </div>
    );
  }

  if (voteSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vote Cast Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for participating in the election.
            </p>
            
            {transactionHash && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Transaction Hash (Blockchain Verification):</p>
                <code className="text-xs text-blue-600 break-all">{transactionHash}</code>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-4">
              Your vote has been securely recorded and verified.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to elections page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">{election?.title}</h1>
          <p className="text-gray-600 mt-2">{election?.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Important Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Select one candidate for each position</li>
              <li>Review your selections carefully before submitting</li>
              <li>Once submitted, your vote cannot be changed</li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedCandidates).map(([position, positionCandidates]) => (
            <Card key={position}>
              <CardHeader>
                <CardTitle>{position}</CardTitle>
                <CardDescription>Select one candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedVotes[position] || ''}
                  onValueChange={(value) => handleVoteSelect(position, value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {positionCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedVotes[position] === candidate.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleVoteSelect(position, candidate.id)}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={candidate.id} id={candidate.id} className="mt-1" />
                          <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                            <div className="flex items-start gap-3">
                              {candidate.imageUrl && (
                                <img
                                  src={candidate.imageUrl}
                                  alt={candidate.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{candidate.name}</p>
                                <p className="text-sm text-gray-600">{candidate.department}</p>
                                <p className="text-sm text-gray-500">{candidate.year}</p>
                                {candidate.manifesto && (
                                  <p className="text-sm text-gray-600 mt-2">{candidate.manifesto}</p>
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmitVote}
            size="lg"
            disabled={Object.keys(selectedVotes).length !== Object.keys(groupedCandidates).length}
          >
            <Vote className="mr-2 h-5 w-5" />
            Submit Vote
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              Please review your selections carefully. Once submitted, your vote cannot be changed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {Object.entries(selectedVotes).map(([position, candidateId]) => {
              const candidate = candidates.find(c => c.id === candidateId);
              return (
                <div key={position} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{position}</p>
                    <p className="text-sm text-gray-600">{candidate?.name}</p>
                  </div>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              );
            })}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmVote}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Confirm & Submit Vote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
