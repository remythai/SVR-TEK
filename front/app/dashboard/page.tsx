'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, Filter } from 'lucide-react';

import { getStartups, Startup } from '../requests/startups';
import { getEvents, Event } from '../requests/events';
import { getNews, NewsItem } from '../requests/news';
import { getUsers, User } from '../requests/users';
import { getInvestors, Investor } from '../requests/investors';

type EntityType = 'startups' | 'events' | 'news' | 'users' | 'investors';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<EntityType>('startups');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [startups, setStartups] = useState<Startup[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const getTableHeaders = (): string[] => {
    switch (activeTab) {
      case 'startups':
        return ['Nom', 'Secteur', 'Statut', 'Maturité', 'Email', 'Fondateurs'];
      case 'events':
        return ['Nom', 'Type', 'Date', 'Lieu'];
      case 'news':
        return ['Titre', 'Catégorie', 'Date', 'Lieu'];
      case 'users':
        return ['Nom', 'Email', 'Rôle'];
      case 'investors':
        return ['Nom', 'Entreprise', 'Rôle', 'Email'];
      default:
        return [];
    }
  };

  const getTableRow = (item: any): (string | JSX.Element)[] => {
    switch (activeTab) {
      case 'startups':
        return [
          item.name,
          item.sector,
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.project_status === 'active' ? 'bg-green-100 text-green-800' : 
            item.project_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {item.project_status}
          </span>,
          item.maturity,
          item.email,
          `${item.founders?.length || 0} fondateur(s)`
        ];
      case 'events':
        return [
          item.name,
          item.event_type,
          new Date(item.dates).toLocaleDateString('fr-FR'),
          item.location || 'Non spécifié'
        ];
      case 'news':
        return [
          item.title,
          item.category,
          new Date(item.news_date).toLocaleDateString('fr-FR'),
          item.location || 'Non spécifié'
        ];
      case 'users':
        return [
          item.name,
          item.email,
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.role === 'admin' ? 'bg-red-100 text-red-800' : 
            item.role === 'investor' ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {item.role}
          </span>
        ];
      case 'investors':
        return [
          item.name,
          item.company || 'Non spécifié',
          item.role || 'Non spécifié',
          item.email || 'Non spécifié'
        ];
      default:
        return [];
    }
  };

  const getSearchFields = (item: any): string[] => {
    switch (activeTab) {
      case 'startups':
        return [item.name, item.sector, item.maturity, item.project_status];
      case 'events':
        return [item.name, item.event_type, item.location];
      case 'news':
        return [item.title, item.category, item.location];
      case 'users':
        return [item.name, item.email, item.role];
      case 'investors':
        return [item.name, item.company, item.role];
      default:
        return [];
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'startups':
          setStartups(await getStartups());
          break;
        case 'events':
          setEvents(await getEvents());
          break;
        case 'news':
          setNews(await getNews());
          break;
        case 'users':
          setUsers(await getUsers());
          break;
        case 'investors':
          setInvestors(await getInvestors());
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'startups': return startups;
      case 'events': return events;
      case 'news': return news;
      case 'users': return users;
      case 'investors': return investors;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter((item: any) => {
    const searchFields = getSearchFields(item);
    return searchFields.some(field => 
      field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreate = () => {
    setModalType('create');
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleView = (item: any) => {
    setModalType('view');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (item: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
      // TODO: Implémenter delete
      console.log('Delete:', item);
    }
  };

  const tabs = [
    { key: 'startups' as EntityType, label: 'Startups', count: startups.length },
    { key: 'events' as EntityType, label: 'Événements', count: events.length },
    { key: 'news' as EntityType, label: 'Actualités', count: news.length },
    { key: 'users' as EntityType, label: 'Utilisateurs', count: users.length },
    { key: 'investors' as EntityType, label: 'Investisseurs', count: investors.length },
  ];

  return (
    <div className="min-h-screen mt-30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Gérez vos données d'incubateur</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Créer
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Rechercher des ${tabs.find(t => t.key === activeTab)?.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filtres
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {getTableHeaders().map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item: any, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      {getTableRow(item).map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cell}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Voir"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun élément trouvé</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          entityType={activeTab}
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

const Modal = ({
  type,
  entityType,
  item,
  onClose,
  onSave,
}: {
  type: 'create' | 'edit' | 'view';
  entityType: EntityType;
  item: any;
  onClose: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {type === 'create' ? 'Créer' : type === 'edit' ? 'Modifier' : 'Voir'} {entityType}
        </h2>
        <pre className="text-xs bg-gray-100 p-2 rounded mb-4">
          {JSON.stringify(item, null, 2)}
        </pre>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
          {type !== 'view' && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
