import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

interface RouteData {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export const RoutesTab = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVessel, setFilterVessel] = useState('');
  const [filterFuel, setFilterFuel] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/routes');
      setRoutes(data);
    } catch {
      showToast('Failed to fetch routes', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRoutes(); }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const setBaseline = async (routeId: string) => {
    try {
      await api.post(`/routes/${routeId}/baseline`);
      showToast(`${routeId} set as baseline`, 'success');
      fetchRoutes();
    } catch {
      showToast('Failed to set baseline', 'error');
    }
  };

  // Extract unique values for dropdown filters
  const vesselTypes = useMemo(() => [...new Set(routes.map(r => r.vesselType))], [routes]);
  const fuelTypes = useMemo(() => [...new Set(routes.map(r => r.fuelType))], [routes]);
  const years = useMemo(() => [...new Set(routes.map(r => r.year))].sort(), [routes]);

  const filteredRoutes = routes.filter(r =>
    (filterVessel ? r.vesselType === filterVessel : true) &&
    (filterFuel ? r.fuelType === filterFuel : true) &&
    (filterYear ? r.year.toString() === filterYear : true)
  );

  return (
    <div className="fade-in">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">🚢 Vessel Routes</h2>
        <p className="card-subtitle">Browse all routes, filter by vessel type, fuel type, or year. Set any route as the baseline for comparison.</p>

        <div className="form-group">
          <select className="form-select" value={filterVessel} onChange={e => setFilterVessel(e.target.value)}>
            <option value="">All Vessel Types</option>
            {vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select className="form-select" value={filterFuel} onChange={e => setFilterFuel(e.target.value)}>
            <option value="">All Fuel Types</option>
            {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select className="form-select" value={filterYear} onChange={e => setFilterYear(e.target.value)}>
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y.toString()}>{y}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner"></div></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Route ID</th>
                  <th>Vessel Type</th>
                  <th>Fuel Type</th>
                  <th>Year</th>
                  <th>GHG Intensity (gCO₂e/MJ)</th>
                  <th>Fuel Cons. (t)</th>
                  <th>Distance (km)</th>
                  <th>Total Emissions (t)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.routeId}</td>
                    <td>{r.vesselType}</td>
                    <td>{r.fuelType}</td>
                    <td>{r.year}</td>
                    <td className="mono">{r.ghgIntensity.toFixed(2)}</td>
                    <td className="mono">{r.fuelConsumption.toLocaleString()}</td>
                    <td className="mono">{r.distance.toLocaleString()}</td>
                    <td className="mono">{r.totalEmissions.toLocaleString()}</td>
                    <td>
                      {r.isBaseline
                        ? <span className="status-badge badge-active">✅ Baseline</span>
                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      }
                    </td>
                    <td>
                      {!r.isBaseline && (
                        <button className="btn btn-primary" onClick={() => setBaseline(r.routeId)}>
                          Set Baseline
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRoutes.length === 0 && (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No routes found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
