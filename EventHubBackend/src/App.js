import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import AdminConsole from "./pages/AdminConsole";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import TicketSuccess from "./pages/TicketSuccess";
import About from "./pages/About";
import MyTickets from "./pages/MyTickets";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/ticket-success" element={<ProtectedRoute><TicketSuccess /></ProtectedRoute>} />

          <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-code" element={<VerifyCode />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminConsole />
                  </ProtectedRoute>
                } />
                
                <Route path="/organizer" element={
                  <ProtectedRoute allowedRoles={['Organizer']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/organizer/create-event" element={
                  <ProtectedRoute allowedRoles={['Organizer']}>
                    <CreateEvent />
                  </ProtectedRoute>
                } />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;