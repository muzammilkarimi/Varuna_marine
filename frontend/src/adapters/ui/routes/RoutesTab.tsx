import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export const RoutesTab = () => {
  const [routes, setRoutes] = useState<any[]>([]);

  const fetchRoutes = async () => {
    const { data } = await api.get('/routes');
    setRoutes(data);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const setBaseline = async (id: string) => {
    await api.post(`/routes/${id}/baseline`);
    fetchRoutes();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vessel Routes</h2>
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Route ID</th>
            <th className="px-4 py-2 text-left">Vessel Type</th>
            <th className="px-4 py-2 text-left">GHG Intensity</th>
            <th className="px-4 py-2 text-left">Baseline?</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(r => (
            <tr key={r.id} className="border-b">
              <td className="px-4 py-2">{r.routeId}</td>
              <td className="px-4 py-2">{r.vesselType}</td>
              <td className="px-4 py-2">{r.ghgIntensity}</td>
              <td className="px-4 py-2">{r.isBaseline ? '✅ Active' : ''}</td>
              <td className="px-4 py-2">
                {!r.isBaseline && (
                  <button 
                    onClick={() => setBaseline(r.routeId)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Set Baseline
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
