import Link from "next/link";
import { getStartups } from "../app/requests/startups";
import { Building } from "lucide-react";

export default async function Projects() {
    const startups = await getStartups();
    const displayedStartups = startups.slice(0, 6);

    return (
        <div className="flex w-full flex-col items-center mb-30 gap-10 px-6 md:px-12 lg:px-20" id="projects">
            <div className="flex flex-col gap-5 text-left md:text-center">
                <h1 className="text-3xl font-medium leading-tight text-secondary-100">
                        Some featured projects
                    </h1>
                <p className="text-lg max-w-2xl">
                    Explore our curated selection of projects. Discover innovative startups, meet their founders, and stay updated on their latest achievements.
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 pt-6 max-w-[85rem]">
                {displayedStartups.map((startup: any) => (
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
                            {startup.sector} • {startup.location} • {startup.maturity}
                        </p>
                        <div>
                            <p className="text-slate-800 font-semibold text-sm hover:underline flex items-center">
                                Learn More
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            <Link
                href="/projects"
                className="px-6 py-3 text-sm font-medium rounded-md bg-secondary-300 text-white hover:bg-secondary-200 transition-colors duration-300">
                    See all projects
            </Link>
        </div>
    );
}