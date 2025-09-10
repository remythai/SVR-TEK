"use client";

import React, { useState, useEffect, SVGProps } from 'react';
import {
  Users,
  BarChart3,
  Building2,
  Newspaper,
  Calendar,
  UserCog,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { Startup, getStartups } from '../requests/startups';
import { getEvents, Event } from '../requests/events';
import { getNews, NewsItem } from '../requests/news';
import { getUsers, User } from '../requests/users';

type TableValue = string | number | { name: string };

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  variant?: "default" | "danger";
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon: Icon, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${
      variant === "danger"
        ? "text-red-400 hover:bg-red-500/10"
        : "text-secondary-100 hover:bg-secondary-500/80"
    }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [startups, setStartups] = useState<Startup[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const startupsData = await getStartups();
    console.log(startupsData);
      setStartups(startupsData);

      const newsData = await getNews();
      setNews(newsData);

      const eventsData = await getEvents();
      setEvents(eventsData);

      const usersData = await getUsers();
      setUsers(usersData);
    };

    fetchData();
  }, []);

  const kpis = {
    totalStartups: startups.length,
    totalUsers: users.length,
    upcomingEvents: events.filter(e => new Date(e.dates) > new Date()).length
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Global', icon: BarChart3 },
    { id: 'news', label: 'News gestion', icon: Newspaper },
    { id: 'events', label: 'Events gestion', icon: Calendar },
    { id: 'users', label: 'Users gestion', icon: UserCog },
    { id: 'startups', label: 'Startups gestion', icon: Building2 }
  ];

  const KPICard = ({ title, value, icon: Icon, trend }: { title: string; value: number; icon: React.ComponentType<SVGProps<SVGSVGElement>>; trend?: string }) => (
    <div className="bg-secondary-500/80 rounded-lg p-6 border border-secondary-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-100 text-sm">{title}</p>
          <p className="text-2xl font-bold text-secondary-100 mt-2">{value}</p>
          {trend && <p className="text-green-400 text-sm mt-1">{trend}</p>}
        </div>
        <Icon className="h-8 w-8 text-secondary-100" />
      </div>
    </div>
  );

  const TableRow = ({ children, selected, onSelect }: { children: React.ReactNode; selected?: boolean; onSelect?: () => void }) => (
    <tr className={`border-b border-secondary-100 hover:bg-secondary-500/80 ${selected ? 'bg-secondary-300' : ''}`}>
      {onSelect && (
        <td className="px-6 py-4">
          <input 
            type="checkbox" 
            checked={selected} 
            onChange={onSelect}
            className="rounded bg-secondary-500/80 border-secondary-100"
          />
        </td>
      )}
      {children}
    </tr>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-100 mb-2">Global Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Startups" value={kpis.totalStartups} icon={Building2} trend="+12% ce mois" />
        <KPICard title="Utilisateurs" value={kpis.totalUsers} icon={Users} />
        <KPICard title="Événements à venir" value={kpis.upcomingEvents} icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary-500/80 rounded-lg p-6 border border-secondary-100">
          <h3 className="text-lg font-semibold text-secondary-100 mb-4">Recent activities</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-secondary-100">New startup added</span>
              <span className="text-gray-500 text-sm ml-auto">2h ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-secondary-100">New event</span>
              <span className="text-gray-500 text-sm ml-auto">Yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary-500/80 rounded-lg p-6 border border-secondary-100">
          <h3 className="text-lg font-semibold text-secondary-100 mb-4">Statistiques</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-100">Satisfaction utilisateurs</span>
                <span className="text-white">90%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div className="bg-purple-400 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = <T extends { id: number }>(
    title: string,
    data: T[],
    columns: string[],
    actions = true,
    onDelete?: (item: T) => Promise<void>
  ) => (
    <div className="space-y-4">
      <div className="bg-secondary-500/80 rounded-lg border border-secondary-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-secondary-500/80">
            <tr>
              {actions && <th className="px-6 py-3"></th>}
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-secondary-100 uppercase tracking-wider">
                  {column}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-right text-xs font-medium text-secondary-100 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item: T) => (
              <TableRow 
                key={item.id}
                selected={selectedItems.includes(item.id)}
                onSelect={actions ? () => {
                  setSelectedItems(prev => 
                    prev.includes(item.id) 
                      ? prev.filter(id => id !== item.id)
                      : [...prev, item.id]
                  )
                } : undefined}
              >
                {columns.map((col, idx) => {
                  const key = col.toLowerCase() as keyof T;
                  const value = item[key] as TableValue;

                  return (
                    <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-secondary-100">
                      {Array.isArray(value)
                        ? value.map(v => typeof v === 'object' ? v.name : String(v)).join(', ')
                        : String(value ?? '')
                      }
                    </td>
                  );
                })}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <ActionButton onClick={() => {}} icon={Eye} />
                      <ActionButton onClick={() => {}} icon={Edit} />
                      {onDelete && <ActionButton
                        onClick={() => onDelete(item)}
                        icon={Trash2}
                        variant="danger"
                      />}
                    </div>
                  </td>
                )}
              </TableRow>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'news':
        return renderTable('News gestion', news, ['Title', 'Autor', 'Category', 'Status', 'Publication date']);
      case 'events':
        return renderTable('Events gestion', events, ['Title', 'Date', 'Location', 'Organisateur', 'Inscrits/Capacité']);
      case 'users':
        return renderTable('Users gestion', users, ['Name', 'Email', 'Rôle', 'Status', 'Last connection']);
      case 'startups':
        return renderTable('Startups gestion', startups, ['Name', 'Sector', 'Status', 'Maturity', 'Fondators']);
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen mt-30 flex">
      <div className="w-64">
        <div className="p-6">
          <h2 className="text-xl font-bold text-secondary-100">Admin Area</h2>
          <p className="text-secondary-100 text-sm">(auth)</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-secondary-500/80 text-secondary-100'
                    : 'text-secondary-100 hover:bg-secondary-500/80'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
