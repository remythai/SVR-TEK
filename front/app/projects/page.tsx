import Link from "next/link";
import { getStartups } from "../requests/startups";
import FilterForm from "@/components/FilterForm";
import SearchBar from "@/components/SearchBar";
import { Building } from "lucide-react";

interface SearchParams {
  sector?: string;
  maturity?: string;
  location?: string;
  search?: string;
}

interface Startup {
  id: number;
  name: string;
  sector: string;
  location?: string;
  maturity: string;
  description?: string;
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const allStartups: Startup[] = await getStartups();

  const params = await searchParams;

  let filteredStartups = allStartups;

  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredStartups = filteredStartups.filter(
      (startup) =>
        startup.name?.toLowerCase().includes(searchTerm) ||
        startup.sector?.toLowerCase().includes(searchTerm) ||
        startup.description?.toLowerCase().includes(searchTerm)
    );
  }

  if (params.sector) {
    filteredStartups = filteredStartups.filter((startup) =>
      startup.sector?.toLowerCase().includes(params.sector!.toLowerCase())
    );
  }

  if (params.maturity) {
    filteredStartups = filteredStartups.filter((startup) =>
      startup.maturity?.toLowerCase().includes(params.maturity!.toLowerCase())
    );
  }

  if (params.location) {
    filteredStartups = filteredStartups.filter((startup) =>
      startup.location?.toLowerCase().includes(params.location!.toLowerCase())
    );
  }

  return (
    <div className="w-full min-h-screen p-10 flex flex-col items-center">
      <div className="flex justify-between w-full items-left md:items-center gap-6 mt-30 max-w-[85rem] custom-max-1170">
        <FilterForm
          currentFilters={{
            sector: params.sector || "",
            maturity: params.maturity || "",
            location: params.location || "",
          }}
        />

        <SearchBar />
      </div>

      <div className="pt-6 w-full max-w-[85rem]">
        <p className="text-sm text-gray-600">
          {filteredStartups.length} startup
          {filteredStartups.length > 1 ? "s" : ""} trouvée
          {filteredStartups.length > 1 ? "s" : ""}
          {params.search && <span> pour &quot;{params.search}&quot;</span>}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 pt-6 max-w-[85rem]">
        {filteredStartups.map((startup) => (
          <Link
            href={`/projects/${startup.id}`}
            key={startup.id}
            className="relative flex flex-col border border-secondary-200 shadow-sm rounded-lg w-[430px] p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center mb-4">
              <Building />
              <h5 className="ml-3 text-slate-800 text-xl font-semibold">
                {startup.name}
              </h5>
            </div>
            <p className="block text-slate-600 leading-normal font-light mb-4">
              {startup.name}
              {startup.sector}
              {startup.location}
              {startup.maturity}
            </p>
            <div>
              <p className="text-slate-800 font-semibold text-sm hover:underline flex items-center">
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
