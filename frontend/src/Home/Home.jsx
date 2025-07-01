import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Send, UserCheck } from 'lucide-react';

function Home({ jobs }) {
  const navigate = useNavigate();

  return (
    <>
    <head>
      <title>Job Portal</title>
    </head>
    <div className="bg-[#f1faee] min-h-screen p-6 flex flex-col items-center">

      <div className="text-center max-w-4xl py-15">
        <h1 className="text-5xl md:text-7xl font-bold text-[#511D43] leading-tight">
          Find Your Dream Jobs
        </h1>
        <p className="mt-4 text-2xl text-gray-700">
          Connect with top employers and discover exciting career opportunities 
          that match your skills and aspirations.
        </p>
        <p className="mt-4 text-2xl text-gray-700">
          Discover exciting career opportunities that match your skills!
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <Button
            variant="contained"
            sx={{ backgroundColor: '#511D43', '&:hover': { backgroundColor: '#D3ECCD', color: 'black' } }}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            sx={{ borderColor: '#511D43', color: '#511D43', '&:hover': { borderColor: 'black', color: 'black' } }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-[#511D43] mb-6">Top Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            <div className="flex items-center mb-4">
              <img
                src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`}
                alt={job.company}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                className="w-12 h-12 rounded-full mr-4 object-contain bg-gray-100"
              />
              <h3 className="text-xl font-semibold text-[#511D43]">{job.title}</h3>
            </div>
            <p className="text-gray-700">Company: {job.company}</p>
            <p className="text-gray-700">Location: {job.location}</p>
            <p className="text-gray-700">Salary: {job.salary}</p>
            <p className="text-sm text-gray-500 mt-1">Status: {job.status}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Home;



