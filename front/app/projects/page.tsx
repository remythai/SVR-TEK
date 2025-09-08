import Link from "next/link";
import { getStartups } from "../requests/startups";
import FilterForm from "@/components/FilterForm";
import SearchBar from "@/components/SearchBar";
import { Building } from "lucide-react";

interface Startup {
  id: number;
  name: string;
  sector: string;
  maturity: string;
  description?: string;
  address?: string;
  project_status?: string;
  legal_status?: string;
  location?: string;
}

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const allStartups: Startup[] = await getStartups();
  
  // Await searchParams before using it
  const resolvedSearchParams = await searchParams;

  const params: Record<string, string> = {};
  if (resolvedSearchParams) {
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params[key] = value[0];
      } else if (typeof value === "string") {
        params[key] = value;
      }
    });
  }

  let filteredStartups = allStartups;

  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredStartups = filteredStartups.filter(
      (startup) =>
        startup.name.toLowerCase().includes(searchTerm) ||
        startup.sector.toLowerCase().includes(searchTerm) ||
        (startup.description?.toLowerCase().includes(searchTerm) ?? false)
    );
  }

  ["sector", "maturity", "project_status", "legal_status", "address"].forEach((key) => {
    const value = params[key];
    if (value) {
      filteredStartups = filteredStartups.filter((startup) =>
        (startup[key as keyof Startup] as string | undefined)
          ?.toLowerCase()
          .includes(value.toLowerCase()) ?? false
      );
    }
  });

  return (
    <div className="w-full min-h-screen px-6 md:px-12 lg:px-20 flex flex-col items-center">
      <div className="flex justify-between w-full items-left md:items-center gap-6 mt-30 max-w-[85rem] custom-max-1170">
        <FilterForm
          currentFilters={{
            sector: params.sector || "",
            maturity: params.maturity || "",
            location: params.address || "",
            project_status: params.project_status || "",
            legal_status: params.legal_status || "",
          }}
        />
        <SearchBar />
      </div>

      <div className="pt-6 w-full max-w-[85rem]">
        <p className="text-sm text-gray-600">
          {filteredStartups.length} startup{filteredStartups.length > 1 ? "s" : ""} found
          {params.search && <span> pour &quot;{params.search}&quot;</span>}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 pt-6 max-w-[85rem]">
        {filteredStartups.map((startup) => (
          <Link
            href={`/projects/${startup.id}`}
            key={startup.id}
            className="relative flex flex-col border border-secondary-200 shadow-sm rounded-lg w-full md:w-[430px] p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center mb-4">
              <Building />
              <h5 className="ml-3 text-slate-800 text-xl font-semibold">{startup.name}</h5>
            </div>
            <p className="block text-slate-600 leading-normal font-light mb-4">
              {startup.name} — {startup.sector} — {startup.maturity}
              <br />
              {startup.project_status} | {startup.legal_status}
              <br />
              {startup.address}
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