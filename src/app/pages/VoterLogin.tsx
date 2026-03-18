import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { FaceRecognition } from '../components/FaceRecognition';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { UserCheck, ArrowRight, Scan, Sparkles } from 'lucide-react';

export default function VoterLogin() {
  const [studentId, setStudentId] = useState('');
  const [faceData, setFaceData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  
  const { voterLogin } = useVoting();
  const navigate = useNavigate();

  const handleStudentIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      toast.error('Please enter your Student ID');
      return;
    }
    setShowFaceCapture(true);
  };

  const handleFaceCapture = async (capturedFaceData: string) => {
    setFaceData(capturedFaceData);
    setIsLoading(true);
    
    try {
      const result = await voterLogin(studentId, capturedFaceData);
      
      if (result.success) {
        toast.success('Login successful! Face verified.');
        navigate('/elections');
      } else {
        toast.error(result.message || 'Face verification failed. Please try again.');
        setShowFaceCapture(false);
        setFaceData(null);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setShowFaceCapture(false);
      setFaceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5"></div>
      
      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-3xl shadow-primary mb-6 hover-lift">
            <UserCheck className="h-10 w-10 text-white" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-lg mb-4">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-semibold text-gray-700">Facial Recognition Login</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Student Council Voting
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Secure biometric authentication for verified students
          </p>
        </div>

        {!showFaceCapture ? (
          <Card className="max-w-md mx-auto shadow-2xl border-2 border-gray-200 hover-lift">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <Scan className="h-5 w-5 text-white" />
                </div>
                Voter Login
              </CardTitle>
              <CardDescription className="text-base">
                Enter your Student ID to begin facial recognition verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStudentIdSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-base">Student ID</Label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="e.g., STU2024001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="h-12 border-2 focus:border-teal-500 focus:ring-teal-500 text-base"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base gradient-primary shadow-primary hover:shadow-glow text-white border-0"
                >
                  Continue to Face Verification
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-sm text-center text-gray-600">
                    Not registered?{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-teal-600 hover:text-teal-700 font-semibold"
                      onClick={() => navigate('/register')}
                    >
                      Register as a voter
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <FaceRecognition
              mode="verify"
              onCapture={handleFaceCapture}
              isLoading={isLoading}
            />
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFaceCapture(false);
                  setFaceData(null);
                }}
                disabled={isLoading}
                className="shadow-lg border-2 hover:bg-gray-50 px-6 py-3"
              >
                Back to Student ID
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-white/60 glass-card px-6 py-3"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
