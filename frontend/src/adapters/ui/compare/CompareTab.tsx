import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export const CompareTab = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const fetchComparison = async () => {
    try {
      const res = await api.get('/routes/comparison');
      setData(res.data);
      setError('');
    } catch(err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Baseline Comparison</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Route ID</th>
            <th className="px-4 py-2 text-left">GHG Intensity</th>
            <th className="px-4 py-2 text-left">Vessel Type</th>
            <th className="px-4 py-2 text-left">% Diff to Baseline</th>
            <th className="px-4 py-2 text-left">Compliant (&le; 89.3368)</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.id} className="border-b">
              <td className="px-4 py-2">{r.routeId}</td>
              <td className="px-4 py-2">{r.ghgIntensity}</td>
              <td className="px-4 py-2">{r.vesselType}</td>
              <td className="px-4 py-2 font-mono">
                {r.isBaseline ? 'BASELINE' : r.percentDiff.toFixed(2) + '%'}
              </td>
              <td className="px-4 py-2">
                {r.compliant ? <span className="text-green-600 font-bold">✅ Yes</span> : <span className="text-red-600 font-bold">❌ No</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
