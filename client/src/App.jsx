import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Quote from './pages/Quote';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManagePortfolio from './pages/admin/ManagePortfolio';
import ManageServices from './pages/admin/ManageServices';
import ManageQuotes from './pages/admin/ManageQuotes';
import ManageMessages from './pages/admin/ManageMessages';
import ManageTestimonials from './pages/admin/ManageTestimonials';

// Layout wrapping Navbar & Footer for public pages
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// Main App Router Setup
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Pages */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="quote" element={<Quote />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Login Portal Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Control Panels */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="portfolio" element={<ManagePortfolio />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="quotes" element={<ManageQuotes />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
          </Route>

          {/* Redirect undefined routes to Home */}
          <Route path="*" element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
