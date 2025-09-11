'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Search } from 'lucide-react';

import { getStartups, createStartup, updateStartup, deleteStartup, Startup, CreateStartupPayload } from '../requests/startups';
import { getEvents, createEvent, updateEvent, deleteEvent, Event } from '../requests/events';
import { getNews, createNews, updateNews, deleteNews, NewsItem } from '../requests/news';
import { getUsers, createUser, updateUser, deleteUser, User } from '../requests/users';
import { getInvestors, Investor } from '../requests/investors';

type EntityType = 'startups' | 'events' | 'news' | 'users' | 'investors';
type DashboardItem = Startup | Event | NewsItem | User | Investor;

type CreateEventPayload = Omit<Event, 'id'>;
type CreateNewsPayload = Omit<NewsItem, 'id'>;
type CreateUserPayload = Omit<User, 'id'>;

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

  const [selectedItem, setSelectedItem] = useState<Partial<DashboardItem>>({});

  const getTableHeaders = (): string[] => {
    switch (activeTab) {
      case 'startups':
        return ['Name', 'Sector', 'Status', 'Maturity', 'Email', 'Fondators'];
      case 'events':
        return ['Name', 'Type', 'Date', 'Location'];
      case 'news':
        return ['Title', 'Category', 'Date', 'Location'];
      case 'users':
        return ['Name', 'Email', 'Role'];
      case 'investors':
        return ['Name', 'Enterprise', 'Role', 'Email'];
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
            user.role === 'investor' ? 'bg-blue-100 text-secondary-100' : 
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
        legal_status: '',
        address: '',
        phone: '',
        created_at: '',
        description: '',
        website_url: '',
        social_media_url: '',
        needs: '',
        founders: [], // Initialize with empty array
      } as Partial<Startup>);
    } else if (activeTab === 'events') {
      setSelectedItem({
        name: '',
        event_type: '',
        dates: '',
        location: '',
      } as Partial<Event>);
    } else if (activeTab === 'news') {
      setSelectedItem({
        title: '',
        category: '',
        news_date: '',
        location: '',
        description: '',
      } as Partial<NewsItem>);
    } else if (activeTab === 'users') {
      setSelectedItem({
        name: '',
        email: '',
        role: 'investor',
        founder_id: undefined,
        investor_id: undefined,
      } as Partial<User>);
    } else if (activeTab === 'investors') {
      setSelectedItem({
        name: '',
        company: '',
        role: '',
        email: '',
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

      if (activeTab === 'startups' && 'id' in item && typeof item.id === 'number') {
        success = await deleteStartup(item.id);
      } else if (activeTab === 'events' && 'id' in item && typeof item.id === 'number') {
        success = await deleteEvent(item.id);
      } else if (activeTab === 'news' && 'id' in item && typeof item.id === 'number') {
        success = await deleteNews(item.id);
      } else if (activeTab === 'users' && 'id' in item && typeof item.id === 'number') {
        success = await deleteUser(item.id);
      }

      if (success) {
        alert(
          `${
            activeTab === 'startups'
              ? 'Startup'
              : activeTab === 'events'
              ? 'Événement'
              : activeTab === 'news'
              ? 'Actualité'
              : activeTab === 'users'
              ? 'Utilisateur'
              : 'Investisseur'
          } supprimé(e) avec succès`
        );
        loadData();
      } else {
        alert(
          `Impossible de supprimer ${
            activeTab === 'startups'
              ? 'la startup'
              : activeTab === 'events'
              ? "l'événement"
              : activeTab === 'news'
              ? "l'actualité"
              : activeTab === 'users'
              ? "l'utilisateur"
              : "l'investisseur"
          }`
        );
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const tabs = [
    { key: 'startups' as EntityType, label: 'Startups', count: startups.length },
    { key: 'events' as EntityType, label: 'Events', count: events.length },
    { key: 'news' as EntityType, label: 'News', count: news.length },
    { key: 'users' as EntityType, label: 'Users', count: users.length },
    { key: 'investors' as EntityType, label: 'Investors', count: investors.length },
  ];

  return (
    <div className="min-h-screen mt-30">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1>
              <p className="text-gray-600">Manage your incubator data</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-secondary-500 hover:bg-secondary-400 cursor-pointer text-secondary-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Create
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
                  ? 'border-secondary-100 text-secondary-100'
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
              placeholder={`Search ${tabs.find(t => t.key === activeTab)?.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-100"></div>
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
                            className="text-secondary-100 hover:text-secondary-200 p-1"
                            title="Voir"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-secondary-100 hover:text-secondary-200 p-1"
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
                <p className="text-gray-500">Nothing found</p>
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
                const startupItem = selectedItem as Partial<Startup>;
                const { id, founders, ...payload } = startupItem;
                
                // Transform founders to match API expectations
                const apiFounders = (founders || []).map(founder => ({
                  name: founder.name || '',
                  role: founder.role || 'Founder' // Provide default role if missing
                }));

                // Create the payload that matches CreateStartupPayload
                const compatiblePayload: CreateStartupPayload = {
                  name: payload.name || '',
                  legal_status: payload.legal_status || '',
                  address: payload.address || '',
                  email: payload.email || '',
                  phone: payload.phone || '',
                  created_at: payload.created_at || new Date().toISOString(),
                  description: payload.description || '',
                  website_url: payload.website_url || null,
                  social_media_url: payload.social_media_url || null,
                  project_status: payload.project_status || 'pending',
                  needs: payload.needs || '',
                  sector: payload.sector || '',
                  maturity: payload.maturity || '',
                  founders: apiFounders
                };
                
                if (modalType === 'create') {
                  await createStartup(compatiblePayload);
                } else if (modalType === 'edit' && typeof id === 'number') {
                  await updateStartup(compatiblePayload, id);
                }
              } else if (activeTab === 'events') {
                const eventItem = selectedItem as Partial<Event>;
                const { id, ...payload } = eventItem;
                
                if (modalType === 'create') {
                  await createEvent(payload as CreateEventPayload);
                } else if (modalType === 'edit' && typeof id === 'number') {
                  await updateEvent(payload as Event, id);
                }
              } else if (activeTab === 'news') {
                const newsItem = selectedItem as Partial<NewsItem>;
                const { id, ...payload } = newsItem;
                
                if (modalType === 'create') {
                  await createNews(payload as CreateNewsPayload);
                } else if (modalType === 'edit' && typeof id === 'number') {
                  await updateNews(id, payload as NewsItem);
                }
              } else if (activeTab === 'users') {
                const userItem = selectedItem as Partial<User>;
                const { id, ...payload } = userItem;
                
                if (modalType === 'create') {
                  await createUser(payload as CreateUserPayload);
                } else if (modalType === 'edit' && typeof id === 'number') {
                  await updateUser(id, payload as User);
                }
              }
              
              setShowModal(false);
              loadData();
            } catch (err) {
              console.error('Erreur lors de la sauvegarde:', err);
              alert('Erreur lors de la sauvegarde. Vérifiez la console pour plus de détails.');
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
  const getFormFields = () => {
    const fieldsToExclude = ['id', 'created_at', 'founders']; // Exclude complex and non-editable fields
    return Object.keys(item).filter(key => !fieldsToExclude.includes(key));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          {type === 'create' ? 'Create' : type === 'edit' ? 'Update' : 'View'} {entityType.slice(0, -1)}
        </h2>
        
        {type !== 'view' ? (
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {getFormFields().map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                {key === 'description' ? (
                  <textarea
                    value={String(item[key as keyof DashboardItem] ?? '')}
                    onChange={(e) =>
                      setItem({ ...item, [key]: e.target.value })
                    }
                    className="border rounded px-2 py-1 resize-vertical min-h-[80px]"
                    rows={3}
                  />
                ) : key === 'project_status' ? (
                  <select
                    value={String(item[key as keyof DashboardItem] ?? '')}
                    onChange={(e) =>
                      setItem({ ...item, [key]: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : key === 'role' && entityType === 'users' ? (
                  <select
                    value={String(item[key as keyof DashboardItem] ?? '')}
                    onChange={(e) =>
                      setItem({ ...item, [key]: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="investor">Investor</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                ) : (
                  <input
                    type={key.includes('email') ? 'email' : key.includes('date') ? 'datetime-local' : 'text'}
                    value={String(item[key as keyof DashboardItem] ?? '')}
                    onChange={(e) =>
                      setItem({ ...item, [key]: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                  />
                )}
              </div>
            ))}
          </form>
        ) : (
          <div className="space-y-2">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm text-gray-600 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-sm bg-gray-100 p-2 rounded">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || 'N/A')}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          {type !== 'view' && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-400 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};