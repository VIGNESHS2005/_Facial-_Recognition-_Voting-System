import React, { createContext, useContext, useState, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-89722b6c`;

export interface Candidate {
  id: string;
  name: string;
  department: string;
  year: string;
  position: string;
  manifesto: string;
  imageUrl: string;
  votes?: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  positions?: string[];
  totalVotes?: number;
}

export interface Voter {
  studentId: string;
  name: string;
  email: string;
  department: string;
  year: string;
  hasVoted?: Record<string, boolean>;
}

interface VotingContextType {
  currentUser: Voter | null;
  isAdmin: boolean;
  authToken: string | null;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  voterLogin: (studentId: string, faceData: string) => Promise<{ success: boolean; message: string }>;
  registerVoter: (data: Omit<Voter, 'hasVoted'> & { faceData: string }) => Promise<{ success: boolean; message: string }>;
  generateOTP: (email: string) => string;
  verifyOTP: (email: string, otp: string) => boolean;
  logout: () => void;
  createElection: (data: Omit<Election, 'id' | 'status' | 'totalVotes'>) => Promise<{ success: boolean; election?: Election; message: string }>;
  addCandidate: (data: Omit<Candidate, 'id' | 'votes'> & { electionId: string }) => Promise<{ success: boolean; message: string }>;
  activateElection: (electionId: string) => Promise<{ success: boolean; message: string }>;
  getElections: () => Promise<Election[]>;
  getCandidates: (electionId: string) => Promise<Candidate[]>;
  castVote: (electionId: string, votes: { candidateId: string; position: string }[]) => Promise<{ success: boolean; transactionHash?: string; message: string }>;
  getResults: (electionId: string) => Promise<any>;
  getVoters: () => Promise<Voter[]>;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export function VotingProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Voter | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [otpStore, setOtpStore] = useState<{ [key: string]: { otp: string; timestamp: number } }>({});

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      // Temporary local authentication (until Supabase backend is set up)
      // Default credentials: admin / admin123
      if (username === 'admin' && password === 'admin123') {
        setIsAdmin(true);
        setAuthToken('local-admin-token');
        console.log('Admin logged in locally (temporary)');
        return true;
      }

      // Try backend authentication
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAdmin(true);
        setAuthToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Fallback to local auth if backend is unavailable
      if (username === 'admin' && password === 'admin123') {
        setIsAdmin(true);
        setAuthToken('local-admin-token');
        console.log('Admin logged in locally (backend unavailable)');
        return true;
      }
      
      return false;
    }
  };

  const voterLogin = async (studentId: string, faceData: string) => {
    try {
      const response = await fetch(`${API_URL}/voter/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ studentId, faceData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentUser(data.voter);
        setAuthToken(data.token);
        setIsAdmin(false);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Voter login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const registerVoter = async (data: Omit<Voter, 'hasVoted'> & { faceData: string }) => {
    try {
      console.log('Sending registration request to:', `${API_URL}/voter/register`);
      
      const response = await fetch(`${API_URL}/voter/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });
      
      console.log('Registration response status:', response.status);
      
      const result = await response.json();
      console.log('Registration response data:', result);
      
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Voter registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const generateOTP = (email: string) => {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store the OTP in a temporary object (in a real application, store it securely)
    setOtpStore(prev => ({
      ...prev,
      [email]: { otp, timestamp: Date.now() },
    }));
    return otp;
  };

  const verifyOTP = (email: string, otp: string) => {
    // Retrieve the stored OTP (in a real application, retrieve it securely)
    const storedOTP = otpStore[email];
    if (!storedOTP) return false;
    // Check if the OTP is still valid (e.g., within 5 minutes)
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    if (now - storedOTP.timestamp > fiveMinutes) return false;
    return storedOTP.otp === otp;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setAuthToken(null);
  };

  const createElection = async (data: Omit<Election, 'id' | 'status' | 'totalVotes'>) => {
    try {
      const response = await fetch(`${API_URL}/election/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return { success: result.success, election: result.election, message: result.message };
    } catch (error) {
      console.error('Create election error:', error);
      return { success: false, message: 'Failed to create election.' };
    }
  };

  const addCandidate = async (data: Omit<Candidate, 'id' | 'votes'> & { electionId: string }) => {
    try {
      const response = await fetch(`${API_URL}/candidate/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Add candidate error:', error);
      return { success: false, message: 'Failed to add candidate.' };
    }
  };

  const activateElection = async (electionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/election/${electionId}/activate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to activate election.' };
    }
  };

  const getElections = async (): Promise<Election[]> => {
    try {
      const response = await fetch(`${API_URL}/elections`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      const data = await response.json();
      return data.success ? data.elections : [];
    } catch (error) {
      console.error('Get elections error:', error);
      return [];
    }
  };

  const getCandidates = async (electionId: string): Promise<Candidate[]> => {
    try {
      const response = await fetch(`${API_URL}/election/${electionId}/candidates`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      const data = await response.json();
      return data.success ? data.candidates : [];
    } catch (error) {
      console.error('Get candidates error:', error);
      return [];
    }
  };

  const castVote = async (electionId: string, votes: { candidateId: string; position: string }[]) => {
    if (!currentUser) {
      return { success: false, message: 'Please login first.' };
    }

    try {
      const response = await fetch(`${API_URL}/vote/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          studentId: currentUser.studentId,
          electionId,
          votes,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local user state
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            hasVoted: { ...currentUser.hasVoted, [electionId]: true },
          });
        }
      }
      
      return { 
        success: data.success, 
        transactionHash: data.transactionHash,
        message: data.message 
      };
    } catch (error) {
      console.error('Cast vote error:', error);
      return { success: false, message: 'Failed to cast vote. Please try again.' };
    }
  };

  const getResults = async (electionId: string) => {
    try {
      const response = await fetch(`${API_URL}/election/${electionId}/results`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get results error:', error);
      return null;
    }
  };

  const getVoters = async (): Promise<Voter[]> => {
    try {
      const response = await fetch(`${API_URL}/admin/voters`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      const data = await response.json();
      return data.success ? data.voters : [];
    } catch (error) {
      console.error('Get voters error:', error);
      return [];
    }
  };

  return (
    <VotingContext.Provider value={{
      currentUser,
      isAdmin,
      authToken,
      adminLogin,
      voterLogin,
      registerVoter,
      generateOTP,
      verifyOTP,
      logout,
      createElection,
      activateElection,
      addCandidate,
      getElections,
      getCandidates,
      castVote,
      getResults,
      getVoters,
    }}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}