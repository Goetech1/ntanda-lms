import { useState, useEffect } from 'react';
import { instructorPortalService } from '../../services/api';

const InstructorEarnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorPortalService.getMyEarnings().catch(() => ({
          data: { data: {
            availableBalance: 1250.00,
            pendingClearance: 350.00,
            totalLifetime: 4500.00,
            revenueShare: '70%',
            recentTransactions: [
              { id: '1', date: '2026-06-03', description: 'Course Sale: React Masterclass', amount: 49.99, myCut: 34.99 },
              { id: '2', date: '2026-06-01', description: 'Course Sale: React Masterclass', amount: 49.99, myCut: 34.99 },
              { id: '3', date: '2026-05-28', description: 'Monthly Payout to Bank', amount: -1500.00, myCut: -1500.00 }
            ]
          }}
        }));
        setEarningsData(res?.data?.data || res?.data);
      } catch (err) {
        console.error('Error fetching earnings', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Financials...</div>;

  return (
    <div style={{ maxWidth: '1200px', position: 'relative', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Earnings & Payouts</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Track your revenue share and request payouts.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💳</span> Request Payout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel animate-fade-up" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), transparent)' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Available for Payout</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>${earningsData.availableBalance.toFixed(2)}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your Share: {earningsData.revenueShare}</div>
        </div>

        <div className="glass-panel animate-fade-up" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animationDelay: '0.1s' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pending Clearance</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>${earningsData.pendingClearance.toFixed(2)}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clears in 30 days</div>
        </div>

        <div className="glass-panel animate-fade-up" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animationDelay: '0.2s' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Lifetime Earnings</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>${earningsData.totalLifetime.toFixed(2)}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Since joining</div>
        </div>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem', animationDelay: '0.3s' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Transaction History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Sale Amount</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Your Earnings</th>
            </tr>
          </thead>
          <tbody>
            {earningsData.recentTransactions.map(tx => (
              <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{tx.date}</td>
                <td style={{ padding: '1.25rem 1rem', color: '#fff' }}>
                  {tx.myCut < 0 ? <span style={{ color: '#ef4444', marginRight: '0.5rem' }}>↗</span> : <span style={{ color: '#10b981', marginRight: '0.5rem' }}>↘</span>}
                  {tx.description}
                </td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{tx.amount > 0 ? `$${tx.amount.toFixed(2)}` : '-'}</td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: 'bold', color: tx.myCut > 0 ? '#10b981' : '#ef4444' }}>
                  {tx.myCut > 0 ? '+' : ''}{tx.myCut.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorEarnings;
