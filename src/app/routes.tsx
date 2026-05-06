import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import VoterLogin from './pages/VoterLogin';
import AdminLogin from './pages/AdminLogin';
import ActiveElections from './pages/ActiveElections';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateElection from './pages/CreateElection';
import RegisterVoter from './pages/RegisterVoter';
import ManageVoters from './pages/ManageVoters';
import MonitorVotes from './pages/MonitorVotes';
import ViewAllData from './pages/ViewAllData';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/voter-login',
    Component: VoterLogin,
  },
  {
    path: '/register',
    Component: RegisterVoter,
  },
  {
    path: '/elections',
    Component: ActiveElections,
  },
  {
    path: '/vote/:electionId',
    Component: VotingPage,
  },
  {
    path: '/results/:electionId',
    Component: ResultsPage,
  },
  {
    path: '/admin-login',
    Component: AdminLogin,
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
  },
  {
    path: '/admin/create-election',
    Component: CreateElection,
  },
  {
    path: '/admin/voters',
    Component: ManageVoters,
  },
  {
    path: '/admin/monitor',
    Component: MonitorVotes,
  },
  {
    path: '/admin/data',
    Component: ViewAllData,
  },
]);