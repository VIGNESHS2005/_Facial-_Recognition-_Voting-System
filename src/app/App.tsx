import { RouterProvider } from 'react-router';
import { router } from './routes';
import { VotingProvider } from './context/VotingContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <VotingProvider>
      <RouterProvider router={router} />
      <Toaster />
    </VotingProvider>
  );
}