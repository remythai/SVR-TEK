import { getStartup, getFounderImage } from "@/app/requests/startups";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Calendar, Users, Target, Building2, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  const project = await getStartup(id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-purple-100">
          <AlertCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
          <p className="text-gray-600 mt-2">The project you are looking for does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const founderImages: Record<number, string> = {};
  if (project.founders && project.founders.length > 0) {
    await Promise.all(
      project.founders.map(async (founder) => {
        if (!project.id || !founder.id) {
          console.warn("Founder without id:", founder);
          return;
        }

        const img = await getFounderImage(
          project.id.toString(),
          founder.id.toString()
        );

        if (img) founderImages[founder.id] = img;
      })
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="mt-30 bg-gradient-to-r from-secondary-300 to-primary-300 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10"></div>
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{project.name}</h1>
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm justify-center">
            <Building2 className="w-5 h-5 text-secondary-100" />
            <span className="text-lg font-medium text-secondary-100">{project.legal_status}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Project&apos;s description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{project.description}</p>
              {project.needs && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-400" />
                    Needs
                  </h3>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                    <p className="text-gray-700">{project.needs}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                Contact
              </h3>
              <div className="space-y-4">
                {project.email && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <Link href={`mailto:${project.email}`} className="text-purple-600 hover:text-purple-700 transition-colors">
                      {project.email}
                    </Link>
                  </div>
                )}
                {project.phone && (
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <Phone className="w-4 h-4 text-pink-400" />
                    <Link href={`tel:${project.phone}`} className="text-pink-600 hover:text-pink-700 transition-colors">
                      {project.phone}
                    </Link>
                  </div>
                )}
                {project.address && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-purple-400 mt-1" />
                    <span className="text-gray-700">{project.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Links
              </h3>
              <div className="space-y-3">
                {project.website_url && (
                  <Link
                    href={project.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-200 group"
                  >
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700 group-hover:text-purple-800">Website</span>
                  </Link>
                )}
                {project.social_media_url && (
                  <Link
                    href={project.social_media_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg hover:from-pink-200 hover:to-purple-200 transition-all duration-200 group"
                  >
                    <Users className="w-4 h-4 text-pink-600" />
                    <span className="text-pink-700 group-hover:text-pink-800">Social links</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Project&apos;s specifications
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {project.sector && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <h4 className="font-semibold text-purple-700 mb-2">Sector</h4>
                <p className="text-gray-700">{project.sector}</p>
              </div>
            )}
            {project.maturity && (
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6">
                <h4 className="font-semibold text-pink-700 mb-2">Maturity</h4>
                <p className="text-gray-700">{project.maturity}</p>
              </div>
            )}
            {project.project_status && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <h4 className="font-semibold text-purple-700 mb-2">Status</h4>
                <p className="text-gray-700">{project.project_status}</p>
              </div>
            )}
            {project.created_at && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
                <h4 className="font-semibold text-pink-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created at
                </h4>
                <p className="text-gray-700">{new Date(project.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            )}
          </div>
        </div>

        {project.founders && project.founders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Fondators
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {project.founders.map((founder, index) => (
                <div key={founder.id ?? index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all duration-200">
                      {founder.id && founderImages[founder.id] ? (
                        <Image
                          src={founderImages[founder.id]}
                          alt={founder.name}
                          className="w-full h-full object-cover"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-4xl font-bold text-white">
                          {founder.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-800 mb-2">{founder.name}</h4>
                  {founder.role && (
                    <div className="inline-block">
                      <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {founder.role}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}