import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

export const BankingTab = () => {
  const [shipId, setShipId] = useState('R002');
  const [year, setYear] = useState(2024);
  const [amount, setAmount] = useState(0);
  const [cbInfo, setCbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // KPIs for tracking banking transactions
  const [kpis, setKpis] = useState<{ cb_before: number; applied: number; cb_after: number } | null>(null);

  const fetchCb = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/compliance/cb?year=${year}&shipId=${shipId}`);
      setCbInfo(data);
      setKpis({ cb_before: data.cbGco2eq, applied: 0, cb_after: data.cbGco2eq });
    } catch (err: any) {
      setCbInfo(null);
      setKpis(null);
      setError(err.response?.data?.error || 'Failed to fetch compliance balance');
    }
    setLoading(false);
  };

  useEffect(() => { fetchCb(); }, [shipId, year]);

  const clearMessages = () => { setError(''); setSuccess(''); };

  const handleBank = async () => {
    clearMessages();
    try {
      await api.post('/banking/bank', { shipId, year, amount });
      setSuccess(`Successfully banked ${amount.toLocaleString()} gCO₂eq`);
      // Update KPIs
      if (kpis) setKpis({ cb_before: kpis.cb_before, applied: amount, cb_after: kpis.cb_before - amount });
      fetchCb();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to bank surplus');
    }
  };

  const handleApply = async () => {
    clearMessages();
    try {
      await api.post('/banking/apply', { shipId, year, amount });
      setSuccess(`Successfully applied ${amount.toLocaleString()} gCO₂eq banked surplus`);
      if (kpis) setKpis({ cb_before: kpis.cb_before, applied: amount, cb_after: kpis.cb_before + amount });
      fetchCb();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to apply banked surplus');
    }
  };

  const cbValue = cbInfo?.cbGco2eq ?? 0;
  const isSurplus = cbValue > 0;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 className="card-title">🏦 Article 20 – Banking</h2>
        <p className="card-subtitle">
          Bank your positive Compliance Balance (surplus) or apply banked surplus to cover a deficit year.
        </p>

        {/* Ship & Year Inputs */}
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Ship ID (e.g. R002)"
            value={shipId}
            onChange={e => setShipId(e.target.value)}
          />
          <input
            className="form-input"
            type="number"
            placeholder="Year"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          />
        </div>

        {/* Error / Success Alerts */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* Loading */}
        {loading && <div className="loading-center"><div className="spinner"></div></div>}

        {/* KPI Cards */}
        {kpis && !loading && (
          <div className="kpi-grid">
            <div className={`kpi-card ${kpis.cb_before > 0 ? 'surplus' : 'deficit'}`}>
              <span className="kpi-label">CB Before (Current)</span>
              <span className={`kpi-value ${kpis.cb_before > 0 ? 'positive' : 'negative'}`}>
                {kpis.cb_before.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>gCO₂eq</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Applied / Banked</span>
              <span className="kpi-value" style={{ color: 'var(--accent-cyan)' }}>
                {kpis.applied.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>gCO₂eq</span>
            </div>
            <div className={`kpi-card ${kpis.cb_after > 0 ? 'surplus' : 'deficit'}`}>
              <span className="kpi-label">CB After</span>
              <span className={`kpi-value ${kpis.cb_after > 0 ? 'positive' : 'negative'}`}>
                {kpis.cb_after.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>gCO₂eq</span>
            </div>
          </div>
        )}

        {/* Amount Input & Actions */}
        <div className="form-group" style={{ alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Amount (gCO₂eq)
            </label>
            <input
              className="form-input"
              type="number"
              placeholder="Amount to bank or apply"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-success"
            disabled={!cbInfo || cbValue <= 0 || amount <= 0}
            onClick={handleBank}
          >
            💰 Bank Surplus
          </button>
          <button
            className="btn btn-primary"
            disabled={amount <= 0}
            onClick={handleApply}
          >
            📥 Apply Banked Surplus
          </button>
        </div>

        {/* Disable hint */}
        {cbInfo && cbValue <= 0 && (
          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            ℹ️ Banking is disabled because the Compliance Balance is ≤ 0 (deficit). You can still apply banked surplus from a previous year.
          </div>
        )}
      </div>
    </div>
  );
};
