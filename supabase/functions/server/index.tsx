import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Generate a transaction hash for blockchain verification simulation
function generateTransactionHash(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `0x${timestamp.toString(16)}${random}`;
}

// Admin Login
app.post('/make-server-89722b6c/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    // Get admin credentials from KV store
    const adminData = await kv.get('admin:credentials');
    
    // Default admin if not set
    const defaultAdmin = { username: 'admin', password: 'admin123' };
    const admin = adminData || defaultAdmin;
    
    if (username === admin.username && password === admin.password) {
      const token = generateTransactionHash();
      return c.json({ success: true, token, message: 'Admin login successful' });
    }
    
    return c.json({ success: false, message: 'Invalid credentials' }, 401);
  } catch (error) {
    console.log('Error in admin login:', error);
    return c.json({ success: false, message: `Admin login error: ${error}` }, 500);
  }
});

// Register Voter with Face Data
app.post('/make-server-89722b6c/voter/register', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Voter registration request received:', { 
      studentId: body.studentId, 
      name: body.name, 
      email: body.email,
      department: body.department,
      year: body.year,
      hasFaceData: !!body.faceData 
    });
    
    const { studentId, name, email, department, year, faceData } = body;
    
    if (!studentId || !name || !email || !faceData) {
      console.log('Missing required fields:', { 
        hasStudentId: !!studentId, 
        hasName: !!name, 
        hasEmail: !!email, 
        hasFaceData: !!faceData 
      });
      return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    
    // Check if student already registered
    const existing = await kv.get(`voter:${studentId}`);
    if (existing) {
      console.log('Student already registered:', studentId);
      return c.json({ success: false, message: 'Student already registered' }, 400);
    }
    
    const voter = {
      studentId,
      name,
      email,
      department,
      year,
      faceData, // In production, this would be facial embedding/hash
      registeredAt: new Date().toISOString(),
      hasVoted: {},
    };
    
    await kv.set(`voter:${studentId}`, voter);
    console.log('Voter saved to KV store:', studentId);
    
    // Add to voters list
    const votersList = (await kv.get('voters:list')) || [];
    votersList.push(studentId);
    await kv.set('voters:list', votersList);
    console.log('Voter added to voters list. Total voters:', votersList.length);
    
    return c.json({ success: true, message: 'Voter registered successfully', voter: {
      studentId: voter.studentId,
      name: voter.name,
      email: voter.email,
      department: voter.department,
      year: voter.year,
    } });
  } catch (error) {
    console.log('Error registering voter:', error);
    return c.json({ success: false, message: `Voter registration error: ${error}` }, 500);
  }
});

