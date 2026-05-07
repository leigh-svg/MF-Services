'use client'
import { useState } from 'react'
import CablePlanConfigurator from '../components/CablePlanConfigurator'
import SpecGenerator from '../components/SpecGenerator'

const TABS = [
  { id: 'cablePlan', label: 'Cable Plan' },
  { id: 'hardwareSpec', label: 'Hardware Spec' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('cablePlan')

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', color: '#0F1C2E', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, background: '#FFFFFF', borderRadius: 16, padding: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 12,
                padding: '14px 18px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === tab.id ? '#00387B' : '#F3F4F6',
                color: activeTab === tab.id ? '#FFFFFF' : '#6B7280',
                transition: 'background 150ms, color 150ms',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {activeTab === 'cablePlan' ? <CablePlanConfigurator /> : <SpecGenerator />}
        </div>
      </div>
    </div>
  )
}
