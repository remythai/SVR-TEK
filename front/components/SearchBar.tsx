'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }

    router.push(`?${params.toString()}`);
  }, [searchTerm]);

  return (
    <form className="flex items-center border pl-4 gap-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden max-w-md w-full" onSubmit={(e) => e.preventDefault()}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#6B7280">
        <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
      </svg>
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-full outline-none text-sm text-gray-500"
        placeholder="Rechercher une startup..."
      />
    </form>
  );
}
