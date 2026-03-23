import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const api = axios.create({ baseURL: 'http://localhost:3001' });

const TARGET_INTENSITY = 89.3368;

interface ComparisonRoute {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  ghgIntensity: number;
  isBaseline: boolean;
  percentDiff: number;
  compliant: boolean;
}

export const CompareTab = () => {
  const [data, setData] = useState<ComparisonRoute[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await api.get('/routes/comparison');
      setData(res.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchComparison(); }, []);

  const baseline = data.find(r => r.isBaseline);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Target KPI Banner */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Compliance Target</span>
          <span className="kpi-value" style={{ color: 'var(--accent-cyan)' }}>{TARGET_INTENSITY}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>gCO₂e/MJ (2% below 91.16)</span>
        </div>
        {baseline && (
          <div className="kpi-card">
            <span className="kpi-label">Baseline Route</span>
            <span className="kpi-value" style={{ color: 'var(--accent-blue-light)' }}>{baseline.routeId}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ</span>
          </div>
        )}
        <div className="kpi-card">
          <span className="kpi-label">Formula</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontFamily: 'monospace' }}>
            %Diff = ((comp / base) − 1) × 100
          </span>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Comparison Table */}
      <div className="card">
        <h2 className="card-title">📊 Baseline vs Comparison Routes</h2>
        <p className="card-subtitle">Each route is compared against the baseline. Compliance is checked against {TARGET_INTENSITY} gCO₂e/MJ target.</p>

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
                  <th>GHG Intensity (gCO₂e/MJ)</th>
                  <th>% Difference to Baseline</th>
                  <th>Compliant (≤ {TARGET_INTENSITY})</th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {r.routeId}
                      {r.isBaseline && <span className="status-badge badge-active" style={{ marginLeft: '0.5rem' }}>BASE</span>}
                    </td>
                    <td>{r.vesselType}</td>
                    <td>{r.fuelType}</td>
                    <td className="mono">{r.ghgIntensity.toFixed(2)}</td>
                    <td className="mono" style={{ color: r.isBaseline ? 'var(--text-muted)' : r.percentDiff <= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {r.isBaseline ? 'BASELINE' : (r.percentDiff > 0 ? '+' : '') + r.percentDiff.toFixed(2) + '%'}
                    </td>
                    <td>
                      {r.compliant
                        ? <span className="status-badge badge-success">✅ Yes</span>
                        : <span className="status-badge badge-danger">❌ No</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chart */}
      {!loading && data.length > 0 && (
        <div className="chart-container" style={{ height: 420 }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>GHG Intensity Comparison Chart</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="routeId" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={['dataMin - 3', 'dataMax + 3']} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <ReferenceLine y={TARGET_INTENSITY} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Target (${TARGET_INTENSITY})`, fill: '#ef4444', fontSize: 12 }} />
              <Bar dataKey="ghgIntensity" name="GHG Intensity (gCO₂e/MJ)" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.compliant ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
