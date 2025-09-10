'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, Filter } from 'lucide-react';

import { getStartups, createStartup, updateStartup, deleteStartup, Startup } from '../requests/startups';
import { getEvents, createEvent, updateEvent, deleteEvent, Event } from '../requests/events';
import { getNews, createNews, updateNews, deleteNews, NewsItem } from '../requests/news';
import { getUsers, createUser, updateUser, deleteUser, User } from '../requests/users';
import { getInvestors, Investor } from '../requests/investors';

type EntityType = 'startups' | 'events' | 'news' | 'users' | 'investors';
type DashboardItem = Startup | Event | NewsItem | User | Investor;

const Dashboard: React.FC = () => {
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

  type DashboardItemMap = {
    startups: Startup;
    events: Event;
    news: NewsItem;
    users: User;
    investors: Investor;
  };

  const [selectedItem, setSelectedItem] = useState<Partial<DashboardItem>>({});

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

  const getTableRow = (item: DashboardItem): (string | React.JSX.Element)[] => {
    switch (activeTab) {
      case 'startups':
        const startup = item as Startup
        return [
          startup.name,
          startup.sector,
          <span key="status" className={`px-2 py-1 rounded-full text-xs ${
            startup.project_status === 'active' ? 'bg-green-100 text-green-800' : 
            startup.project_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {startup.project_status}
          </span>,
          startup.maturity,
          startup.email,
          `${startup.founders?.length || 0} fondateur(s)`
        ];
      case 'events':
        const event = item as Event
        return [
          event.name,
          event.event_type,
          new Date(event.dates).toLocaleDateString('fr-FR'),
          event.location || 'Non spécifié'
        ];
      case 'news':
        const news = item as NewsItem
        return [
          news.title,
          news.category,
          new Date(news.news_date).toLocaleDateString('fr-FR'),
          news.location || 'Non spécifié'
        ];
      case 'users':
        const user = item as User
        return [
          user.name,
          user.email,
          <span key={`role-${user.id}`} className={`px-2 py-1 rounded-full text-xs ${
            user.role === 'admin' ? 'bg-red-100 text-red-800' : 
            user.role === 'investor' ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {user.role}
          </span>
        ];
      case 'investors':
        const investor = item as Investor
        return [
          investor.name,
          investor.company || 'Non spécifié',
          investor.role || 'Non spécifié',
          investor.email || 'Non spécifié'
        ];
      default:
        return [];
    }
  };

  const getSearchFields = (item: DashboardItem): string[] => {
    switch (activeTab) {
      case 'startups': return [(item as Startup).name, (item as Startup).sector, (item as Startup).maturity, (item as Startup).project_status];
      case 'events': return [(item as Event).name, (item as Event).event_type, (item as Event).location];
      case 'news': return [(item as NewsItem).title, (item as NewsItem).category, (item as NewsItem).location];
      case 'users': return [(item as User).name, (item as User).email, (item as User).role];
      case 'investors': return [(item as Investor).name, (item as Investor).company, (item as Investor).role];
      default:
        return [];
    }
  };

  const loadData = React.useCallback(async () => {
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
  }, [activeTab]);


  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const filteredData = getCurrentData().filter((item: DashboardItem) => {
    const searchFields = getSearchFields(item);
    return searchFields.some(field => 
      field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreate = () => {
  setModalType('create');

  if (activeTab === 'startups') {
      setSelectedItem({
        name: '',
        sector: '',
        project_status: 'pending',
        maturity: '',
        email: '',
        founders: [],
        legal_status: '',
        address: '',
        phone: '',
        created_at: '',
        description: '',
        website_url: '',
        social_media_url: '',
        needs: '',
        id: undefined,
      } as Partial<Startup>);
    } else if (activeTab === 'events') {
      setSelectedItem({
        name: '',
        event_type: '',
        dates: '',
        location: '',
        id: undefined,
      } as Partial<Event>);
    } else if (activeTab === 'news') {
      setSelectedItem({
        title: '',
        category: '',
        news_date: '',
        location: '',
        description: '',
        id: undefined,
      } as Partial<NewsItem>);
    } else if (activeTab === 'users') {
      setSelectedItem({
        name: '',
        email: '',
        role: 'investor',
        founder_id: undefined,
        investor_id: undefined,
        id: undefined,
      } as Partial<User>);
    } else if (activeTab === 'investors') {
      setSelectedItem({
        name: '',
        company: '',
        role: '',
        email: '',
        id: undefined,
      } as Partial<Investor>);
    }

    setShowModal(true);
  };


  const handleEdit = (item: DashboardItem) => {
    setModalType('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleView = (item: DashboardItem) => {
    setModalType('view');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (item: DashboardItem) => {
    const itemName = 'name' in item ? item.name : 'title' in item ? item.title : 'élément';

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${itemName}" ?`)) return;

    try {
      let success = false;

      if (activeTab === 'startups' && 'id' in item) {
        success = await deleteStartup(item.id);
      } else if (activeTab === 'events' && 'id' in item) {
        success = await deleteEvent(item.id);
      } else if (activeTab === 'news' && 'id' in item) {
        success = await deleteNews(item.id);
      } else if (activeTab === 'users' && 'id' in item) {
        success = await deleteUser(item.id);
      }

      if (success) {
        alert(
          `${
            activeTab === 'startups'
              ? 'Startup'
              : activeTab === 'events'
              ? 'Événement'
              : 'Actualité'
          } supprimé(e) avec succès`
        );
        loadData();
      } else {
        alert(
          `Impossible de supprimer ${
            activeTab === 'startups'
              ? 'la startup'
              : activeTab === 'events'
              ? "l’événement"
              : "l’actualité"
          }`
        );
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Gérez vos données d&apos;incubateur</p>
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
                  {filteredData.map((item: DashboardItem, index) => (
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
          setItem={setSelectedItem}
          onClose={() => setShowModal(false)}
          onSave={async () => {
            try {
              if (activeTab === 'startups') {
                const { id, ...payload } = selectedItem;
                if (modalType === 'create') await createStartup(payload);
                else if (modalType === 'edit') await updateStartup(id, payload);
              } else if (activeTab === 'events') {
                const { id, ...payload } = selectedItem;
                if (modalType === 'create') await createEvent(payload);
                else if (modalType === 'edit') await updateEvent(id, payload);
              } else if (activeTab === 'news') {
                const { id, ...payload } = selectedItem;
                if (modalType === 'create') await createNews(payload);
                else if (modalType === 'edit') await updateNews(id, payload);
              } else if (activeTab === 'users') {
                const { id, ...payload } = selectedItem;
                if (modalType === 'create') await createUser(payload);
                else if (modalType === 'edit') await updateUser(id, payload);
              }

              setShowModal(false);
              loadData();
            } catch (err) {
              console.error('Erreur lors de la sauvegarde:', err);
            }
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
  setItem,
  onClose,
  onSave,
}: {
  type: 'create' | 'edit' | 'view';
  entityType: EntityType;
  item: Partial<DashboardItem>;
  setItem: React.Dispatch<React.SetStateAction<Partial<DashboardItem>>>;
  onClose: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {type === 'create' ? 'Créer' : type === 'edit' ? 'Modifier' : 'Voir'} {entityType}
        </h2>
        {type !== 'view' ? (
          <form className="space-y-2">
            {Object.keys(item).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-600">{key}</label>
                <input
                  type="text"
                  value={item[key] ?? ''}
                  onChange={(e) =>
                    setItem({ ...item, [key]: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                />
              </div>
            ))}
          </form>
        ) : (
          <pre className="text-xs bg-gray-100 p-2 rounded mb-4">
            {JSON.stringify(item, null, 2)}
          </pre>
        )}
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
