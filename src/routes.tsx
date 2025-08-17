
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import JoinClub from "./pages/JoinClub";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthPage from "./pages/auth/AuthPage";
import AuthCallback from "./pages/auth/Callback";
import NotFound from "./pages/NotFound";

// Import from the correct paths based on your current structure
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";

// Community pages
import Community from "./pages/community/Community";
import MemberDirectory from "./pages/community/MemberDirectory";
import ConnectionRequests from "./pages/community/ConnectionRequests";
import SuccessStories from "./pages/community/SuccessStories";
import SuccessStoryDetails from "./pages/community/SuccessStoryDetails";

// Chat
import Chat from "./pages/chat/Chat";

// Calendar
import MyCalendar from "./pages/events/MyCalendar";
import AdminCalendar from "./pages/admin/AdminCalendar";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageStartups from "./pages/admin/ManageStartups";
import ManageMentors from "./pages/admin/ManageMentors";
import ManageResources from "./pages/admin/ManageResources";
import ManageSuccessStories from "./pages/admin/ManageSuccessStories";
import SystemSettings from "./pages/admin/SystemSettings";

// Import the actual components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Placeholder components for routes that haven't been implemented yet
const Events = () => <div>Events Page (Placeholder)</div>;
const Resources = () => <div>Resources Page (Placeholder)</div>;
const Startups = () => <div>Startups Page (Placeholder)</div>;
const Mentors = () => <div>Mentors Page (Placeholder)</div>;
const Members = () => <div>Members Page (Placeholder)</div>;
const ContactUs = () => <div>Contact Us Page (Placeholder)</div>;
const TermsOfService = () => <div>Terms of Service Page (Placeholder)</div>;
const PrivacyPolicy = () => <div>Privacy Policy Page (Placeholder)</div>;
const Forum = () => <div>Forum Page (Placeholder)</div>;
const ForumCategory = () => <div>Forum Category Page (Placeholder)</div>;
const ForumTopic = () => <div>Forum Topic Page (Placeholder)</div>;
const MentorProfilePage = () => <div>Mentor Profile Page (Placeholder)</div>;
const StartupProfilePage = () => <div>Startup Profile Page (Placeholder)</div>;
const EventDetailsPage = () => <div>Event Details Page (Placeholder)</div>;
const ResourceDetailsPage = () => <div>Resource Details Page (Placeholder)</div>;
const SuccessStoryDetailsPage = () => <div>Success Story Details Page (Placeholder)</div>;
const Membership = () => <div>Membership Page (Placeholder)</div>;
const MembershipBenefits = () => <div>Membership Benefits Page (Placeholder)</div>;
const MembershipFAQ = () => <div>Membership FAQ Page (Placeholder)</div>;
const MembershipContact = () => <div>Membership Contact Page (Placeholder)</div>;
const MembershipTerms = () => <div>Membership Terms Page (Placeholder)</div>;
const MembershipPrivacy = () => <div>Membership Privacy Page (Placeholder)</div>;
const MembershipPricing = () => <div>Membership Pricing Page (Placeholder)</div>;
const PastEvents = () => <div>Past Events Page (Placeholder)</div>;
const Introduction = () => <div>Introduction Page (Placeholder)</div>;


// Import the login page
import AnimatedLogin from './pages/auth/AnimatedLogin';
import ImportantMembers from './pages/ImportantMembers';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/join" element={<JoinClub />} />
          <Route path="/login" element={<AnimatedLogin />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/membership/benefits" element={<MembershipBenefits />} />
          <Route path="/membership/faq" element={<MembershipFAQ />} />
          <Route path="/membership/contact" element={<MembershipContact />} />
          <Route path="/membership/terms" element={<MembershipTerms />} />
          <Route path="/membership/privacy" element={<MembershipPrivacy />} />
          <Route path="/membership/pricing" element={<MembershipPricing />} />
          <Route path="/calendar" element={<MyCalendar />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/important-members" element={<ImportantMembers />} />
          
          {/* Community Routes */}
          <Route path="/community" element={<Community />} />
          <Route path="/community/directory" element={<MemberDirectory />} />
          <Route path="/community/connection-requests" element={<ProtectedRoute><ConnectionRequests /></ProtectedRoute>} />
          <Route path="/community/success-stories" element={<SuccessStories />} />
          <Route path="/community/success-stories/:id" element={<SuccessStoryDetails />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
          <Route path="/mentors" element={<ProtectedRoute><Mentors /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/startups" element={<ProtectedRoute><Startups /></ProtectedRoute>} />
          <Route path="/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
          <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
          <Route path="/forum/category/:categoryId" element={<ProtectedRoute><ForumCategory /></ProtectedRoute>} />
          <Route path="/forum/topic/:topicId" element={<ProtectedRoute><ForumTopic /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:roomId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/my-calendar" element={<ProtectedRoute><MyCalendar /></ProtectedRoute>} />
          
          {/* Details Pages */}
          <Route path="/mentor/:id" element={<ProtectedRoute><MentorProfilePage /></ProtectedRoute>} />
          <Route path="/startup/:id" element={<ProtectedRoute><StartupProfilePage /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
          <Route path="/resource/:id" element={<ProtectedRoute><ResourceDetailsPage /></ProtectedRoute>} />
          <Route path="/success-story/:id" element={<ProtectedRoute><SuccessStoryDetailsPage /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><ManageEvents /></AdminRoute>} />
          <Route path="/admin/calendar" element={<AdminRoute><AdminCalendar /></AdminRoute>} />
          <Route path="/admin/startups" element={<AdminRoute><ManageStartups /></AdminRoute>} />
          <Route path="/admin/mentors" element={<AdminRoute><ManageMentors /></AdminRoute>} />
          <Route path="/admin/resources" element={<AdminRoute><ManageResources /></AdminRoute>} />
          <Route path="/admin/success-stories" element={<AdminRoute><ManageSuccessStories /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
          
          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
