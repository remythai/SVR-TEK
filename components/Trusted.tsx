export default function Trusted() {
    const companyLogos = ["slack", "framer", "netflix", "google", "linkedin", "instagram", "facebook"];

    return (
        <>
            <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

            <div className="relative bg-gradient-to-b from-[#171717] via-gray-200/20 to-[#171717] py-40">
                <div className="flex flex-col gap-5 mb-20">
                    <h1 className="text-3xl font-medium text-white text-center">Our partners</h1>
                    <p className="text-white text-center">Trusted by the world's most innovative companies.</p>
                </div>

                <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none" />
                    <div
                        className="marquee-inner flex will-change-transform min-w-[200%]"
                        style={{ animationDuration: "15s" }}
                    >
                        <div className="flex">
                            {[...companyLogos, ...companyLogos].map((company, index) => (
                                <img
                                    key={index}
                                    src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                                    alt={company}
                                    className="w-full h-full object-cover mx-6"
                                    draggable={false}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none" />
                </div>
            </div>
        </>
    );
};
