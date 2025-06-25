import React from 'react';
import { useParams } from 'react-router-dom';

function JobDetails({ jobs }) {
  const { id } = useParams();
  const job = jobs.find((j) => j.id.toString() === id);

  if (!job) {
    return <div className="text-center py-20 text-xl">Job not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f1faee] flex justify-center items-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#511D43]">{job.title}</h2>
            <p className="text-gray-600 mt-1">{job.company}</p>
            <p className="text-sm text-[#a855f7]">{job.industry}</p>
          </div>
          {job.image && (
            <img
              src={job.image}
              alt={`${job.company} logo`}
              className="h-20 w-20 object-contain mt-4 sm:mt-0"
            />
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Status:</strong> {job.status}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#511D43] mb-2">Description</h3>
          <p className="text-gray-800">{job.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#511D43] mb-2">Requirements</h3>
          <ul className="list-disc list-inside text-gray-800">
            {Array.isArray(job.requirements) ? (
              job.requirements.map((req, index) => <li key={index}>{req}</li>)
            ) : (
              <li>{job.requirements}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
