import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

export const RoutesTab = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [filterVessel, setFilterVessel] = useState('');
  const [filterFuel, setFilterFuel] = useState('');
  const [filterYear, setFilterYear] = useState('');

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

  const filteredRoutes = routes.filter(r => 
    (filterVessel ? r.vesselType.includes(filterVessel) : true) &&
    (filterFuel ? r.fuelType.includes(filterFuel) : true) &&
    (filterYear ? r.year.toString() === filterYear : true)
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Vessel Routes</h2>
      
      <div className="flex gap-4 mb-4">
        <input placeholder="Filter Vessel Type" value={filterVessel} onChange={e => setFilterVessel(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Filter Fuel Type" value={filterFuel} onChange={e => setFilterFuel(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Filter Year" value={filterYear} onChange={e => setFilterYear(e.target.value)} className="p-2 border rounded" type="number" />
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Route ID</th>
            <th className="px-4 py-2 text-left">Vessel Type</th>
            <th className="px-4 py-2 text-left">Fuel Type</th>
            <th className="px-4 py-2 text-left">Year</th>
            <th className="px-4 py-2 text-left">GHG Intensity</th>
            <th className="px-4 py-2 text-left">Fuel Cons. (t)</th>
            <th className="px-4 py-2 text-left">Distance (km)</th>
            <th className="px-4 py-2 text-left">Total Em. (t)</th>
            <th className="px-4 py-2 text-left">Baseline?</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutes.map(r => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{r.routeId}</td>
              <td className="px-4 py-2">{r.vesselType}</td>
              <td className="px-4 py-2">{r.fuelType}</td>
              <td className="px-4 py-2">{r.year}</td>
              <td className="px-4 py-2 font-mono">{r.ghgIntensity}</td>
              <td className="px-4 py-2 font-mono">{r.fuelConsumption}</td>
              <td className="px-4 py-2 font-mono">{r.distance}</td>
              <td className="px-4 py-2 font-mono">{r.totalEmissions}</td>
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
