"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Building,
  TrendingUp,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

interface UserType {
  email: string;
  name: string;
  role: string;
  founder_id?: number | null;
  investor_id?: number | null;
  id: number;
}

interface Startup {
  id: number;
  name: string;
  description: string;
  industry: string;
  stage: string;
  employees: number;
}

export default function Account() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingStartup, setIsAddingStartup] = useState(false);
  const [editingStartupId, setEditingStartupId] = useState<number | null>(null);

  const initialUser: UserType = {
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
    role: "Founder",
    founder_id: 12345,
    investor_id: 0,
    id: 67890,
  };

  const [userData, setUserData] = useState<UserType>(initialUser);
  const [editData, setEditData] = useState<UserType>(initialUser);

  const [startups, setStartups] = useState<Startup[]>([
    {
      id: 1,
      name: "TechFlow AI",
      description: "AI-powered workflow automation platform",
      industry: "Artificial Intelligence",
      stage: "Series A",
      employees: 25,
    },
    {
      id: 2,
      name: "GreenTech Solutions",
      description: "Sustainable energy management system",
      industry: "Clean Energy",
      stage: "Seed",
      employees: 8,
    },
  ]);

  const [newStartup, setNewStartup] = useState<Omit<Startup, "id">>({
    name: "",
    description: "",
    industry: "",
    stage: "",
    employees: 0,
  });

  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditData(userData);
  };

  const handleSaveProfile = () => {
    setUserData(editData);
    setIsEditingProfile(false);
  };

  const handleCancelProfile = () => {
    setEditData(userData);
    setIsEditingProfile(false);
  };

  const handleProfileInputChange = (field: keyof UserType, value: string | number) => {
    setEditData((prev) => ({ ...prev, [field]: value } as UserType));
  };

  const handleAddStartup = () => {
    setIsAddingStartup(true);
    setNewStartup({
      name: "",
      description: "",
      industry: "",
      stage: "",
      employees: 0,
    });
  };

  const handleSaveNewStartup = () => {
    if (newStartup.name && newStartup.description) {
      const startup: Startup = {
        ...newStartup,
        id: Date.now(),
      };
      setStartups((prev) => [...prev, startup]);
      setIsAddingStartup(false);
    }
  };

  const handleEditStartup = (startup: Startup) => {
    setEditingStartupId(startup.id);
    setEditingStartup(startup);
  };

  const handleSaveStartup = () => {
    if (editingStartup && editingStartupId !== null) {
      setStartups((prev) =>
        prev.map((s) => (s.id === editingStartupId ? editingStartup : s))
      );
      setEditingStartupId(null);
      setEditingStartup(null);
    }
  };

  const handleDeleteStartup = (id: number) => {
    setStartups((prev) => prev.filter((s) => s.id !== id));
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "founder":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "investor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "seed":
        return "bg-green-100 text-green-800 border-green-200";
      case "series a":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "series b":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "series c":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white mt-30">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-12 h-12 text-secondary-100" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{userData.name}</h1>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                    userData.role
                  )} bg-opacity-90`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {userData.role}
                </div>
              </div>
            </div>

            {!isEditingProfile ? (
              <button
                onClick={handleEditProfile}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center space-x-2 text-secondary-100"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-white"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelProfile}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-white"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="w-5 h-5 mr-2 text-pink-500" />
                Profile Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleProfileInputChange("name", e.target.value)}
                      className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">{userData.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleProfileInputChange("email", e.target.value)}
                      className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-pink-500" />
                      {userData.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  {isEditingProfile ? (
                    <select
                      value={editData.role}
                      onChange={(e) => handleProfileInputChange("role", e.target.value)}
                      className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    >
                      <option value="Founder">Founder</option>
                      <option value="Investor">Investor</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  ) : (
                    <div className={`inline-flex items-center px-4 py-3 rounded-lg text-sm font-medium border ${getRoleColor(userData.role)}`}>
                      <Shield className="w-4 h-4 mr-2" />
                      {userData.role}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account ID</label>
                  <div className="text-lg font-mono text-gray-800">{userData.id}</div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founder ID</label>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="text-lg font-mono text-gray-800">{userData.founder_id || "Not assigned"}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investor ID</label>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-lg font-mono text-gray-800">{userData.investor_id || "Not assigned"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-500" />
                  My Startups
                </h2>
                <button
                  onClick={handleAddStartup}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Startup</span>
                </button>
              </div>

              {isAddingStartup && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Startup</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Startup Name"
                      value={newStartup.name}
                      onChange={(e) => setNewStartup((prev) => ({ ...prev, name: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Industry"
                      value={newStartup.industry}
                      onChange={(e) => setNewStartup((prev) => ({ ...prev, industry: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <select
                      value={newStartup.stage}
                      onChange={(e) => setNewStartup((prev) => ({ ...prev, stage: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Select Stage</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C">Series C</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Number of Employees"
                      value={newStartup.employees}
                      onChange={(e) => setNewStartup((prev) => ({ ...prev, employees: parseInt(e.target.value) || 0 }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <div className="md:col-span-2">
                      <textarea
                        placeholder="Description"
                        value={newStartup.description}
                        onChange={(e) => setNewStartup((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleSaveNewStartup}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Startup</span>
                    </button>
                    <button
                      onClick={() => setIsAddingStartup(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {startups.map((startup) => {
                  const isEditingThis = editingStartupId === startup.id;
                  // use editingStartup if present, otherwise fallback to original startup so TS knows values exist
                  const editingValues = isEditingThis ? editingStartup ?? startup : null;

                  return (
                    <div key={startup.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      {isEditingThis ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={editingValues!.name}
                              onChange={(e) => setEditingStartup((prev) => ({ ...(prev ?? startup), name: e.target.value }))}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                            <input
                              type="text"
                              value={editingValues!.industry}
                              onChange={(e) => setEditingStartup((prev) => ({ ...(prev ?? startup), industry: e.target.value }))}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                            <select
                              value={editingValues!.stage}
                              onChange={(e) => setEditingStartup((prev) => ({ ...(prev ?? startup), stage: e.target.value }))}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            >
                              <option value="Seed">Seed</option>
                              <option value="Series A">Series A</option>
                              <option value="Series B">Series B</option>
                              <option value="Series C">Series C</option>
                            </select>
                            <input
                              type="number"
                              value={editingValues!.employees}
                              onChange={(e) => setEditingStartup((prev) => ({ ...(prev ?? startup), employees: parseInt(e.target.value) || 0 }))}
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                            <div className="md:col-span-2">
                              <textarea
                                value={editingValues!.description}
                                onChange={(e) => setEditingStartup((prev) => ({ ...(prev ?? startup), description: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                                rows={3}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleSaveStartup}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingStartupId(null);
                                setEditingStartup(null);
                              }}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{startup.name}</h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditStartup(startup)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStartup(startup.id)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{startup.description}</p>

                          <div className="flex flex-wrap items-center gap-4">
                            <span className="text-sm text-gray-700">
                              <strong>Industry:</strong> {startup.industry}
                            </span>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(startup.stage)}`}>
                              {startup.stage}
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <Users className="w-4 h-4 mr-1 text-purple-500" />
                              {startup.employees} employees
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {startups.length === 0 && !isAddingStartup && (
                  <div className="text-center py-12 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No startups yet. Add your first startup to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
