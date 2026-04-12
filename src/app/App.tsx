import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './hooks/ThemeContext';
import { AuthProvider } from './hooks/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
