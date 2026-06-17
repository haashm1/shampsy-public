import React from 'react';
import { Calendar, User, Key, LayoutDashboard } from 'lucide-react';

export default function Navbar({ currentView, onViewChange, psychologistName }) {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => onViewChange('client')}>
          <span>Shamna</span>
        </div>
        <div className="nav-links">
          {currentView === 'client' ? (
            <>
              <button 
                onClick={() => onViewChange('client')}
                className="btn btn-secondary"
                style={{ fontWeight: 600, border: 'none', background: 'transparent' }}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  // Scroll to doctor card or trigger booking
                  const el = document.getElementById('doctor-card-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-secondary"
                style={{ fontWeight: 600, border: 'none', background: 'transparent' }}
              >
                About Me
              </button>
              <button 
                onClick={() => onViewChange('admin')} 
                className="btn btn-primary btn-sm"
              >
                <Key size={16} /> Psychologist Portal
              </button>
            </>
          ) : (
            <>
              <span className="text-secondary" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Logged in as <strong>{psychologistName || 'Psychologist'}</strong>
              </span>
              <button 
                onClick={() => onViewChange('client')} 
                className="btn btn-secondary btn-sm"
              >
                <LayoutDashboard size={16} /> View Client Site
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
