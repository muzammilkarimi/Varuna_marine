import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

export const BankingTab = () => {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2025);
  const [amount, setAmount] = useState(0);
  const [cbInfo, setCbInfo] = useState<any>(null);

  const fetchCb = async () => {
    try {
      const { data } = await api.get(`/compliance/cb?year=${year}&shipId=${shipId}`);
      setCbInfo(data);
    } catch {
      setCbInfo(null);
    }
  };

  useEffect(() => {
    fetchCb();
  }, [shipId, year]);

  const handleBank = async () => {
    try {
      await api.post('/banking/bank', { shipId, year, amount });
      alert('Banked successfully!');
      fetchCb();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to bank');
    }
  };

  const handleApply = async () => {
    try {
      await api.post('/banking/apply', { shipId, year, amount });
      alert('Applied successfully!');
      fetchCb();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to apply banked surplus');
    }
  };

  return (
    <div className="p-4 bg-white shadow-sm rounded border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Article 20 – Banking</h2>
      <p className="mb-4 text-gray-600">
        Bank your positive Compliance Balance (Surplus) or apply banked surplus to cover a deficit.
      </p>
      
      <div className="flex gap-4 mb-4">
        <input placeholder="Ship ID" value={shipId} onChange={e => setShipId(e.target.value)} className="p-2 border rounded" />
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(Number(e.target.value))} className="p-2 border rounded" />
      </div>

      {cbInfo && (
        <div className="mb-4 p-4 bg-blue-50 rounded text-blue-900 border border-blue-200">
          <p><strong>Current CB ({year}):</strong> {cbInfo.cbGco2eq} gCO2eq</p>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <input type="number" placeholder="Amount (gCO2eq)" value={amount} onChange={e => setAmount(Number(e.target.value))} className="p-2 border rounded" />
      </div>

      <div className="flex gap-4">
        <button 
          disabled={!cbInfo || cbInfo.cbGco2eq <= 0}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
          onClick={handleBank}>
          Bank Surplus
        </button>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={handleApply}>
          Apply Banked Surplus
        </button>
      </div>
    </div>
  );
};
