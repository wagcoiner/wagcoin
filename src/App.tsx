
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Tasks from "@/pages/Tasks";
import Referrals from "@/pages/Referrals";
import Leaderboard from "@/pages/Leaderboard";
import Coinomics from "@/pages/Coinomics";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import AdminUsers from "@/pages/AdminUsers";
import Airdrop from "@/pages/Airdrop";
import NotFound from "@/pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// App component wrapping routes with BrowserRouter first
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />
          <Route path="/referrals" element={
            <ProtectedRoute>
              <Referrals />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/coinomics" element={<Coinomics />} />
          <Route path="/airdrop" element={
            <ProtectedRoute>
              <Airdrop />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    <Toaster />
    <Sonner />
  </TooltipProvider>
);

export default App;
