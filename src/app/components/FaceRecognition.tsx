import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Camera, Check, RefreshCw, AlertCircle, Upload, Video, Image } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface FaceRecognitionProps {
  onCapture: (faceData: string) => void;
  mode: 'register' | 'verify';
  isLoading?: boolean;
}

export function FaceRecognition({ onCapture, mode, isLoading }: FaceRecognitionProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captureMethod, setCaptureMethod] = useState<'none' | 'camera' | 'upload'>('none');
  const [captured, setCaptured] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    console.log('FaceRecognition component mounted');
    return () => {
      console.log('FaceRecognition component unmounted');
    };
  }, []);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const handleUserMedia = useCallback((stream: MediaStream) => {
    console.log('Camera stream obtained successfully:', stream);
    setCameraReady(true);
    setCameraError(null);
    setShowPermissionHelp(false);
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    // Log error for debugging but note it's handled gracefully
    console.log('Camera access issue (this is handled gracefully):', error instanceof DOMException ? error.name : error);
    setCameraReady(false);
    
    if (typeof error === 'string') {
      setCameraError(error);
    } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      setCameraError('Camera access denied. You can upload a photo instead.');
      setShowPermissionHelp(true);
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      setCameraError('No camera found. Please upload a photo instead.');
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      setCameraError('Camera is in use by another app. Please upload a photo instead.');
    } else {
      setCameraError(`Camera unavailable. You can upload a photo instead.`);
    }
  }, []);

  const handleUseCameraClick = useCallback(() => {
    console.log('User chose to use camera');
    setCaptureMethod('camera');
    setCameraError(null);
    setShowPermissionHelp(false);
  }, []);

  const handleRetryCamera = useCallback(() => {
    console.log('Retrying camera access');
    setCameraError(null);
    setCameraReady(false);
    setShowPermissionHelp(false);
    setRetryKey(prev => prev + 1);
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageData(base64String);
        setCaptured(true);
        setCaptureMethod('upload');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    console.log('User chose to upload photo');
    fileInputRef.current?.click();
  }, []);

  const capture = useCallback(() => {
    console.log('Capture button clicked, webcamRef:', webcamRef.current);
    
    if (!webcamRef.current) {
      console.error('Webcam ref is null');
      setCameraError('Camera not initialized. Please try again.');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    console.log('Screenshot result:', imageSrc ? 'Success' : 'Failed');
    
    if (imageSrc) {
      setImageData(imageSrc);
      setCaptured(true);
    } else {
      setCameraError('Failed to capture image. Please try again.');
    }
  }, []);

  const confirmCapture = useCallback(() => {
    if (imageData) {
      console.log('Confirming capture and calling onCapture callback');
      onCapture(imageData);
    }
  }, [imageData, onCapture]);

  const retake = useCallback(() => {
    console.log('Retake/reset clicked');
    setCaptured(false);
    setImageData(null);
    setCameraError(null);
    setCameraReady(false);
    setCaptureMethod('none');
    setShowPermissionHelp(false);
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-2 border-gray-200 hover-lift">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
          {mode === 'register' ? 'Register Your Face' : 'Verify Your Identity'}
        </CardTitle>
        <CardDescription className="text-base">
          {mode === 'register' 
            ? 'Capture or upload a clear photo of your face for secure authentication'
            : 'Verify your identity with a photo for secure access'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPermissionHelp && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Permission Denied</AlertTitle>
            <AlertDescription className="space-y-3 mt-2">
              <p className="font-semibold">Your browser blocked camera access. To fix this:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Look at your browser's address bar</strong> (top of the screen)</li>
                <li>Find the camera icon 🎥 or lock icon 🔒</li>
                <li>Click it and change camera permission to <strong>"Allow"</strong></li>
                <li>Refresh this page or click "Try Again" below</li>
              </ol>
              <div className="bg-destructive/10 p-3 rounded text-xs space-y-2">
                <strong>Browser-specific help:</strong>
                <ul className="space-y-1">
                  <li><strong>Chrome/Edge:</strong> Click the 🎥 or 🔒 in the address bar → Camera → Allow</li>
                  <li><strong>Firefox:</strong> Click the 🛡️ or 🔒 in the address bar → Permissions → Camera → Allow</li>
                  <li><strong>Safari:</strong> Safari menu → Settings for This Website → Camera → Allow</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {cameraError && !showPermissionHelp && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}

        {/* Method Selection */}
        {captureMethod === 'none' && !captured && (
          <div className="space-y-3">
            <div className="relative aspect-video gradient-primary rounded-2xl overflow-hidden flex items-center justify-center shadow-primary">
              <div className="text-center space-y-2 p-6 text-white">
                <div className="flex justify-center gap-4 mb-4">
                  <Camera className="h-12 w-12" />
                  <Image className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold">Choose Capture Method</h3>
                <p className="text-sm opacity-90">
                  Use your camera or upload an existing photo
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={handleUseCameraClick}
                size="lg"
                className="w-full h-auto py-6 gradient-primary shadow-primary hover:shadow-glow text-white border-0"
                disabled={isLoading}
              >
                <div className="flex flex-col items-center gap-2">
                  <Camera className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">Use Camera</div>
                    <div className="text-xs opacity-90">Take a live photo</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                onClick={handleUploadClick}
                variant="outline"
                size="lg"
                className="w-full h-auto py-6 border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                disabled={isLoading}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">Upload Photo</div>
                    <div className="text-xs opacity-90">Choose from your device</div>
                  </div>
                </div>
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {/* Camera View */}
        {captureMethod === 'camera' && !captured && (
          <div className="space-y-3">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {!cameraReady && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
                  <div className="text-center space-y-2">
                    <Camera className="h-12 w-12 mx-auto animate-pulse" />
                    <p>Starting camera...</p>
                    <p className="text-xs text-gray-400">Please allow camera access when prompted</p>
                  </div>
                </div>
              )}
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
                  <div className="text-center space-y-2 p-4">
                    <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                    <p className="text-sm">Camera unavailable</p>
                    <p className="text-xs text-gray-400">Try uploading a photo instead</p>
                  </div>
                </div>
              )}
              <Webcam
                key={retryKey}
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                mirrored={true}
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
              />
              {cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-4 border-blue-500 rounded-full opacity-50"></div>
                </div>
              )}
            </div>

            {cameraReady && (
              <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded">
                ✓ Camera ready - Position your face in the circle
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={capture} 
                className="w-full"
                disabled={isLoading || !cameraReady || !!cameraError}
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                {cameraReady ? 'Capture Face' : 'Waiting for camera...'}
              </Button>
              
              {cameraError && (
                <>
                  <Button 
                    onClick={handleRetryCamera} 
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleUploadClick}
                    variant="secondary"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo Instead
                  </Button>
                </>
              )}
              
              <Button 
                onClick={retake}
                variant="ghost"
                className="w-full"
                disabled={isLoading}
              >
                ← Back to Options
              </Button>
            </div>

            {!cameraError && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold">Tips for best results:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure good lighting on your face</li>
                  <li>Remove glasses if possible</li>
                  <li>Look directly at the camera</li>
                  <li>Maintain a neutral expression</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Captured Image Preview */}
        {captured && imageData && (
          <div className="space-y-3">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <img src={imageData} alt="Captured face" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                {captureMethod === 'camera' ? 'Camera Capture' : 'Uploaded Photo'}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm text-green-800 font-medium">
                ✓ Photo looks good! Click confirm to continue
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={confirmCapture} 
                className="w-full gradient-success shadow-success hover:shadow-glow text-white border-0"
                disabled={isLoading}
                size="lg"
              >
                <Check className="mr-2 h-5 w-5" />
                Confirm & Continue
              </Button>
              
              <Button 
                onClick={retake} 
                variant="outline" 
                className="w-full border-2"
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}