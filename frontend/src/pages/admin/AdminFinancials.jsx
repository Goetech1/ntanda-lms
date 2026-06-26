import React, { useState, useEffect } from 'react';
import { financialService } from '../../services/api';

const AdminFinancials = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await financialService.getPayments().catch(() => ({ data: [] }));
        const data = res?.data?.data || res?.data || [];
        
        if (data.length === 0) {
          setPayments([
            { id: '1', student: 'Alice Johnson', amount: 150.00, course: 'React 101', date: '2026-06-01', status: 'COMPLETED' },
            { id: '2', student: 'Bob Smith', amount: 99.99, course: 'JS Masterclass', date: '2026-06-03', status: 'COMPLETED' },
            { id: '3', student: 'Charlie Davis', amount: 150.00, course: 'Modern CSS', date: '2026-06-04', status: 'PENDING' }
          ]);
        } else {
          setPayments(data);
        }
      } catch (err) {
        console.error('Error fetching payments', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = payments.reduce((acc, curr) => curr.status === 'COMPLETED' ? acc + (curr.amount || 0) : acc, 0);

  return (
    <div className="flex-1 max-w-max-width mx-auto w-full p-md md:p-margin-desktop space-y-3xl font-body-md bg-surface-bright">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-base">
            <span>Engagement & Utilities</span>
            <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 0"}}>chevron_right</span>
            <span className="text-primary font-bold">Financials</span>
          </nav>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Financials & Revenue</h2>
          <p className="text-body-lg text-on-surface-variant mt-xs">Track course sales, student payments, and tenant subscriptions.</p>
        </div>
        <div className="flex items-center gap-md">
          <button className="px-lg py-3 rounded-lg border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>download</span>
            Export CSV
          </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-3xl">
        <div className="bg-primary/10 border border-primary/20 p-xl rounded-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-primary/20 text-primary rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>payments</span>
            </div>
            <span className="font-label-sm text-primary font-bold">MTD</span>
          </div>
          <div>
            <p className="font-label-md text-primary opacity-80 uppercase tracking-wider mb-xs">Total Revenue</p>
            <p className="font-display-lg text-primary font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-surface-container-highest text-on-surface-variant rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>receipt_long</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Transactions</p>
            <p className="font-display-lg text-on-surface font-bold">{payments.length}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-lg">
            <div className="p-sm bg-secondary/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>card_membership</span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Active Subscriptions</p>
            <p className="font-display-lg text-on-surface font-bold">24</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <section className="space-y-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Transactions</h3>
          <div className="flex gap-md">
            <button className="px-md py-2 bg-white border border-outline-variant rounded-lg text-on-surface-variant text-body-sm flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-body-md" style={{fontVariationSettings: "'FILL' 0"}}>filter_list</span>
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Student</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Course / Plan</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Date</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Amount</th>
                <th className="px-lg py-4 text-label-md font-bold text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr><td colSpan="5" className="px-lg py-8 text-center text-on-surface-variant">Loading...</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-lg py-4 font-medium text-on-surface">{p.student}</td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{p.course}</td>
                  <td className="px-lg py-4 text-body-sm text-on-surface-variant">{p.date}</td>
                  <td className="px-lg py-4 font-bold text-on-surface">${(p.amount || 0).toFixed(2)}</td>
                  <td className="px-lg py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${p.status === 'COMPLETED' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminFinancials;
