import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useVoting } from '../context/VotingContext';
import { FaceRecognition } from '../components/FaceRecognition';
import { OTPVerification } from '../components/OTPVerification';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { UserPlus, ArrowRight, Check } from 'lucide-react';

export default function RegisterVoter() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    department: '',
    year: '',
  });
  const [faceData, setFaceData] = useState<string | null>(null);
  const [generatedOTP, setGeneratedOTP] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { registerVoter, generateOTP } = useVoting();
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Economics',
    'Psychology',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'English Literature',
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.name || !formData.email || !formData.department || !formData.year) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Generate OTP and move to OTP verification step
    const otp = generateOTP(formData.email);
    setGeneratedOTP(otp);
    toast.success('OTP sent to your email!');
    setStep(2);
  };

  const handleOTPVerified = () => {
    toast.success('Email verified successfully!');
    setStep(3); // Move to face registration
  };

  const handleResendOTP = () => {
    const otp = generateOTP(formData.email);
    setGeneratedOTP(otp);
  };

  const handleFaceCapture = async (capturedFaceData: string) => {
    setFaceData(capturedFaceData);
    setIsLoading(true);
    
    try {
      console.log('Starting voter registration with data:', { ...formData, faceData: 'present' });
      
      const result = await registerVoter({
        ...formData,
        faceData: capturedFaceData,
      });
      
      console.log('Registration result:', result);
      
      if (result.success) {
        toast.success('Registration successful! You can now login.');
        setStep(4);
        setTimeout(() => {
          navigate('/voter-login');
        }, 3000);
      } else {
        console.error('Registration failed:', result.message);
        toast.error(result.message || 'Registration failed. Please try again.');
        setFaceData(null);
      }
    } catch (error) {
      console.error('Registration error caught:', error);
      toast.error('Registration failed. Please try again.');
      setFaceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-orange-500/5"></div>
      
      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-success rounded-3xl shadow-success mb-6 hover-lift">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Voter Registration</h1>
          <p className="text-lg text-gray-600">Register to participate in student council elections</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg transition-all ${step >= 1 ? 'gradient-primary text-white shadow-primary' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check className="h-6 w-6" /> : '1'}
            </div>
            <div className={`w-16 md:w-24 h-1.5 rounded-full transition-all ${step >= 2 ? 'gradient-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg transition-all ${step >= 2 ? 'gradient-primary text-white shadow-primary' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check className="h-6 w-6" /> : '2'}
            </div>
            <div className={`w-16 md:w-24 h-1.5 rounded-full transition-all ${step >= 3 ? 'gradient-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg transition-all ${step >= 3 ? 'gradient-primary text-white shadow-primary' : 'bg-gray-200 text-gray-500'}`}>
              {step > 3 ? <Check className="h-6 w-6" /> : '3'}
            </div>
            <div className={`w-16 md:w-24 h-1.5 rounded-full transition-all ${step >= 4 ? 'gradient-success' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg transition-all ${step >= 4 ? 'gradient-success text-white shadow-success' : 'bg-gray-200 text-gray-500'}`}>
              {step >= 4 ? <Check className="h-6 w-6" /> : '4'}
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className="max-w-2xl mx-auto shadow-2xl border-2 border-gray-200 hover-lift">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                Student Information
              </CardTitle>
              <CardDescription className="text-base">
                Please provide your details to register as a voter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-base">Student ID *</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="STU2024001"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      required
                      className="h-12 border-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="h-12 border-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-base">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@college.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="h-12 border-2 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-base">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                      required
                    >
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-base">Year of Study *</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => handleInputChange('year', value)}
                      required
                    >
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 gradient-primary shadow-primary hover:shadow-glow text-white border-0 text-base">
                  Continue to OTP Verification
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <OTPVerification
              email={formData.email}
              generatedOTP={generatedOTP}
              onVerified={handleOTPVerified}
              onResend={handleResendOTP}
              isLoading={isLoading}
            />
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="shadow-lg border-2 hover:bg-gray-50 px-6 py-3"
              >
                ← Back to Form
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <FaceRecognition
              mode="register"
              onCapture={handleFaceCapture}
              isLoading={isLoading}
            />
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="shadow-lg border-2 hover:bg-gray-50 px-6 py-3"
              >
                Back to Form
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <Card className="max-w-md mx-auto shadow-2xl border-gradient-primary hover-lift">
            <div className="gradient-success p-8 rounded-t-2xl">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-center text-2xl font-bold text-white">Registration Complete!</h3>
            </div>
            <CardContent className="text-center p-8">
              <p className="text-base text-gray-700 mb-6 font-medium">
                Your voter account has been created successfully
              </p>
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700">
                  You can now log in using your Student ID and facial recognition
                </p>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Redirecting to login page...
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            disabled={step === 3}
            className="hover:bg-white/60 glass-card px-6 py-3"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}