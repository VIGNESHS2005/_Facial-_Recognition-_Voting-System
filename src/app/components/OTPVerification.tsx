import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { toast } from 'sonner';
import { Mail, RefreshCw, Check, Shield } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface OTPVerificationProps {
  email: string;
  generatedOTP: string;
  onVerified: () => void;
  onResend: () => void;
  isLoading?: boolean;
}

export function OTPVerification({ 
  email, 
  generatedOTP, 
  onVerified, 
  onResend,
  isLoading 
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    if (attempts >= maxAttempts) {
      toast.error('Maximum verification attempts reached. Please request a new OTP.');
      return;
    }

    if (otp === generatedOTP) {
      toast.success('Email verified successfully!');
      onVerified();
    } else {
      setAttempts(prev => prev + 1);
      setOtp('');
      toast.error(`Invalid OTP. ${maxAttempts - attempts - 1} attempts remaining.`);
    }
  };

  const handleResend = () => {
    setOtp('');
    setTimeLeft(300);
    setAttempts(0);
    onResend();
    toast.success('New OTP sent to your email!');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-gray-200 hover-lift">
      <CardHeader className="space-y-3 pb-6">
        <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-primary">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-base text-center">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-semibold text-gray-900">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Simulated Email Display - For Demo Purposes */}
        <Alert className="bg-blue-50 border-2 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-blue-900">📧 Simulated Email (Demo Mode)</p>
              <div className="bg-white p-3 rounded-lg border border-blue-300">
                <p className="text-xs text-gray-600 mb-2">Your verification code is:</p>
                <p className="text-2xl font-bold text-center text-teal-600 tracking-widest">
                  {generatedOTP}
                </p>
              </div>
              <p className="text-xs text-gray-500 italic">
                In production, this would be sent to your email
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block text-center">
              Enter 6-Digit Code
            </label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isLoading || timeLeft <= 0 || attempts >= maxAttempts}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${timeLeft > 60 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              <span className="font-medium text-gray-700">
                {timeLeft > 0 ? formatTime(timeLeft) : 'Expired'}
              </span>
            </div>
            <div className="text-gray-600">
              Attempts: {attempts}/{maxAttempts}
            </div>
          </div>

          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading || timeLeft <= 0 || attempts >= maxAttempts}
            className="w-full gradient-success shadow-success hover:shadow-glow text-white border-0"
            size="lg"
          >
            <Check className="mr-2 h-5 w-5" />
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>

          {(timeLeft <= 0 || attempts >= maxAttempts) && (
            <Button
              onClick={handleResend}
              variant="outline"
              className="w-full border-2"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend OTP
            </Button>
          )}

          {timeLeft > 0 && attempts < maxAttempts && (
            <button
              onClick={handleResend}
              className="w-full text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Didn't receive the code? Resend
            </button>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Security Tips:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Never share your OTP with anyone</li>
              <li>• The code expires in 5 minutes</li>
              <li>• Check your spam folder if you don't see the email</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
