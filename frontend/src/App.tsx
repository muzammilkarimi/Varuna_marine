import React, { useState } from 'react';
import { RoutesTab } from './adapters/ui/routes/RoutesTab';
import { CompareTab } from './adapters/ui/compare/CompareTab';

function App() {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">FuelEU Maritime Dashboard</h1>
        <nav className="mt-4 flex gap-4">
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'routes' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
            onClick={() => setActiveTab('routes')}>
            Routes
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'compare' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}
            onClick={() => setActiveTab('compare')}>
            Compare
          </button>
        </nav>
      </header>

      <main className="flex-1 p-6">
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'compare' && <CompareTab />}
      </main>
    </div>
  );
}

export default App;
