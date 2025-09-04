import { getStartup, getFounderImage } from "@/app/requests/startups";
import Image from "next/image";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getStartup(params.id);

  if (!project) {
    return <div className="p-10">Projet introuvable</div>;
  }

  const founderImages: Record<number, string> = {};
  if (project.founders && project.founders.length > 0) {
    await Promise.all(
      project.founders.map(async (founder) => {
        const img = await getFounderImage(project.id.toString(), founder.id.toString());
        if (img) founderImages[founder.id] = img;
      })
    );
  }

  return (
    <div className="w-full min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="mt-6 max-w-2xl">{project.legal_status}</p>
      <p className="mt-6 max-w-2xl">{project.address}</p>
      <p className="mt-6 max-w-2xl">{project.email}</p>
      <p className="mt-6 max-w-2xl">{project.phone}</p>
      <p className="mt-6 max-w-2xl">{project.created_at}</p>
      <p className="mt-6 max-w-2xl">{project.description}</p>
      <p className="mt-6 max-w-2xl">{project.website_url}</p>
      <p className="mt-6 max-w-2xl">{project.social_media_url}</p>
      <p className="mt-6 max-w-2xl">{project.project_status}</p>
      <p className="mt-6 max-w-2xl">{project.needs}</p>
      <p className="mt-6 max-w-2xl">{project.sector}</p>
      <p className="mt-6 max-w-2xl">{project.maturity}</p>

      {project.founders && project.founders.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {project.founders.map((founder) => (
            <div key={founder.id} className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                {founderImages[founder.id] ? (
                  <Image
                    src={founderImages[founder.id]}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-white">
                    {founder.name.charAt(0)}
                  </div>
                )}
              </div>
              <h4 className="text-xl font-bold">{founder.name}</h4>
              {founder.role && <p className="text-purple-600">{founder.role}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
