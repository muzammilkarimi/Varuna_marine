import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

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
    <div className="p-4 flex flex-col gap-6">
      <div>
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
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{r.routeId}</td>
                <td className="px-4 py-2 font-mono">{r.ghgIntensity}</td>
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

      <div className="bg-white p-4 rounded shadow-sm border border-gray-200" style={{ height: 400 }}>
        <h3 className="text-xl font-bold mb-4">GHG Intensity Comparison Chart</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="routeId" />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={89.3368} stroke="red" strokeDasharray="3 3" label="Target (89.33)" />
            <Bar dataKey="ghgIntensity" fill="#3b82f6" name="GHG Intensity (gCO2e/MJ)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
