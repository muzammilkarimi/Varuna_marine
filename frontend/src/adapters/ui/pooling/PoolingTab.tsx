import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

export const PoolingTab = () => {
  const [year, setYear] = useState(2025);
  const [shipsInput, setShipsInput] = useState('R001, R002');
  const [poolPreview, setPoolPreview] = useState<any[]>([]);

  const fetchAdjusted = async () => {
    try {
      const ships = shipsInput.split(',').map(s => s.trim());
      const res = await Promise.all(ships.map(s => api.get(`/compliance/adjusted-cb?year=${year}&shipId=${s}`)));
      setPoolPreview(res.map(r => r.data));
    } catch {
      setPoolPreview([]);
    }
  };

  useEffect(() => {
    if (shipsInput) fetchAdjusted();
  }, [shipsInput, year]);

  const totalPoolCb = poolPreview.reduce((acc, curr) => acc + (curr.adjustedCb || 0), 0);
  const isValidPool = totalPoolCb >= 0;

  const handleCreatePool = async () => {
    try {
      const ships = shipsInput.split(',').map(s => s.trim());
      await api.post('/pools', { year, shipIds: ships });
      alert('Pool created successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create pool');
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Article 21 – Pooling</h2>
      
      <div className="flex flex-col gap-4 max-w-md mb-6">
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(Number(e.target.value))} className="p-2 border rounded" />
        <textarea 
          placeholder="Enter comma separated Ship IDs (e.g. R001, R002)" 
          value={shipsInput} 
          onChange={e => setShipsInput(e.target.value)} 
          className="p-2 border rounded h-24"
        />
        
        <div className={`p-4 rounded border font-bold ${isValidPool ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
          Pool Sum Indicator: {totalPoolCb} gCO2eq
        </div>

        <button 
          disabled={!isValidPool || poolPreview.length === 0}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 w-full disabled:opacity-50"
          onClick={handleCreatePool}>
          Create Pool
        </button>
      </div>

      <h3 className="font-bold mb-2">Members Preview</h3>
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded">
        <thead><tr className="bg-gray-100 border-b"><th className="px-4 py-2 text-left">Ship ID</th><th className="px-4 py-2 text-left">Adjusted CB (Before)</th></tr></thead>
        <tbody>
          {poolPreview.map(p => (
            <tr key={p.shipId}>
              <td className="px-4 py-2">{p.shipId}</td>
              <td className="px-4 py-2 text-mono">{p.adjustedCb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
