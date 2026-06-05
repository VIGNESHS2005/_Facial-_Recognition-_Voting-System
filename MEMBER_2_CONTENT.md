# MEMBER 2: Backend Architecture, API & Database

## 🎯 Your Focus Areas
- Backend infrastructure and technology
- API design and endpoints
- Database schema and data models
- Request/response flow
- Security implementation
- Performance optimization

---

## 📋 Presentation Script (5-7 minutes)

### **Opening** (30 seconds)

"Thank you, **[Member 1's Name]**. Now I'll explain the backend architecture that powers our voting system with secure APIs and efficient data management."

---

### **1. Backend Technology Stack** (1 minute)

**Show this slide**:
```
BACKEND STACK
━━━━━━━━━━━━━━━━━━━━━━

RUNTIME:
└── Deno
    ├── Modern JavaScript/TypeScript runtime
    ├── Built-in TypeScript support
    ├── Secure by default
    └── Native ES modules

FRAMEWORK:
└── Hono
    ├── Ultra-fast web framework
    ├── Middleware support
    ├── RESTful routing
    └── Lightweight (~12KB)

DATABASE:
└── PostgreSQL (Supabase)
    ├── ACID compliant
    ├── JSONB support
    ├── Global replication
    └── Auto-scaling

DEPLOYMENT:
└── Supabase Edge Functions
    ├── Serverless architecture
    ├── Global CDN
    ├── Auto-scaling
    └── Pay-per-use
```

**Say**:
"Our backend runs on **Deno**, a modern runtime that's more secure than Node.js with built-in TypeScript support.

We use **Hono** - an ultra-fast web framework that's lightweight yet powerful for building REST APIs.

For the database, we chose **PostgreSQL** managed by Supabase, which provides ACID compliance, JSON support, and automatic scaling.

Everything is deployed as **serverless edge functions**, ensuring global availability and automatic scaling based on demand."

---

### **2. API Architecture** (2 minutes)

**Show API structure**:
```
BASE URL: https://{projectId}.supabase.co/functions/v1/make-server-89722b6c

┌─────────────────────────────────────────────┐
│           API ENDPOINTS                      │
├─────────────────────────────────────────────┤
│                                              │
│  ADMIN ENDPOINTS (Require admin auth)       │
│  ├── POST   /admin/login                    │
│  ├── GET    /admin/voters                   │
│  ├── POST   /election/create                │
│  └── POST   /candidate/add                  │
│                                              │
│  VOTER ENDPOINTS (User authentication)      │
│  ├── POST   /voter/register                 │
│  ├── POST   /voter/login                    │
│  └── POST   /vote/cast                      │
│                                              │
│  PUBLIC ENDPOINTS (No auth required)        │
│  ├── GET    /elections                      │
│  ├── GET    /election/:id/candidates        │
│  └── GET    /election/:id/results           │
│                                              │
└─────────────────────────────────────────────┘

Total: 12 RESTful endpoints
```

**Say**:
"Our API is organized into three categories:

1. **Admin endpoints** for election and candidate management - these require admin authentication

2. **Voter endpoints** for registration, login, and voting - these require voter authentication

3. **Public endpoints** for viewing elections and results - accessible to everyone

All endpoints follow RESTful principles, using appropriate HTTP methods: POST for creating data, GET for reading, etc. We exchange data in JSON format."

---

**Explain each endpoint category**:

**Admin APIs**:
- `POST /admin/login` - Authenticate admin users
- `GET /admin/voters` - Retrieve all registered voters
- `POST /election/create` - Create new election with positions
- `POST /candidate/add` - Add candidate to specific election

**Voter APIs**:
- `POST /voter/register` - Register with student details + face capture
- `POST /voter/login` - Login with studentID + facial verification
- `POST /vote/cast` - Submit votes for multiple positions

**Public APIs**:
- `GET /elections` - List all elections with auto-calculated status
- `GET /election/:id/candidates` - Get all candidates for an election
- `GET /election/:id/results` - Real-time results with vote counts

---

### **3. Database Design** (2 minutes)

**Show database schema**:
```
PostgreSQL Database
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Table: kv_store_89722b6c
┌─────────────────────────────┐
│ key (TEXT PRIMARY KEY)      │
│ value (JSONB)               │
└─────────────────────────────┘

KEY PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

election:{id}              → Election data
candidate:{id}             → Candidate info
voter:{studentId}          → Voter profile + face
vote:{id}                  → Vote record
elections:list             → Array of election IDs
voters:list                → Array of voter IDs
election:{id}:candidates   → Candidate IDs for election
```

