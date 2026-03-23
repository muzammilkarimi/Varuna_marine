import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

interface ShipCb {
  shipId: string;
  year: number;
  adjustedCb: number;
}

export const PoolingTab = () => {
  const [year, setYear] = useState(2024);
  const [shipsInput, setShipsInput] = useState('R001, R002');
  const [poolPreview, setPoolPreview] = useState<ShipCb[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAdjusted = async () => {
    setLoading(true);
    setError('');
    try {
      const ships = shipsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await Promise.all(
        ships.map(s => api.get(`/compliance/adjusted-cb?year=${year}&shipId=${s}`))
      );
      setPoolPreview(res.map(r => r.data));
    } catch (err: any) {
      setPoolPreview([]);
      setError(err.response?.data?.error || 'Failed to fetch adjusted CB');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (shipsInput.trim()) fetchAdjusted();
  }, [shipsInput, year]);

  const totalPoolCb = poolPreview.reduce((acc, curr) => acc + (curr.adjustedCb || 0), 0);
  const isValidPool = totalPoolCb >= 0 && poolPreview.length >= 2;

  // Validation checks per FuelEU Art. 21 rules
  const deficitShips = poolPreview.filter(s => s.adjustedCb < 0);
  const surplusShips = poolPreview.filter(s => s.adjustedCb > 0);

  const handleCreatePool = async () => {
    setError('');
    setSuccess('');
    try {
      const ships = shipsInput.split(',').map(s => s.trim()).filter(Boolean);
      const result = await api.post('/pools', { year, shipIds: ships });
      setSuccess(`Pool created successfully with ${result.data.members?.length || ships.length} members!`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create pool');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 className="card-title">🤝 Article 21 – Pooling</h2>
        <p className="card-subtitle">
          Create compliance pools where ships with surplus CB can offset ships with deficit CB. Pool sum must be ≥ 0.
        </p>

        {/* Inputs */}
        <div className="form-group">
          <input
            className="form-input"
            type="number"
            placeholder="Year"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{ maxWidth: '120px' }}
          />
          <textarea
            className="form-input"
            placeholder="Enter comma-separated Ship IDs (e.g. R001, R002)"
            value={shipsInput}
            onChange={e => setShipsInput(e.target.value)}
            style={{ flex: 1, minHeight: '44px', resize: 'vertical' }}
          />
        </div>

        {/* Error / Success Alerts */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {loading && <div className="loading-center"><div className="spinner"></div></div>}

        {/* Pool Sum Indicator */}
        {!loading && poolPreview.length > 0 && (
          <div className={`pool-indicator ${isValidPool ? 'valid' : 'invalid'}`}>
            <span style={{ fontSize: '1.25rem' }}>{isValidPool ? '✅' : '❌'}</span>
            <span>Pool Sum: {totalPoolCb.toLocaleString()} gCO₂eq</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.8 }}>
              {isValidPool ? 'Valid – Pool creation allowed' : 'Invalid – Sum must be ≥ 0'}
            </span>
          </div>
        )}
      </div>

      {/* Members Preview Table */}
      {!loading && poolPreview.length > 0 && (
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem' }}>Pool Members Preview</h3>
          <p className="card-subtitle">
            {surplusShips.length} surplus ship(s) · {deficitShips.length} deficit ship(s) · {poolPreview.length} total
          </p>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ship ID</th>
                  <th>Adjusted CB (Before)</th>
                  <th>Status</th>
                  <th>CB After (Estimated)</th>
                </tr>
              </thead>
              <tbody>
                {poolPreview.map(p => {
                  const isSurplus = p.adjustedCb > 0;
                  const isDeficit = p.adjustedCb < 0;
                  // Simple estimation: deficit ships get offset towards 0
                  let estimatedAfter = p.adjustedCb;
                  if (isDeficit && isValidPool) {
                    // Surplus available can offset deficit
                    const totalSurplus = poolPreview.filter(s => s.adjustedCb > 0).reduce((a, s) => a + s.adjustedCb, 0);
                    const totalDeficit = Math.abs(poolPreview.filter(s => s.adjustedCb < 0).reduce((a, s) => a + s.adjustedCb, 0));
                    const ratio = Math.min(1, totalSurplus / totalDeficit);
                    estimatedAfter = p.adjustedCb + Math.abs(p.adjustedCb) * ratio;
                  } else if (isSurplus && isValidPool) {
                    const totalDeficit = Math.abs(poolPreview.filter(s => s.adjustedCb < 0).reduce((a, s) => a + s.adjustedCb, 0));
                    const totalSurplus = poolPreview.filter(s => s.adjustedCb > 0).reduce((a, s) => a + s.adjustedCb, 0);
                    const ratio = Math.min(1, totalDeficit / totalSurplus);
                    estimatedAfter = p.adjustedCb - p.adjustedCb * ratio;
                  }

                  return (
                    <tr key={p.shipId}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.shipId}</td>
                      <td className="mono" style={{ color: isSurplus ? 'var(--accent-green)' : isDeficit ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                        {p.adjustedCb.toLocaleString()} gCO₂eq
                      </td>
                      <td>
                        {isSurplus && <span className="status-badge badge-success">Surplus</span>}
                        {isDeficit && <span className="status-badge badge-danger">Deficit</span>}
                        {!isSurplus && !isDeficit && <span className="status-badge" style={{ background: 'rgba(148,163,184,0.15)', color: 'var(--text-secondary)' }}>Neutral</span>}
                      </td>
                      <td className="mono" style={{ color: estimatedAfter >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {Math.round(estimatedAfter).toLocaleString()} gCO₂eq
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Validation Rules */}
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>FuelEU Art. 21 Rules:</strong>
            <ul style={{ margin: '0.5rem 0 0 1.2rem', lineHeight: '1.6' }}>
              <li>Sum of all adjusted CBs must be ≥ 0 {totalPoolCb >= 0 ? '✅' : '❌'}</li>
              <li>Deficit ships cannot exit the pool worse off than before</li>
              <li>Surplus ships cannot exit the pool with a negative balance</li>
            </ul>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              className="btn btn-indigo"
              disabled={!isValidPool || poolPreview.length < 2}
              onClick={handleCreatePool}
              style={{ width: '100%' }}
            >
              🤝 Create Pool ({poolPreview.length} members)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
