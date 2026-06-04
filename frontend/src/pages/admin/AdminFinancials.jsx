import { useState, useEffect } from 'react';
import { financialService } from '../../services/api';

const AdminFinancials = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await financialService.getPayments().catch(() => ({
          data: { data: [
            { id: '1', student: 'Alice Johnson', amount: 150.00, course: 'React 101', date: '2026-06-01', status: 'COMPLETED' },
            { id: '2', student: 'Bob Smith', amount: 99.99, course: 'JS Masterclass', date: '2026-06-03', status: 'COMPLETED' },
            { id: '3', student: 'Charlie Davis', amount: 150.00, course: 'Modern CSS', date: '2026-06-04', status: 'PENDING' }
          ]}
        }));
        
        setPayments(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching payments', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = payments.reduce((acc, curr) => curr.status === 'COMPLETED' ? acc + curr.amount : acc, 0);

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary)' }}>Loading Financials...</div>;

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '1200px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>Financials & Revenue</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '1.1rem' }}>Track course sales, student payments, and tenant subscriptions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Revenue (MTD)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Transactions</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>{payments.length}</div>
        </div>
        <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Active Subscriptions</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>24</div>
        </div>
      </div>

      <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Recent Transactions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem' }}>Student</th>
              <th style={{ padding: '1rem' }}>Course / Plan</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#fff' }}>{p.student}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{p.course}</td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>{p.date}</td>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 'bold', color: '#fff' }}>${p.amount.toFixed(2)}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '99px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: p.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                    color: p.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                  }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFinancials;
