import { RouterProvider } from 'react-router';
import { router } from './routes';
import { VotingProvider } from './context/VotingContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider>
      <VotingProvider>
        <RouterProvider router={router} />
        <Toaster />
      </VotingProvider>
    </ThemeProvider>
  );
}