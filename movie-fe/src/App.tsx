import { Routes, Route, Outlet } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
// import Navbar from '@/components/layout/Navbar'; // Example Navbar
// import Footer from '@/components/layout/Footer'; // Example Footer
import './App.css';

// Placeholder for a general layout component
const AppLayout = () => (
  <div className="app-container">
    {/* <Navbar /> */}
    <main className="main-content">
      <Outlet /> {/* Nested routes will render here */}
    </main>
    {/* <Footer /> */}
  </div>
);

// Placeholder for a simple Home page component
const HomePage = () => (
  <div className="p-4">
    <h1 className="text-2xl">Welcome to the Movie App</h1>
    <p>This is the home page.</p>
    {/* Link to AuthPage for testing */}
    <a href="/auth" className="text-blue-500 hover:underline">Go to Auth Page</a>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} /> {/* Default page for / */}
        {/* Add other main application routes here */}
      </Route>
      <Route path="/auth" element={<AuthPage />} />
      {/* You could add a NotFoundPage component for a 404 route */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
