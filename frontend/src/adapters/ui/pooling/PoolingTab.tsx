import React, { useState } from 'react';

export const PoolingTab = () => {
  const [poolMembers, setPoolMembers] = useState('');
  const [year, setYear] = useState(2025);

  return (
    <div className="p-4 bg-white shadow-sm rounded border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Article 21 – Pooling</h2>
      <p className="mb-4 text-gray-600">
        Create a compliance pool. The total adjusted CB of the pool must be &ge; 0.
      </p>

      <div className="flex flex-col gap-4 max-w-md">
        <input 
          type="number" 
          placeholder="Year" 
          value={year} 
          onChange={e => setYear(Number(e.target.value))} 
          className="p-2 border rounded"
        />
        <textarea 
          placeholder="Enter comma separated Ship IDs (e.g. R001, R002)" 
          value={poolMembers} 
          onChange={e => setPoolMembers(e.target.value)} 
          className="p-2 border rounded h-24"
        />

        <button 
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 w-full"
          onClick={() => alert(`Creating pool for ${poolMembers} in ${year} (Endpoint pending)`)}>
          Create Pool
        </button>
      </div>
    </div>
  );
};
