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
      { field: formData.name, name: 'Nom de la startup' },
      { field: formData.legal_status, name: 'Statut juridique' },
      { field: formData.address, name: 'Adresse' },
      { field: formData.email, name: 'Email' },
      { field: formData.phone, name: 'Téléphone' },
      { field: formData.description, name: 'Description' },
      { field: formData.sector, name: 'Secteur d\'activité' },
      { field: formData.project_status, name: 'Statut du projet' },
      { field: formData.maturity, name: 'Maturité' },
      { field: formData.needs, name: 'Besoins' }
    ];

    const missingFields = requiredFields.filter(({ field }) => !field || field.trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Merci de remplir les champs obligatoires suivants :\n• ${missingFields.map(f => f.name).join('\n• ')}`);
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Veuillez saisir une adresse email valide.');
      setIsSubmitting(false);
      return;
    }

    const validFounders = formData.founders.filter(f => f.name && f.name.trim() !== '' && f.role && f.role.trim() !== '');
    
    if (validFounders.length === 0) {
      alert('Au moins un fondateur avec nom et rôle complets est requis.');
      setIsSubmitting(false);
      return;
    }

    const urlFields = [
      { field: formData.website_url, name: 'Site web' },
      { field: formData.social_media_url, name: 'Réseaux sociaux' }
    ];

    for (const { field, name } of urlFields) {
      if (field && field.trim() !== '') {
        const trimmedUrl = field.trim();
        try {
          if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
            alert(`L'URL du champ "${name}" doit commencer par http:// ou https://\nExemple: https://www.monsite.com`);
            setIsSubmitting(false);
            return;
          }
          new URL(trimmedUrl);
        } catch {
          alert(`L'URL du champ "${name}" n'est pas valide.\nVérifiez le format: https://www.exemple.com`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    const payload = {
      name: formData.name.trim(),
      legal_status: formData.legal_status,
      address: formData.address.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      created_at: formData.created_at || null,
      description: formData.description.trim(),
      website_url: formData.website_url && formData.website_url.trim() !== '' 
        ? formData.website_url.trim() 
        : null,
      social_media_url: formData.social_media_url && formData.social_media_url.trim() !== '' 
        ? formData.social_media_url.trim() 
        : null,
      project_status: formData.project_status,
      needs: formData.needs.trim(),
      sector: formData.sector,
      maturity: formData.maturity,
      founders: validFounders.map(founder => ({
        name: founder.name.trim(),
        role: founder.role.trim()
      }))
    };

    console.log('Payload à envoyer:', payload);

    const result = await createStartup(payload);

    if (!result) {
      throw new Error('Aucune réponse reçue du serveur');
    }

    console.log('Startup créée avec succès:', result);

    alert('Votre startup a été enregistrée avec succès !\n\nVous allez être contacté prochainement par notre équipe.');

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

    // Optionnel : scroll vers le haut après succès
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement:', error);
    
    // Gestion d'erreurs plus détaillée
    let errorMessage = 'Une erreur est survenue lors de l\'enregistrement.';
    
    if (error.response) {
      // Erreur de réponse du serveur
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
          if (data?.error) {
            errorMessage += `\nDétail: ${data.error}`;
          }
          break;
        case 401:
          errorMessage = 'Erreur d\'authentification. Veuillez recharger la page.';
          break;
        case 409:
          errorMessage = 'Une startup avec ce nom ou cet email existe déjà.';
          break;
        case 422:
          errorMessage = 'Données incorrectes. Vérifiez le format de vos informations.';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur. Veuillez réessayer dans quelques minutes.';
          break;
        default:
          errorMessage = `Erreur serveur (${status}). Veuillez réessayer.`;
      }
    } else if (error.request) {
      errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
    } else if (error.message) {
      errorMessage = `Erreur: ${error.message}`;
    }
    
    alert(`${errorMessage}\n\nSi le problème persiste, contactez notre support technique.`);
    
  } finally {
    setIsSubmitting(false);
  }
};

  const legalStatusOptions = [
    'SAS', 'SARL', 'SA', 'SNC', 'Auto-entrepreneur', 'Association', 'Autre'
  ];

  const projectStatusOptions = [
    'Idée', 'Prototype', 'MVP', 'Beta', 'Production', 'Croissance'
  ];

  const maturityOptions = [
    'Pré-seed', 'Seed', 'Série A', 'Série B', 'Série C+', 'Non applicable'
  ];

  const sectorOptions = [
    'Technologie', 'Santé', 'Finance', 'E-commerce', 'Éducation', 
    'Environnement', 'Transport', 'Immobilier', 'Autre'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Building className="w-8 h-8" />
              Inscription de Startup
            </h1>
            <p className="text-blue-100 mt-2">
              Rejoignez l&apo;écosystème JEB Incubator et donnez vie à votre projet
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Informations générales */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-blue-600" />
                Informations générales
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la startup *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nom de votre startup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut juridique *
                  </label>
                  <select
                    required
                    value={formData.legal_status}
                    onChange={(e) => handleInputChange('legal_status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Sélectionnez un statut</option>
                    {legalStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Adresse complète"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="contact@startup.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de création *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.created_at}
                    onChange={(e) => handleInputChange('created_at', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Site web
                  </label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://www.startup.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réseaux sociaux
                  </label>
                  <input
                    type="url"
                    value={formData.social_media_url}
                    onChange={(e) => handleInputChange('social_media_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/company/startup"
                  />
                </div>
              </div>
            </section>

            {/* Description du projet */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Description du projet
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Décrivez votre startup, votre mission et votre vision..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur d'activité *
                    </label>
                    <select
                      required
                      value={formData.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez un secteur</option>
                      {sectorOptions.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut du projet *
                    </label>
                    <select
                      required
                      value={formData.project_status}
                      onChange={(e) => handleInputChange('project_status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez un statut</option>
                      {projectStatusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maturité *
                    </label>
                    <select
                      required
                      value={formData.maturity}
                      onChange={(e) => handleInputChange('maturity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez une maturité</option>
                      {maturityOptions.map(maturity => (
                        <option key={maturity} value={maturity}>{maturity}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Besoins *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.needs}
                    onChange={(e) => handleInputChange('needs', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Quels sont vos besoins ? (financement, accompagnement, réseau, etc.)"
                  />
                </div>
              </div>
            </section>

            {/* Fondateurs */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Fondateurs
              </h2>
              
              <div className="space-y-4">
                {formData.founders.map((founder, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        Fondateur {index + 1}
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
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={founder.name}
                          onChange={(e) => handleFounderChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Nom et prénom"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle *
                        </label>
                        <input
                          type="text"
                          required
                          value={founder.role}
                          onChange={(e) => handleFounderChange(index, 'role', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="CEO, CTO, CMO..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addFounder}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un fondateur
                </button>
              </div>
            </section>

            {/* Bouton de soumission */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <Building className="w-5 h-5" />
                    Inscrire ma startup
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
