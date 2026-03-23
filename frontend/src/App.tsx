import React, { useState } from 'react';
import { RoutesTab } from './adapters/ui/routes/RoutesTab';
import { CompareTab } from './adapters/ui/compare/CompareTab';
import { BankingTab } from './adapters/ui/banking/BankingTab';
import { PoolingTab } from './adapters/ui/pooling/PoolingTab';

const tabs = [
  { id: 'routes', label: 'Routes', icon: '🚢' },
  { id: 'compare', label: 'Compare', icon: '📊' },
  { id: 'banking', label: 'Banking', icon: '🏦' },
  { id: 'pooling', label: 'Pooling', icon: '🤝' },
];

function App() {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="dashboard-header">
        <div className="header-top">
          <div className="header-logo">⛽</div>
          <div>
            <h1 className="header-title">FuelEU Maritime</h1>
            <p className="header-subtitle">Compliance Dashboard</p>
          </div>
        </div>
        <nav className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ marginRight: '0.35rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main-content">
        <div className="fade-in" key={activeTab}>
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </main>
    </div>
  );
}

export default App;
