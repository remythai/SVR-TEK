'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Fonction debounce custom (sans lodash)
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

const sectorOptions = [
  'DeepTech', 'FinTech', 'Logistics', 'SaaS', 'HealthTech',
  'EdTech', 'Sustainability'
];

const maturityOptions = [
  'Idea', 'Prototype', 'MVP', 'Product-Market fit'
];

const projectStatusOptions = [
  'Growth', 'Early Stage', 'Seed', 'Scale-up'
];

const legalStatusOptions = [
  'SAS', 'GmbH', 'SpA', 'Oy'
];

interface FilterFormProps {
  currentFilters: {
    sector: string;
    maturity: string;
    location: string;
    project_status?: string;
    legal_status?: string;
  };
}

export default function FilterForm({ currentFilters }: FilterFormProps) {
  const [localLocation, setLocalLocation] = useState(currentFilters.location);
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

  const debouncedLocationUpdate = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('location', value);
      } else {
        params.delete('location');
      }
      router.push(`?${params.toString()}`);
    }, 300),
    [searchParams]
  );

  useEffect(() => {
    debouncedLocationUpdate(localLocation);
  }, [localLocation, debouncedLocationUpdate]);

  useEffect(() => {
    setLocalLocation(currentFilters.location);
  }, [currentFilters.location]);

  const resetFilters = () => {
    router.push('/projects');
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative">
        <select
          value={currentFilters.sector}
          onChange={(e) => handleFilterChange('sector', e.target.value)}
          className="appearance-none bg-white border border-secondary-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        >
          <option value="">All sectors</option>
          {sectorOptions.map((sector) => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <select
          value={currentFilters.maturity}
          onChange={(e) => handleFilterChange('maturity', e.target.value)}
          className="appearance-none bg-white border border-secondary-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        >
          <option value="">Toutes les maturités</option>
          {maturityOptions.map((maturity) => (
            <option key={maturity} value={maturity}>{maturity}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <select
          value={currentFilters.project_status || ""}
          onChange={(e) => handleFilterChange('project_status', e.target.value)}
          className="appearance-none bg-white border border-secondary-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        >
          <option value="">All projects status</option>
          {projectStatusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <select
          value={currentFilters.legal_status || ""}
          onChange={(e) => handleFilterChange('legal_status', e.target.value)}
          className="appearance-none bg-white border border-secondary-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        >
          <option value="">All legal status</option>
          {legalStatusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search a location..."
          value={localLocation}
          onChange={(e) => setLocalLocation(e.target.value)}
          className="bg-white border border-secondary-300 rounded-full px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-100 focus:border-transparent"
        />
      </div>

      {(currentFilters.sector || currentFilters.maturity || currentFilters.location || currentFilters.project_status || currentFilters.legal_status) && (
        <button
          onClick={resetFilters}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset
        </button>
      )}
    </div>
  );
}