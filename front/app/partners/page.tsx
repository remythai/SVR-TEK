import { getPartners, Partner } from "@/app/requests/partners";
import Link from "next/link";
import { Building2, MapPin, Mail, Phone, Calendar, Tag } from "lucide-react";

export default async function Partners() {
    const partners = await getPartners();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short'
        });
    };

    const getPartnershipTypeColor = (type: string) => {
        const colors = {
            'strategic': 'bg-blue-100 text-blue-800',
            'commercial': 'bg-green-100 text-green-800',
            'technology': 'bg-purple-100 text-purple-800',
            'financial': 'bg-orange-100 text-orange-800',
            'default': 'bg-gray-100 text-gray-800'
        };
        return colors[type.toLowerCase() as keyof typeof colors] || colors.default;
    };

    const getLegalStatusColor = (status: string) => {
        const colors = {
            'sarl': 'bg-emerald-100 text-emerald-700',
            'sa': 'bg-blue-100 text-blue-700',
            'sas': 'bg-indigo-100 text-indigo-700',
            'eurl': 'bg-cyan-100 text-cyan-700',
            'default': 'bg-slate-100 text-slate-700'
        };
        return colors[status.toLowerCase() as keyof typeof colors] || colors.default;
    };

    return (
        <div className="flex w-full flex-col items-center mb-30 gap-10 px-6 md:px-12 lg:px-20 mt-30" id="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-6 max-w-7xl w-full">
                {partners.map((partner: Partner) => (
                    <Link
                        href={`/partners/${partner.id}`}
                        key={partner.id}
                        className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-secondary-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-secondary-50 rounded-lg mr-3">
                                    <Building2 className="h-5 w-5 text-secondary-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-secondary-600 transition-colors">
                                        {partner.name}
                                    </h3>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLegalStatusColor(partner.legal_status)}`}>
                                        {partner.legal_status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPartnershipTypeColor(partner.partnership_type)}`}>
                                <Tag className="h-3 w-3 mr-1" />
                                {partner.partnership_type}
                            </span>
                        </div>

                        {partner.description && (
                            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                {partner.description}
                            </p>
                        )}

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-slate-500 text-sm">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{partner.address}</span>
                            </div>
                            <div className="flex items-center text-slate-500 text-sm">
                                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{partner.email}</span>
                            </div>
                            <div className="flex items-center text-slate-500 text-sm">
                                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{partner.phone}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center text-slate-400 text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                Partners since {formatDate(partner.created_at)}
                            </div>
                            <div className="flex items-center text-secondary-600 text-sm font-medium group-hover:text-secondary-700">
                                Learn more
                                <svg
                                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary-500/0 to-secondary-600/0 group-hover:from-secondary-500/5 group-hover:to-secondary-600/5 transition-all duration-300 pointer-events-none"></div>
                    </Link>
                ))}
            </div>
        </div>
    );
}