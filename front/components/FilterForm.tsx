'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterFormProps {
  currentFilters: {
    sector: string;
    maturity: string;
    location: string;
  };
}

export default function FilterForm({ currentFilters }: FilterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }

    router.push(`?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Filtre Secteur */}
      <div className="relative">
        <select
          value={currentFilters.sector}
          onChange={(e) => handleFilterChange('sector', e.target.value)}
          className="appearance-none bg-white border border-secondary-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        >
          <option value="">Tous les secteurs</option>
          <option value="fintech">Fintech</option>
          <option value="healthtech">Healthtech</option>
          <option value="edtech">Edtech</option>
          <option value="saas">SaaS</option>
          <option value="ecommerce">E-commerce</option>
          <option value="mobility">Mobilité</option>
        </select>
        <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Filtre Maturité */}
      <div className="relative">
        <select
          value={currentFilters.maturity}
          onChange={(e) => handleFilterChange('maturity', e.target.value)}
          className="appearance-none bg-white border border-secondary-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        >
          <option value="">Toutes les maturités</option>
          <option value="seed">Seed</option>
          <option value="series-a">Series A</option>
          <option value="series-b">Series B</option>
          <option value="series-c">Series C</option>
          <option value="growth">Growth</option>
        </select>
        <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Filtre Localisation */}
      <div className="relative">
        <select
          value={currentFilters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="appearance-none bg-white border border-secondary-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        >
          <option value="">Toutes les localisations</option>
          <option value="paris">Paris</option>
          <option value="lyon">Lyon</option>
          <option value="marseille">Marseille</option>
          <option value="toulouse">Toulouse</option>
          <option value="bordeaux">Bordeaux</option>
          <option value="lille">Lille</option>
        </select>
        <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Bouton Reset */}
      {(currentFilters.sector || currentFilters.maturity || currentFilters.location) && (
        <button
          onClick={resetFilters}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}