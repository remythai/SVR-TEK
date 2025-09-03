import Link from "next/link";
import { getStartups, getFounderImage } from "../requests/startups";
import FilterForm from "@/components/FilterForm";
import SearchBar from "@/components/SearchBar";

interface SearchParams {
  sector?: string;
  maturity?: string;
  location?: string;
  search?: string;
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
    const allStartups = await getStartups();

    let filteredStartups = allStartups;

    if (searchParams.search) {
        const searchTerm = searchParams.search.toLowerCase();
        filteredStartups = filteredStartups.filter(startup =>
            startup.name?.toLowerCase().includes(searchTerm) ||
            startup.sector?.toLowerCase().includes(searchTerm) ||
            startup.description?.toLowerCase().includes(searchTerm)
        );
    }

    // secteur
    if (searchParams.sector) {
        filteredStartups = filteredStartups.filter(startup =>
            startup.sector?.toLowerCase().includes(searchParams.sector!.toLowerCase())
        );
    }

    // maturité
    if (searchParams.maturity) {
        filteredStartups = filteredStartups.filter(startup =>
            startup.maturity?.toLowerCase().includes(searchParams.maturity!.toLowerCase())
        );
    }

    // localisation
    if (searchParams.location) {
        filteredStartups = filteredStartups.filter(startup =>
            startup.location?.toLowerCase().includes(searchParams.location!.toLowerCase())
        );
    }

  return (
    <div className="w-full min-h-screen p-10 flex flex-col items-center">
        
      <div className="flex justify-between w-full items-left md:items-center gap-6 mt-30 max-w-[85rem] custom-max-1170">
        <FilterForm 
          currentFilters={{
            sector: searchParams.sector || '',
            maturity: searchParams.maturity || '',
            location: searchParams.location || ''
          }}
        />

        <SearchBar />
      </div>

      <div className="pt-6 w-full max-w-[85rem]">
        <p className="text-sm text-gray-600">
          {filteredStartups.length} startup{filteredStartups.length > 1 ? 's' : ''} trouvée{filteredStartups.length > 1 ? 's' : ''}
          {searchParams.search && (
            <span> pour "{searchParams.search}"</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 pt-6 max-w-[85rem]">
        {await Promise.all(
          filteredStartups.map(async (startup: any) => {
            let image = null;

            if (startup.founders && startup.founders.length > 0) {
              const founderId = startup.founders[0].id;
              image = await getFounderImage(startup.id, founderId);
            }

            if (!image) {
              image =
                "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=600&h=400&auto=format&fit=crop&q=60";
            }

            return (
              <Link
                href="#"
                key={startup.id}
                className="md:max-w-[315px] w-full hover:-translate-y-0.5 transition duration-300 bg-white rounded-xl shadow-md flex flex-col overflow-hidden"
              >
                <img
                  className="w-full h-48 object-cover"
                  src={image}
                  alt={startup.name}
                />
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-base text-gray-900 font-medium">
                    {startup.name}
                  </h3>
                  <p className="text-xs text-indigo-600 font-medium">
                    {startup.sector}
                  </p>
                  {startup.location && (
                    <p className="text-xs text-gray-500">
                      📍 {startup.location}
                    </p>
                  )}
                  {startup.maturity && (
                    <p className="text-xs text-gray-500">
                      🚀 {startup.maturity}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}