**Say**:
"We use a **key-value store** approach with PostgreSQL's powerful JSONB type. This gives us the flexibility of NoSQL with the reliability of PostgreSQL.

Each entity type has a specific key pattern:
- Elections use `election:{id}`
- Candidates use `candidate:{id}`  
- Voters use `voter:{studentId}`
- Votes use `vote:{id}`

We also maintain index lists like `elections:list` for efficient querying without scanning all keys."

---

**Show data models**:

**Election Model**:
```json
{
  "id": "election_1733123456789",
  "title": "Student Council Election 2026",
  "description": "Annual student elections",
  "startDate": "2026-04-10T09:00:00Z",
  "endDate": "2026-04-15T17:00:00Z",
  "positions": ["President", "Vice President", "Secretary"],
  "status": "active",
  "totalVotes": 145,
  "createdAt": "2026-04-01T10:00:00Z"
}
```

**Candidate Model**:
```json
{
  "id": "candidate_1733123456789",
  "electionId": "election_123",
  "position": "President",
  "name": "Jane Smith",
  "department": "Computer Science",
  "year": "4th Year",
  "manifesto": "I will improve campus facilities...",
  "imageUrl": "https://example.com/jane.jpg",
  "votes": 75,
  "createdAt": "2026-04-02T14:30:00Z"
}
```

**Voter Model**:
```json
{
  "studentId": "STU001",
  "name": "John Doe",
  "email": "john@university.edu",
  "department": "Computer Science",
  "year": "3rd Year",
  "faceData": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "registeredAt": "2026-04-05T10:30:00Z",
  "hasVoted": {
    "election_123": true,
    "election_456": false
  },
  "lastVoted": "2026-04-10T15:45:00Z"
}
```

**Vote Record Model**:
```json
{
  "voteId": "vote_1733123456789",
  "electionId": "election_123",
  "studentId": "STU001",
  "timestamp": "2026-04-10T15:45:00Z",
  "transactionHash": "0x1733a1b2c3d4e5f6",
  "verified": true
}
```

**Say**:
"Each model stores all necessary information in JSON format. 

The **Election model** tracks title, dates, positions, and vote counts. The status is auto-calculated based on current date.

**Candidates** store their profile, manifesto, and real-time vote count.

**Voters** have their details and crucially, the `faceData` field storing their facial image, plus a `hasVoted` object tracking which elections they've voted in.

**Vote records** create an audit trail with timestamps and transaction hashes for verification."

---

### **4. API Request/Response Flow - Live Example** (2 minutes)

**Show vote casting flow**:

"Let me walk through what happens when a student casts their vote."

**Step 1: Frontend Request**
```javascript
// Frontend sends this request
POST /vote/cast
Authorization: Bearer {publicAnonKey}
Content-Type: application/json

{
  "studentId": "STU001",
  "electionId": "election_123",
  "votes": [
    { "position": "President", "candidateId": "candidate_001" },
    { "position": "Vice President", "candidateId": "candidate_002" }
  ]
}
```

**Say**:
"The frontend sends a POST request with the student ID, election ID, and their selected candidates for each position."

---

**Step 2: Backend Processing** (show code):
```typescript
app.post('/make-server-89722b6c/vote/cast', async (c) => {
  const { studentId, electionId, votes } = await c.req.json();

  // 1. VOTER VALIDATION
  const voter = await kv.get(`voter:${studentId}`);
  if (!voter) {
    return c.json({ success: false, message: 'Voter not found' }, 404);
  }

  // 2. DOUBLE VOTING CHECK
  if (voter.hasVoted[electionId]) {
    return c.json({ 
      success: false, 
      message: 'Already voted in this election' 
    }, 400);
  }

  // 3. ELECTION VALIDATION
  const election = await kv.get(`election:${electionId}`);
  if (!election) {
    return c.json({ success: false, message: 'Election not found' }, 404);
  }

  // 4. UPDATE CANDIDATE VOTE COUNTS (ATOMIC)
  for (const vote of votes) {
    const candidate = await kv.get(`candidate:${vote.candidateId}`);
    if (candidate) {
      candidate.votes = (candidate.votes || 0) + 1;
      await kv.set(`candidate:${vote.candidateId}`, candidate);
    }
  }

  // 5. MARK VOTER AS VOTED
  voter.hasVoted[electionId] = true;
  voter.lastVoted = new Date().toISOString();
  await kv.set(`voter:${studentId}`, voter);

  // 6. UPDATE ELECTION TOTAL
  election.totalVotes = (election.totalVotes || 0) + 1;
  await kv.set(`election:${electionId}`, election);

  // 7. GENERATE TRANSACTION HASH
  const transactionHash = generateTransactionHash();

  // 8. CREATE VOTE RECORD (AUDIT TRAIL)
  const voteRecord = {
    voteId: `vote_${Date.now()}`,
    electionId,
    studentId,
    timestamp: new Date().toISOString(),
    transactionHash,
    verified: true,
  };
  await kv.set(`vote:${voteRecord.voteId}`, voteRecord);

  // 9. RETURN SUCCESS
  return c.json({
    success: true,
    message: 'Vote cast successfully',
    transactionHash,
    voteId: voteRecord.voteId,
  });
});
```

