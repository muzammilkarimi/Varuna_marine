import React, { useState } from 'react';

export const BankingTab = () => {
  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState(2025);
  const [amount, setAmount] = useState(0);

  return (
    <div className="p-4 bg-white shadow-sm rounded border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Article 20 – Banking</h2>
      <p className="mb-4 text-gray-600">
        Bank your positive Compliance Balance (Surplus) or apply banked surplus to cover a deficit.
      </p>
      
      <div className="flex gap-4 mb-4">
        <input 
          placeholder="Ship ID" 
          value={shipId} 
          onChange={e => setShipId(e.target.value)} 
          className="p-2 border rounded"
        />
        <input 
          type="number" 
          placeholder="Year" 
          value={year} 
          onChange={e => setYear(Number(e.target.value))} 
          className="p-2 border rounded"
        />
        <input 
          type="number" 
          placeholder="Amount (gCO2eq)" 
          value={amount} 
          onChange={e => setAmount(Number(e.target.value))} 
          className="p-2 border rounded"
        />
      </div>

      <div className="flex gap-4">
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          onClick={() => alert(`Banking ${amount} for ${shipId} in ${year} (Endpoint pending)`)}>
          Bank Surplus
        </button>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => alert(`Applying ${amount} banked CB to ${shipId} in ${year} (Endpoint pending)`)}>
          Apply Banked Surplus
        </button>
      </div>
    </div>
  );
};
