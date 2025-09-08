"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Building, Mail, Phone, Globe, Users } from 'lucide-react';
import { createStartup } from '@/app/requests/startups';

interface Founder {
    name: string;
    role: string;
}

interface StartupFormData {
    name: string;
    legal_status: string;
    address: string;
    email: string;
    phone: string;
    created_at: string;
    description: string;
    website_url: string;
    social_media_url: string;
    project_status: string;
    needs: string;
    sector: string;
    maturity: string;
    founders: Founder[];
}

export default function Startup() {
  const [formData, setFormData] = useState<StartupFormData>({
    name: '',
    legal_status: '',
    address: '',
    email: '',
    phone: '',
    created_at: new Date().toISOString().split('T')[0],
    description: '',
    website_url: '',
    social_media_url: '',
    project_status: '',
    needs: '',
    sector: '',
    maturity: '',
    founders: [{ name: '', role: '' }]
  });

const [isSubmitting, setIsSubmitting] = useState(false);

const handleInputChange = (field: keyof StartupFormData, value: string) => {
    setFormData(prev => ({
        ...prev,
        [field]: value
    }));
};

  const handleFounderChange = (index: number, field: keyof Founder, value: string) => {
    setFormData(prev => ({
      ...prev,
      founders: prev.founders.map((founder, i) =>
        i === index ? { ...founder, [field]: value } : founder
      )
    }));
  };

  const addFounder = () => {
    setFormData(prev => ({
      ...prev,
      founders: [...prev.founders, { name: '', role: '' }]
    }));
  };

  const removeFounder = (index: number) => {
    if (formData.founders.length > 1) {
      setFormData(prev => ({
        ...prev,
        founders: prev.founders.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    const requiredFields = [
      { field: formData.name, name: `Startup's name` },
      { field: formData.legal_status, name: 'Legal status' },
      { field: formData.address, name: 'Address' },
      { field: formData.email, name: 'Email' },
      { field: formData.phone, name: 'Phone' },
      { field: formData.description, name: 'Description' },
      { field: formData.sector, name: 'Business sector' },
      { field: formData.project_status, name: 'Project status' },
      { field: formData.maturity, name: 'Maturity' },
      { field: formData.needs, name: 'Needs' }
    ];

    const missingFields = requiredFields.filter(({ field }) => !field || field.trim() === '');
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields:\n• ${missingFields.map(f => f.name).join('\n• ')}`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Founders validation
    const validFounders = formData.founders.filter(f => f.name.trim() && f.role.trim());
    if (validFounders.length === 0) {
      alert('At least one founder with complete name and role is required.');
      return;
    }

    // URL validation
    const urlFields = [
      { field: formData.website_url, name: 'Website' },
      { field: formData.social_media_url, name: 'Social media' }
    ];
    for (const { field, name } of urlFields) {
      if (field && field.trim() !== '') {
        const trimmedUrl = field.trim();
        try {
          if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
            alert(`The URL for "${name}" must start with http:// or https://`);
            return;
          }
          new URL(trimmedUrl);
        } catch {
          alert(`The URL for "${name}" is not valid.`);
          return;
        }
      }
    }

    // Payload
    const payload = {
      ...formData,
      name: formData.name.trim(),
      address: formData.address.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      founders: validFounders.map(f => ({ name: f.name.trim(), role: f.role.trim() })),
      website_url: formData.website_url?.trim() || null,
      social_media_url: formData.social_media_url?.trim() || null,
      created_at: formData.created_at.trim()
    };

    const result = await createStartup(payload);

    if (!result) throw new Error('No response received from server');

    alert('Your startup has been successfully registered!');

    setFormData({
      name: '',
      legal_status: '',
      address: '',
      email: '',
      phone: '',
      created_at: new Date().toISOString().split('T')[0],
      description: '',
      website_url: '',
      social_media_url: '',
      project_status: '',
      needs: '',
      sector: '',
      maturity: '',
      founders: [{ name: '', role: '' }]
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error: unknown) {
      console.error('Error during registration:', error);
      let message = 'An error occurred during registration.';
      if (error instanceof Error) message = error.message;
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectorOptions = [
    'Deeptech', 'FinTech', 'Logistics', 'Saas', 'HealthTech',
    'EdTech', 'Sustainability'
  ];

  const maturityOptions = [
    'Idea', 'Prototype', 'MVP', 'Product-Market fit'
  ];

  const projectStatusOptions = [
    'Growth', 'Early Stage', 'Seed', 'Scale-up'
  ]

  const legalStatusOptions = [
    'SAS', 'GmbH', 'SpA', 'Oy'
  ]

  return (
    <div className="min-h-screen py-12 px-4 mt-30">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-400 to-purple-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building className="w-8 h-8" />
              Startup Registration
            </h1>
            <p className="text-pink-100 mt-2">
              Join the JEB Incubator ecosystem and bring your project to life
            </p>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-pink-400" />
                General Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    placeholder="Your startup name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    placeholder="Complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    placeholder="contact@startup.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    placeholder="+1 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creation Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.created_at}
                    onChange={(e) => handleInputChange('created_at', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    placeholder="https://www.startup.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </label>
                  <input
                    type="url"
                    value={formData.social_media_url}
                    onChange={(e) => handleInputChange('social_media_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/company/startup"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Project Description
              </h2>
              <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Sector *
                    </label>
                    <select
                      required
                      value={formData.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    >
                      <option value="">Select a sector</option>
                      {sectorOptions.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maturity *
                    </label>
                    <select
                      required
                      value={formData.maturity}
                      onChange={(e) => handleInputChange('maturity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    >
                      <option value="">Select a maturity level</option>
                      {maturityOptions.map(maturity => (
                        <option key={maturity} value={maturity}>{maturity}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project status *
                    </label>
                    <select
                      required
                      value={formData.project_status}
                      onChange={(e) => handleInputChange('project_status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    >
                      <option value="">Select the project status</option>
                      {projectStatusOptions.map(project_status => (
                        <option key={project_status} value={project_status}>{project_status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Legal status *
                    </label>
                    <select
                      required
                      value={formData.legal_status}
                      onChange={(e) => handleInputChange('legal_status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    >
                      <option value="">Select the legal status</option>
                      {legalStatusOptions.map(legal_status => (
                        <option key={legal_status} value={legal_status}>{legal_status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your startup, your mission and vision..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Needs *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.needs}
                    onChange={(e) => handleInputChange('needs', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
                    placeholder="What are your needs? (funding, support, network, etc.)"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-pink-400" />
                Founders
              </h2>
              <div className="space-y-4">
                {formData.founders.map((founder, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        Founder {index + 1}
                      </h3>
                      {formData.founders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFounder(index)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={founder.name}
                          onChange={(e) => handleFounderChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                          placeholder="First and last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role *
                        </label>
                        <input
                          type="text"
                          required
                          value={founder.role}
                          onChange={(e) => handleFounderChange(index, 'role', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                          placeholder="CEO, CTO, CMO..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFounder}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-400 hover:text-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add a founder
                </button>
              </div>
            </section>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-pink-500 hover:to-purple-600 focus:ring-4 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registration in progress...
                  </>
                ) : (
                  <>
                    <Building className="w-5 h-5" />
                    Register my startup
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}