// Voter Login with Facial Recognition
app.post('/make-server-89722b6c/voter/login', async (c) => {
  try {
    const { studentId, faceData } = await c.req.json();
    
    if (!studentId || !faceData) {
      return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    
    const voter = await kv.get(`voter:${studentId}`);
    
    if (!voter) {
      return c.json({ success: false, message: 'Voter not found. Please register first.' }, 404);
    }
    
    // Simulated face verification
    // In production, this would use ML models to compare facial embeddings
    const faceMatch = Math.random() > 0.1; // 90% success rate for demo
    
    if (!faceMatch) {
      return c.json({ success: false, message: 'Face verification failed. Please try again.' }, 401);
    }
    
    const token = generateTransactionHash();
    
    return c.json({ 
      success: true, 
      token, 
      voter: {
        studentId: voter.studentId,
        name: voter.name,
        email: voter.email,
        department: voter.department,
        year: voter.year,
      },
      message: 'Face verified successfully' 
    });
  } catch (error) {
    console.log('Error in voter login:', error);
    return c.json({ success: false, message: `Voter login error: ${error}` }, 500);
  }
});

// Create Election
app.post('/make-server-89722b6c/election/create', async (c) => {
  try {
    const { title, description, startDate, endDate, positions } = await c.req.json();
    
    const electionId = `election_${Date.now()}`;
    
    const election = {
      id: electionId,
      title,
      description,
      startDate,
      endDate,
      positions: positions || [],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      totalVotes: 0,
    };
    
    await kv.set(`election:${electionId}`, election);
    
    // Add to elections list
    const electionsList = (await kv.get('elections:list')) || [];
    electionsList.push(electionId);
    await kv.set('elections:list', electionsList);
    
    return c.json({ success: true, election, message: 'Election created successfully' });
  } catch (error) {
    console.log('Error creating election:', error);
    return c.json({ success: false, message: `Election creation error: ${error}` }, 500);
  }
});

// Add Candidate to Election
app.post('/make-server-89722b6c/candidate/add', async (c) => {
  try {
    const { electionId, position, name, department, year, manifesto, imageUrl } = await c.req.json();
    
    const election = await kv.get(`election:${electionId}`);
    
    if (!election) {
      return c.json({ success: false, message: 'Election not found' }, 404);
    }
    
    const candidateId = `candidate_${Date.now()}`;
    
    const candidate = {
      id: candidateId,
      electionId,
      position,
      name,
      department,
      year,
      manifesto,
      imageUrl,
      votes: 0,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`candidate:${candidateId}`, candidate);
    
    // Add to candidates list for this election
    const candidatesKey = `election:${electionId}:candidates`;
    const candidatesList = (await kv.get(candidatesKey)) || [];
    candidatesList.push(candidateId);
    await kv.set(candidatesKey, candidatesList);
    
    return c.json({ success: true, candidate, message: 'Candidate added successfully' });
  } catch (error) {
    console.log('Error adding candidate:', error);
    return c.json({ success: false, message: `Candidate addition error: ${error}` }, 500);
  }
});

// Get All Elections
app.get('/make-server-89722b6c/elections', async (c) => {
  try {
    const electionsList = (await kv.get('elections:list')) || [];
    const elections = await kv.mget(electionsList.map(id => `election:${id}`));
    
    // Update status based on dates
    const now = new Date();
    const updatedElections = elections.map(election => {
      if (!election) return null;
      
      const start = new Date(election.startDate);
      const end = new Date(election.endDate);
      
      if (now < start) {
        election.status = 'upcoming';
      } else if (now >= start && now <= end) {
        election.status = 'active';
      } else {
        election.status = 'completed';
      }
      
      return election;
    }).filter(e => e !== null);
    
    return c.json({ success: true, elections: updatedElections });
  } catch (error) {
    console.log('Error fetching elections:', error);
    return c.json({ success: false, message: `Elections fetch error: ${error}` }, 500);
  }
});

// Manually activate an election (admin override)
app.post('/make-server-89722b6c/election/:electionId/activate', async (c) => {
  try {
    const electionId = c.req.param('electionId');
    const election = await kv.get(`election:${electionId}`);
    if (!election) return c.json({ success: false, message: 'Election not found' }, 404);
    election.status = 'active';
    election.startDate = new Date().toISOString();
    if (new Date(election.endDate) <= new Date()) {
      election.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }
    await kv.set(`election:${electionId}`, election);
    return c.json({ success: true, message: 'Election activated' });
  } catch (error) {
    return c.json({ success: false, message: `Error: ${error}` }, 500);
  }
});

// Get Candidates for Election
app.get('/make-server-89722b6c/election/:electionId/candidates', async (c) => {
  try {
    const electionId = c.req.param('electionId');
    
    const candidatesKey = `election:${electionId}:candidates`;
    const candidatesList = (await kv.get(candidatesKey)) || [];
    const candidates = await kv.mget(candidatesList.map(id => `candidate:${id}`));
    
    return c.json({ success: true, candidates: candidates.filter(c => c !== null) });
  } catch (error) {
    console.log('Error fetching candidates:', error);
    return c.json({ success: false, message: `Candidates fetch error: ${error}` }, 500);
  }
});

// Cast Vote
app.post('/make-server-89722b6c/vote/cast', async (c) => {
  try {
    const { studentId, electionId, votes } = await c.req.json();
    
    // Get voter
    const voter = await kv.get(`voter:${studentId}`);
    if (!voter) {
      return c.json({ success: false, message: 'Voter not found' }, 404);
    }
    
    // Check if already voted
    if (voter.hasVoted[electionId]) {
      return c.json({ success: false, message: 'You have already voted in this election' }, 400);
    }
    
    // Get election
    const election = await kv.get(`election:${electionId}`);
    if (!election) {
      return c.json({ success: false, message: 'Election not found' }, 404);
    }
    
    // Update candidate vote counts
    for (const vote of votes) {
      const candidate = await kv.get(`candidate:${vote.candidateId}`);
      if (candidate) {
        candidate.votes = (candidate.votes || 0) + 1;
        await kv.set(`candidate:${vote.candidateId}`, candidate);
      }
    }
    
    // Mark voter as voted
    voter.hasVoted[electionId] = true;
    voter.lastVoted = new Date().toISOString();
    await kv.set(`voter:${studentId}`, voter);
    
    // Update election total votes
    election.totalVotes = (election.totalVotes || 0) + 1;
    await kv.set(`election:${electionId}`, election);
    
    // Generate transaction hash for blockchain verification
    const transactionHash = generateTransactionHash();
    
    // Store vote record
    const voteRecord = {
      voteId: `vote_${Date.now()}`,
      electionId,
      studentId,
      timestamp: new Date().toISOString(),
      transactionHash,
      verified: true,
    };
    
    await kv.set(`vote:${voteRecord.voteId}`, voteRecord);
    
    return c.json({ 
      success: true, 
      message: 'Vote cast successfully',
      transactionHash,
      voteId: voteRecord.voteId,
    });
  } catch (error) {
    console.log('Error casting vote:', error);
    return c.json({ success: false, message: `Vote casting error: ${error}` }, 500);
  }
});

// Get Election Results
app.get('/make-server-89722b6c/election/:electionId/results', async (c) => {
  try {
    const electionId = c.req.param('electionId');
    
    const election = await kv.get(`election:${electionId}`);
    if (!election) {
      return c.json({ success: false, message: 'Election not found' }, 404);
    }
    
    const candidatesKey = `election:${electionId}:candidates`;
    const candidatesList = (await kv.get(candidatesKey)) || [];
    const candidates = await kv.mget(candidatesList.map(id => `candidate:${id}`));
    
    // Group by position
    const resultsByPosition = {};
    candidates.filter(c => c !== null).forEach(candidate => {
      if (!resultsByPosition[candidate.position]) {
        resultsByPosition[candidate.position] = [];
      }
      resultsByPosition[candidate.position].push({
        id: candidate.id,
        name: candidate.name,
        department: candidate.department,
        year: candidate.year,
        votes: candidate.votes || 0,
        imageUrl: candidate.imageUrl,
      });
    });
    
    // Sort by votes
    Object.keys(resultsByPosition).forEach(position => {
      resultsByPosition[position].sort((a, b) => b.votes - a.votes);
    });
    
    return c.json({ 
      success: true, 
      election,
      results: resultsByPosition,
      totalVotes: election.totalVotes || 0,
    });
  } catch (error) {
    console.log('Error fetching results:', error);
    return c.json({ success: false, message: `Results fetch error: ${error}` }, 500);
  }
});

// Get All Voters (Admin)
app.get('/make-server-89722b6c/admin/voters', async (c) => {
  try {
    const votersList = (await kv.get('voters:list')) || [];
    const voters = await kv.mget(votersList.map(id => `voter:${id}`));
    
    // Remove sensitive face data
    const sanitizedVoters = voters.filter(v => v !== null).map(voter => ({
      studentId: voter.studentId,
      name: voter.name,
      email: voter.email,
      department: voter.department,
      year: voter.year,
      registeredAt: voter.registeredAt,
      hasVoted: voter.hasVoted,
    }));
    
    return c.json({ success: true, voters: sanitizedVoters });
  } catch (error) {
    console.log('Error fetching voters:', error);
    return c.json({ success: false, message: `Voters fetch error: ${error}` }, 500);
  }
});

// Delete a voter by studentId
app.delete('/make-server-89722b6c/admin/voter/:studentId', async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const voter = await kv.get(`voter:${studentId}`);
    if (!voter) return c.json({ success: false, message: 'Voter not found' }, 404);
    await kv.delete(`voter:${studentId}`);
    const votersList: string[] = (await kv.get('voters:list')) || [];
    await kv.set('voters:list', votersList.filter(id => id !== studentId));
    return c.json({ success: true, message: 'Voter deleted successfully' });
  } catch (error) {
    return c.json({ success: false, message: `Delete error: ${error}` }, 500);
  }
});

// Clear ALL data
app.post('/make-server-89722b6c/admin/clear-all', async (c) => {
  try {
    const votersList: string[] = (await kv.get('voters:list')) || [];
    for (const id of votersList) await kv.delete(`voter:${id}`);
    await kv.delete('voters:list');

    const electionsList: string[] = (await kv.get('elections:list')) || [];
    for (const id of electionsList) {
      const candidatesList: string[] = (await kv.get(`election:${id}:candidates`)) || [];
      for (const cid of candidatesList) await kv.delete(`candidate:${cid}`);
      await kv.delete(`election:${id}:candidates`);
      await kv.delete(`election:${id}`);
    }
    await kv.delete('elections:list');

    return c.json({ success: true, message: 'All data cleared' });
  } catch (error) {
    return c.json({ success: false, message: `Clear error: ${error}` }, 500);
  }
});

// Health check
app.get('/make-server-89722b6c/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);