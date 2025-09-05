import { getPartner, Partner } from "@/app/requests/partners";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
    Building2,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Tag,
    ArrowLeft,
    Building,
    Users,
    Briefcase,
    TrendingUp
} from "lucide-react";

interface Props {
    params: {
        id: string;
    };
}

export default async function PartnerDetailPage({ params }: Props) {
    const { id } = await params;
    const partnerId = parseInt(id);

    if (isNaN(partnerId)) {
        notFound();
    }

    const partner = await getPartner(partnerId);

    if (!partner)
        notFound();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPartnershipTypeStyle = (type: string) => {
        const styles = {
            'strategic': { bg: 'var(--color-secondary-300)', text: 'white' },
            'commercial': { bg: 'var(--color-primary-200)', text: 'white' },
            'technology': { bg: 'var(--color-secondary-200)', text: 'white' },
            'financial': { bg: 'var(--color-primary-100)', text: 'white' },
            'default': { bg: 'var(--color-secondary-400)', text: 'white' }
        };
        return styles[type.toLowerCase() as keyof typeof styles] || styles.default;
    };

    const getLegalStatusStyle = (status: string) => {
        const styles = {
            'sarl': { bg: 'var(--color-primary-200)', text: 'white' },
            'sa': { bg: 'var(--color-secondary-300)', text: 'white' },
            'sas': { bg: 'var(--color-secondary-200)', text: 'white' },
            'eurl': { bg: 'var(--color-primary-100)', text: 'white' },
            'default': { bg: 'var(--color-secondary-400)', text: 'white' }
        };
        return styles[status.toLowerCase() as keyof typeof styles] || styles.default;
    };

    const partnershipTypeStyle = getPartnershipTypeStyle(partner.partnership_type);
    const legalStatusStyle = getLegalStatusStyle(partner.legal_status);

    return (
        <div className="min-h-screen bg-white mt-30">
            <div className="border-b" style={{ borderColor: 'var(--color-secondary-500)' }}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link
                        href="/partners"
                        className="inline-flex items-center text-sm font-medium transition-colors hover:opacity-70"
                        style={{ color: 'var(--color-secondary-200)' }}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Partners
                    </Link>
                </div>
            </div>

            <div className="relative bg-gradient-to-r" style={{ background: `linear-gradient(90deg, var(--color-secondary-100), var(--color-primary-100))` }}>
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="flex items-center gap-8">
                        <div
                            className="p-4 bg-white/10 backdrop-blur-sm border border-white/20"
                            style={{ borderRadius: '12px' }}
                        >
                            <Building2 className="h-12 w-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-4">
                                {partner.name}
                            </h1>
                            <div className="flex gap-4">
                                <span
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium"
                                    style={{
                                        backgroundColor: legalStatusStyle.bg,
                                        color: legalStatusStyle.text,
                                        borderRadius: '6px'
                                    }}
                                >
                                    <Building className="h-3 w-3 mr-2" />
                                    {partner.legal_status.toUpperCase()}
                                </span>
                                <span
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium"
                                    style={{
                                        backgroundColor: partnershipTypeStyle.bg,
                                        color: partnershipTypeStyle.text,
                                        borderRadius: '6px'
                                    }}
                                >
                                    <Briefcase className="h-3 w-3 mr-2" />
                                    {partner.partnership_type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {partner.description && (
                            <div className="bg-white border" style={{ borderColor: 'var(--color-secondary-500)', borderRadius: '8px' }}>
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div
                                            className="p-2 mr-4"
                                            style={{ backgroundColor: 'var(--color-secondary-500)', borderRadius: '6px' }}
                                        >
                                            <Users className="h-5 w-5" style={{ color: 'var(--color-secondary-100)' }} />
                                        </div>
                                        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-secondary-100)' }}>
                                            About
                                        </h2>
                                    </div>
                                    <p className="text-lg leading-relaxed" style={{ color: 'var(--color-secondary-200)' }}>
                                        {partner.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border p-6" style={{ borderColor: 'var(--color-secondary-500)', borderRadius: '8px' }}>
                                <div className="flex items-center mb-3">
                                    <Tag className="h-4 w-4 mr-3" style={{ color: 'var(--color-primary-200)' }} />
                                    <h3 className="font-semibold" style={{ color: 'var(--color-secondary-100)' }}>
                                        Partnership Type
                                    </h3>
                                </div>
                                <p className="text-lg font-medium capitalize" style={{ color: 'var(--color-secondary-200)' }}>
                                    {partner.partnership_type}
                                </p>
                            </div>

                            <div className="bg-white border p-6" style={{ borderColor: 'var(--color-secondary-500)', borderRadius: '8px' }}>
                                <div className="flex items-center mb-3">
                                    <Building className="h-4 w-4 mr-3" style={{ color: 'var(--color-primary-200)' }} />
                                    <h3 className="font-semibold" style={{ color: 'var(--color-secondary-100)' }}>
                                        Legal Status
                                    </h3>
                                </div>
                                <p className="text-lg font-medium" style={{ color: 'var(--color-secondary-200)' }}>
                                    {partner.legal_status.toUpperCase()}
                                </p>
                            </div>

                            <div className="bg-white border p-6" style={{ borderColor: 'var(--color-secondary-500)', borderRadius: '8px' }}>
                                <div className="flex items-center mb-3">
                                    <Calendar className="h-4 w-4 mr-3" style={{ color: 'var(--color-primary-200)' }} />
                                    <h3 className="font-semibold" style={{ color: 'var(--color-secondary-100)' }}>
                                        Partner Since
                                    </h3>
                                </div>
                                <p className="text-lg font-medium" style={{ color: 'var(--color-secondary-200)' }}>
                                    {formatDate(partner.created_at)}
                                </p>
                            </div>

                            <div className="bg-white border p-6" style={{ borderColor: 'var(--color-secondary-500)', borderRadius: '8px' }}>
                                <div className="flex items-center mb-3">
                                    <TrendingUp className="h-4 w-4 mr-3" style={{ color: 'var(--color-primary-200)' }} />
                                    <h3 className="font-semibold" style={{ color: 'var(--color-secondary-100)' }}>
                                        Partnership Duration
                                    </h3>
                                </div>
                                <p className="text-lg font-medium" style={{ color: 'var(--color-secondary-200)' }}>
                                    {Math.floor((Date.now() - new Date(partner.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            <div className="bg-white border p-6" style={{ borderColor: 'var(--color-secondary-500)', borderRadius: '8px' }}>
                                <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-secondary-100)' }}>
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <MapPin className="h-4 w-4 mr-2" style={{ color: 'var(--color-primary-200)' }} />
                                            <span className="text-sm font-medium" style={{ color: 'var(--color-secondary-100)' }}>
                                                Address
                                            </span>
                                        </div>
                                        <p className="text-sm ml-6" style={{ color: 'var(--color-secondary-200)' }}>
                                            {partner.address}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Mail className="h-4 w-4 mr-2" style={{ color: 'var(--color-primary-200)' }} />
                                            <span className="text-sm font-medium" style={{ color: 'var(--color-secondary-100)' }}>
                                                Email
                                            </span>
                                        </div>
                                        <Link
                                            href={`mailto:${partner.email}`}
                                            className="text-sm ml-6 hover:underline"
                                            style={{ color: 'var(--color-primary-100)' }}
                                        >
                                            {partner.email}
                                        </Link>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Phone className="h-4 w-4 mr-2" style={{ color: 'var(--color-primary-200)' }} />
                                            <span className="text-sm font-medium" style={{ color: 'var(--color-secondary-100)' }}>
                                                Phone
                                            </span>
                                        </div>
                                        <Link
                                            href={`tel:${partner.phone}`}
                                            className="text-sm ml-6 hover:underline"
                                            style={{ color: 'var(--color-primary-100)' }}
                                        >
                                            {partner.phone}
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <a
                                        href={`mailto:${partner.email}`}
                                        className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
                                        style={{ backgroundColor: 'var(--color-primary-200)', borderRadius: '6px' }}
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact Partner
                                    </a>
                                </div>
                            </div>

                            <div
                                className="p-6 text-white"
                                style={{
                                    background: `linear-gradient(135deg, var(--color-secondary-200), var(--color-primary-200))`,
                                    borderRadius: '8px'
                                }}
                            >
                                <h3 className="text-lg font-bold mb-6">Partnership Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium opacity-90">Status</span>
                                        <span className="text-sm font-semibold bg-white/20 px-2 py-1" style={{ borderRadius: '4px' }}>
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium opacity-90">Type</span>
                                        <span className="text-sm font-semibold capitalize">
                                            {partner.partnership_type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}