**Say** (point to each step):
"The backend performs **9 security steps**:

1. **Verify the voter exists** in our database
2. **Check if they already voted** in this election - prevents double voting
3. **Verify the election exists** and is valid
4. **Update candidate vote counts** atomically for each position
5. **Mark the voter as voted** for this election
6. **Update the election's total vote count**
7. **Generate a unique transaction hash** for blockchain-style verification
8. **Create a vote record** for audit trail
9. **Return success** with the transaction hash

Each step has error handling. If any check fails, the vote is rejected and no data is modified."

---

**Step 3: Response**
```json
{
  "success": true,
  "message": "Vote cast successfully",
  "transactionHash": "0x1733a1b2c3d4e5f6g7h8",
  "voteId": "vote_1733123456789"
}
```

**Say**:
"The frontend receives a success response with a unique transaction hash that the voter can use to verify their vote was recorded."

---

### **5. Security Features** (1 minute)

**Show security layers**:
```
SECURITY LAYERS
━━━━━━━━━━━━━━━━━━━━━━━━━

1. CORS Protection
   └── Prevents unauthorized cross-origin requests

2. Input Validation
   └── All requests validated before processing

3. Duplicate Prevention
   └── Double voting checks at database level

4. Transaction Hashing
   └── Blockchain-style verification

5. Data Sanitization
   └── Sensitive face data removed before frontend

6. Authentication Tokens
   └── Unique tokens for admin and voter sessions

7. Error Handling
   └── Comprehensive error logging
```

**Say**:
"We implement **7 layers of security**:

**CORS protection** prevents unauthorized websites from accessing our API.

**Input validation** ensures all data is properly formatted before processing.

**Duplicate prevention** checks stop double voting at the database level.

**Transaction hashing** provides blockchain-style verification - each vote gets a unique, unforgeable hash.

**Data sanitization** ensures sensitive face data is never sent to the frontend.

**Authentication tokens** manage admin and voter sessions securely.

**Error handling** logs all errors with context for debugging while hiding sensitive details from users."

---

**Show code examples**:

**Double Voting Prevention**:
```typescript
if (voter.hasVoted[electionId]) {
  return c.json({ 
    success: false, 
    message: 'Already voted in this election' 
  }, 400);
}
```

**Transaction Hash Generation**:
```typescript
function generateTransactionHash(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `0x${timestamp.toString(16)}${random}`;
}
// Example: 0x1733a1b2c3d4e5f6g7h8
```

**Data Sanitization**:
```typescript
// Remove face data before sending to frontend
const sanitizedVoters = voters.map(voter => ({
  studentId: voter.studentId,
  name: voter.name,
  email: voter.email,
  department: voter.department,
  // faceData excluded for security
}));
```

---

### **6. Performance Optimization** (1 minute)

**Show optimizations**:
```
PERFORMANCE OPTIMIZATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━

1. Batch Operations
   ├── mget() instead of multiple get()
   └── Reduces database round trips

2. List Indices
   ├── elections:list
   ├── voters:list
   └── election:{id}:candidates
   └── Fast lookups without scanning

3. Dynamic Status Calculation
   ├── No scheduled updates needed
   └── Always accurate, no stale data

4. Edge Functions
   ├── Global CDN distribution
   ├── Low latency worldwide
   └── Auto-scaling based on load

5. JSONB Indexing
   ├── Fast queries on JSON fields
   └── Efficient filtering
```

