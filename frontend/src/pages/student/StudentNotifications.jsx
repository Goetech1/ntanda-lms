import React, { useState } from 'react';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      category: 'Academic',
      categoryLabel: 'Academic',
      icon: 'military_tech',
      colorClass: 'bg-secondary-fixed text-on-secondary-fixed',
      time: '2m ago',
      title: 'New Grade Released: Advanced Physics',
      message: 'Your final examination results for PHY402 have been published. Log in to the student portal to view detailed feedback.',
      read: false
    },
    {
      id: 'notif-2',
      category: 'Urgent',
      categoryLabel: 'Urgent',
      icon: 'timer',
      colorClass: 'bg-error-container text-on-error-container',
      time: '1h ago',
      title: 'Assignment Deadline Approaching',
      message: '"Modern Literature Thesis" is due in 4 hours. Ensure your bibliography follows the APA 7th edition guidelines.',
      read: false,
      textErrorClass: 'text-error'
    },
    {
      id: 'notif-3',
      category: 'System',
      categoryLabel: 'System',
      icon: 'settings',
      colorClass: 'bg-surface-container-highest text-on-surface-variant',
      time: 'Yesterday',
      title: 'Scheduled Maintenance',
      message: 'Ntanda Learning will be offline this Saturday from 02:00 to 04:00 UTC for infrastructure upgrades. We apologize for the inconvenience.',
      read: false
    },
    {
      id: 'notif-4',
      category: 'Academic',
      categoryLabel: 'Academic',
      icon: 'auto_stories',
      colorClass: 'bg-primary-fixed text-on-primary-fixed',
      time: 'Oct 24',
      title: 'New Material: Data Structures',
      message: 'Dr. Aris Thorne has uploaded "Lecture 12: Binary Search Trees" and the accompanying source code examples for Module 4.',
      read: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifs = activeTab === 'All' ? notifications : notifications.filter(n => n.categoryLabel === activeTab);

  return (
    <main className="pt-8 pb-24 max-w-screen-md mx-auto min-h-screen px-margin-mobile animate-fade-up">
      {/* Action Header */}
      <section className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-headline-sm text-headline-sm text-on-surface">Alerts</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {unreadCount === 0 ? 'No unread notifications' : `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
          </p>
        </div>
        <button 
          className="text-primary font-label-md text-label-md hover:underline active:scale-95 transition-transform" 
          onClick={markAllRead}
        >
          Mark all as read
        </button>
      </section>

      {/* Category Chips */}
      <div className="flex gap-sm overflow-x-auto pb-md no-scrollbar" style={{scrollbarWidth: 'none'}}>
        {['All', 'Academic', 'System', 'Urgent'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-md py-xs rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:bg-surface-container'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-base">
        {filteredNotifs.length === 0 ? (
          <div className="py-xl flex flex-col items-center opacity-40 select-none">
            <div className="w-32 h-32 bg-surface-container rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-[48px] text-outline" style={{fontVariationSettings: "'FILL' 0"}}>notifications_off</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase">End of recent alerts</p>
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div 
              key={n.id}
              className={`${n.read ? 'bg-surface-container-lowest' : 'bg-white'} border border-outline-variant rounded-xl p-md flex gap-md items-start active:bg-surface-container-low transition-colors cursor-pointer group`}
              onClick={() => markRead(n.id)}
            >
              <div className={`${n.colorClass} p-2 rounded-lg flex items-center justify-center`}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>{n.icon}</span>
              </div>
              <div className="flex-1 space-y-xs">
                <div className="flex justify-between items-start">
                  <span className={`font-label-sm text-label-sm uppercase tracking-widest ${n.textErrorClass || 'text-on-surface-variant'}`}>{n.category}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{n.time}</span>
                </div>
                <h3 className={`font-headline-sm text-[16px] leading-tight text-on-surface ${n.read ? 'font-normal' : 'font-bold'}`}>{n.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{n.message}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 bg-primary rounded-full mt-4 flex-shrink-0" />
              )}
            </div>
          ))
        )}
        
        {filteredNotifs.length > 0 && (
          <div className="py-xl flex flex-col items-center opacity-40 select-none mt-lg">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-[32px] text-outline" style={{fontVariationSettings: "'FILL' 0"}}>notifications_off</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase">End of recent alerts</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default StudentNotifications;
