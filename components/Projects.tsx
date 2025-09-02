import Link from "next/link";
import { getStartups } from "../app/requests/startups";

export default async function Projects() {
    const startups = await getStartups();
    const displayedStartups = startups.slice(0, 6);

    return (
        <div className="flex w-full flex-col items-center mb-30 gap-10 px-6 md:px-12 lg:px-20" id="projects">
            <div className="flex flex-col gap-5 text-left md:text-center">
                <h1 className="text-3xl font-medium leading-tight text-white">
                        Some featured projects
                    </h1>
                <p className="text-lg text-gray-300 max-w-2xl">
                    Explore our curated selection of projects. Discover innovative startups, meet their founders, and stay updated on their latest achievements.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[85rem]">
                <div>
                    {displayedStartups[0].name}
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg" />
                </div>
                
            </div>
            <Link
                href="/projects"
                className="px-6 py-3 text-sm font-medium rounded-md bg-orange-400/30 hover:bg-orange-400/50 transition text-orange-400">
                    See all projects
            </Link>
        </div>
    );
}