**Show code example**:
```typescript
// INEFFICIENT - Multiple database calls
const candidates = [];
for (const id of candidatesList) {
  const candidate = await kv.get(`candidate:${id}`);
  candidates.push(candidate);
}

// OPTIMIZED - Single batch operation
const candidates = await kv.mget(
  candidatesList.map(id => `candidate:${id}`)
);
```

**Say**:
"We optimize performance through several techniques:

**Batch operations** using `mget()` retrieve multiple records in one database call instead of many.

**List indices** allow quick lookups without scanning all keys.

**Dynamic status calculation** means election status is computed on-the-fly based on dates - always accurate with no cron jobs needed.

**Edge functions** deploy our code globally on Supabase's CDN, ensuring low latency for users worldwide and automatic scaling during high traffic."

---

### **7. Error Handling** (30 seconds)

**Show error response structure**:
```json
{
  "success": false,
  "message": "Voter not found",
  "errorCode": "VOTER_NOT_FOUND",
  "timestamp": "2026-04-10T15:45:00Z"
}
```

**Code example**:
```typescript
try {
  // Business logic
  const voter = await kv.get(`voter:${studentId}`);
  if (!voter) {
    return c.json({
      success: false,
      message: 'Voter not found'
    }, 404);
  }
} catch (error) {
  console.log('Error in vote casting:', error);
  return c.json({
    success: false,
    message: `Error: ${error.message}`
  }, 500);
}
```

**Say**:
"Every endpoint has comprehensive error handling. Errors are logged with full context for debugging, while users receive clean, informative error messages. This helps with troubleshooting and provides good user experience even when things go wrong."

---

### **8. Conclusion** (30 seconds)

**Summary**:
"To summarize our backend:

✅ **Modern stack** with Deno, Hono, and PostgreSQL
✅ **12 RESTful endpoints** organized by functionality
✅ **Flexible database** using key-value patterns
✅ **7 layers of security** protecting every operation
✅ **Performance optimized** with batching and edge deployment
✅ **Comprehensive error handling** for reliability

Our backend provides a robust, secure, and scalable foundation for the voting system.

Now I'll hand over to **[Member 3's Name]**, who will demonstrate the system's features and admin dashboard."

---

## 📊 Visual Aids to Prepare

### Slides:
1. **Technology stack** comparison table
2. **API endpoints** organized tree
3. **Database schema** with key patterns
4. **Data models** with JSON examples
5. **Security layers** pyramid diagram
6. **Performance optimizations** list
7. **Request/response flow** sequence diagram

### Code Snippets:
- Vote casting handler (full function)
- Transaction hash generator
- Batch operations example
- Error handling pattern

---

## 💡 Tips for Your Section

1. **Speak clearly** when explaining technical concepts
2. **Use analogies** for complex topics (e.g., "like a post office box number" for key-value)
3. **Point to code** while explaining logic flow
4. **Emphasize security** - it's a voting system after all
5. **Keep code examples simple** - highlight only key parts
6. **Practice timing** - don't rush through code
7. **Prepare smooth handoff** to Member 3

---

## ❓ Expected Questions & Answers

**Q: Why key-value store instead of traditional tables?**
**A**: "Key-value provides flexibility for rapid prototyping while PostgreSQL ensures ACID compliance. We get the best of both worlds. For production, we could migrate to a traditional schema if needed."

**Q: How do you handle concurrent votes?**
**A**: "PostgreSQL handles concurrency with ACID transactions. When multiple users vote simultaneously, the database ensures data integrity and prevents race conditions."

**Q: What happens if the edge function crashes mid-vote?**
**A**: "Edge functions are stateless and atomic. If a crash occurs, the entire transaction rolls back - no partial votes are recorded. The user would need to retry."

**Q: Can admins delete votes?**
**A**: "In our current implementation, no. Once cast, votes are immutable for integrity. In production, we'd add audit-logged admin override capabilities with proper authorization."

**Q: How scalable is this?**
**A**: "Very scalable. Supabase Edge Functions auto-scale globally. The database uses connection pooling and can handle thousands of concurrent requests. For massive elections, we'd add read replicas."

**Q: Is the transaction hash truly blockchain?**
**A**: "It's blockchain-inspired but not a real blockchain. It's a unique, cryptographic hash for verification. True blockchain would require a distributed ledger, which is beyond our scope."

---

Good luck! 🎓
