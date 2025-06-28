import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home/Home';
import Nav from './Home/Nav';
import Loginpage from './Home/Loginpage';
import Signup from './Home/Signup';
import JobSeekerPage from './Dashboard/JobSeekerPage';
import AdminPage from './Admin/AdminPage';
import JobDetails from './Admin/JobDetails';

// AppContent handles routing and conditional Nav rendering
function AppContent({ jobs, setJobs, setRole, userEmail, setUserEmail }) {
  const location = useLocation();

  // Hide Nav on these routes
  const hideNav = location.pathname === '/jobseeker' || location.pathname === '/admin';

  return (
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Home jobs={jobs} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Loginpage setRole={setRole} setUserEmail={setUserEmail} />} />
        <Route path="/admin" element={<AdminPage jobs={jobs} setJobs={setJobs} />} />
        <Route path="/jobseeker" element={<JobSeekerPage jobs={jobs} setJobs={setJobs} userEmail={userEmail} />} />
        <Route path="/job/:id" element={<JobDetails jobs={jobs} />} />
      </Routes>
    </>
  );
}

// Top-level App that wraps everything with BrowserRouter
function App() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      company: 'OpenAI',
      title: 'Frontend Developer',
      location: 'San Francisco',
      salary: '$120,000',
      status: 'open',
      industry: 'Technology',
      type: 'Full-time',
      image: 'https://logo.clearbit.com/openai.com',
      description: 'Develop and maintain frontend interfaces.',
      requirements: ['React', 'CSS', 'JavaScript'],
    },
    {
      id: 2,
      company: 'Google',
      title: 'Data Analyst',
      location: 'Remote',
      salary: '$110,000',
      status: 'open',
      industry: 'Technology',
      type: 'Remote',
      image: 'https://logo.clearbit.com/google.com',
      description: 'Analyze and visualize data for key insights.',
      requirements: ['SQL', 'Python', 'Data Visualization'],
    },
    {
      id: 3,
      company: 'Amazon',
      title: 'Warehouse Associate',
      location: 'Austin',
      salary: '$40,000',
      status: 'open',
      industry: 'Logistics',
      type: 'Part-time',
      image: 'https://logo.clearbit.com/amazon.com',
      description: 'Package and ship orders efficiently.',
      requirements: ['Physical stamina', 'Teamwork'],
    },
    {
      id: 4,
      company: 'Pfizer',
      title: 'Research Scientist',
      location: 'New Jersey',
      salary: '$135,000',
      status: 'open',
      industry: 'Pharmaceuticals',
      type: 'Full-time',
      image: 'https://logo.clearbit.com/pfizer.com',
      description: 'Lead research in vaccine development.',
      requirements: ['PhD in Biology', 'Lab experience'],
    },
    {
      id: 5,
      company: 'Spotify',
      title: 'UX Designer',
      location: 'Remote',
      salary: '$95,000',
      status: 'open',
      industry: 'Media',
      type: 'Remote',
      image: 'https://logo.clearbit.com/spotify.com',
      description: 'Design user interfaces for mobile and web.',
      requirements: ['Figma', 'UX/UI experience'],
    },
    {
      id: 6,
      company: 'Mayo Clinic',
      title: 'Nurse Practitioner',
      location: 'Rochester, MN',
      salary: '$100,000',
      status: 'open',
      industry: 'Healthcare',
      type: 'Full-time',
      image: 'https://logo.clearbit.com/mayoclinic.org',
      description: 'Provide patient care and diagnosis.',
      requirements: ['Nursing License', 'BLS Certification'],
    },
    {
      id: 7,
      company: 'Meta',
      title: 'AR Developer',
      location: 'Seattle',
      salary: '$145,000',
      status: 'open',
      industry: 'Technology',
      type: 'Full-time',
      image: 'https://logo.clearbit.com/meta.com',
      description: 'Create immersive AR experiences.',
      requirements: ['Unity/Unreal', 'C#', '3D modeling'],
    },
    {
      id: 8,
      company: 'Tesla',
      title: 'Mechanical Engineer',
      location: 'Fremont, CA',
      salary: '$130,000',
      status: 'open',
      industry: 'Automotive',
      type: 'Full-time',
      image: 'https://logo.clearbit.com/tesla.com',
      description: 'Design automotive components.',
      requirements: ['CAD', 'SolidWorks', 'Mechanical Engineering degree'],
    },
    {
      id: 9,
      company: 'Accenture',
      title: 'Business Consultant',
      location: 'Atlanta',
      salary: '$110,000',
      status: 'open',
      industry: 'Consulting',
      type: 'Contract',
      image: 'https://logo.clearbit.com/accenture.com',
      description: 'Advise clients on strategic business initiatives.',
      requirements: ['MBA preferred', 'Client engagement'],
    },
    {
      id: 10,
      company: 'Johnson & Johnson',
      title: 'Sales Representative',
      location: 'Dallas',
      salary: '$90,000',
      status: 'open',
      industry: 'Pharmaceuticals',
      type: 'Full-time',
      image: 'https://logo.clearbit.com/jnj.com',
      description: 'Promote pharma products to clinics.',
      requirements: ['Sales experience', 'Pharma knowledge'],
    },
    {
      id: 11,
      company: 'Zoom',
      title: 'Customer Support Agent',
      location: 'Remote',
      salary: '$55,000',
      status: 'open',
      industry: 'Technology',
      type: 'Remote',
      image: 'https://logo.clearbit.com/zoom.us',
      description: 'Assist users with technical issues.',
      requirements: ['Strong communication', 'Tech troubleshooting'],
    },
    {
      id: 12,
      company: 'Netflix',
      title: 'Content Curator',
      location: 'Los Angeles',
      salary: '$80,000',
      status: 'open',
      industry: 'Entertainment',
      type: 'Contract',
      image: 'https://logo.clearbit.com/netflix.com',
      description: 'Select and organize content for global platforms.',
      requirements: ['Content strategy', 'Media knowledge'],
    },
    {
      id: 13,
      company: 'Cleveland Clinic',
      title: 'Healthcare Admin Assistant',
      location: 'Cleveland',
      salary: '$50,000',
      status: 'open',
      industry: 'Healthcare',
      type: 'Part-time',
      image: 'https://logo.clearbit.com/clevelandclinic.org',
      description: 'Support administrative tasks in medical facility.',
      requirements: ['Clerical skills', 'Organized'],
    },
    {
      id: 14,
      company: 'IBM',
      title: 'AI Research Intern',
      location: 'Boston',
      salary: '$30/hr',
      status: 'open',
      industry: 'Technology',
      type: 'Part-time',
      image: 'https://logo.clearbit.com/ibm.com',
      description: 'Support ongoing AI experiments and data models.',
      requirements: ['Python, ML basics', 'Enrolled in CS degree'],
    },
    {
      id: 15,
      company: 'GE Healthcare',
      title: 'Biomedical Engineer',
      location: 'Chicago',
      salary: '$95,000',
      status: 'open',
      industry: 'Healthcare',
      type: 'Full-time',
      image: 'https://logo.clearbit.com/gehealthcare.com',
      description: 'Design and test diagnostic devices.',
      requirements: ['Engineering degree', 'Device testing experience'],
    },
    // ... Add rest of the jobs here ...
  ]);

  const [role, setRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  return (
    <BrowserRouter>
      <AppContent jobs={jobs} setJobs={setJobs} setRole={setRole} userEmail={userEmail} setUserEmail={setUserEmail} />
    </BrowserRouter>
  );
}

export default App;
