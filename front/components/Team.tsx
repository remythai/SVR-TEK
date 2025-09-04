import Image from "next/image";

export default function Team() {
    return (
        <div className="my-30 px-6 md:px-12 lg:px-20">
            <div className="flex flex-col gap-5 text-left md:text-center">
                <h1 className="text-3xl font-medium text-secondary-100">Meet Our Team</h1>
                <p>The people behind the product, passionate about what they do.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 mt-12">
                <div className="md:max-w-80 w-full bg-black text-white rounded-2xl">
                    <div className="relative -mt-px overflow-hidden rounded-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600"
                            alt="" className="h-[270px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top"
                            width={300}
                            height={300}
                        />
                        <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                    </div>
                    <div className="px-4 pb-6 text-center">
                        <p className="mt-4 text-lg">Bylel jourdin</p>
                        <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">Jeb incubator&apos;s Manager</p>
                    </div>
                </div>
                <div className="md:max-w-80 w-full bg-black text-white rounded-2xl">
                    <div className="relative -mt-px overflow-hidden rounded-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600"
                            alt="" className="h-[270px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top"
                            width={300}
                            height={300}
                        />
                        <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                    </div>
                    <div className="px-4 pb-6 text-center">
                        <p className="mt-4 text-lg">Javier barrera</p>
                        <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">Jeb incubator&apos;s Manager</p>
                    </div>
                </div>
                <div className="md:max-w-80 w-full bg-black text-white rounded-2xl">
                    <div className="relative -mt-px overflow-hidden rounded-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop"
                            alt="" className="h-[270px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top"
                            width={300}
                            height={300}
                        />
                        <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                    </div>
                    <div className="px-4 pb-6 text-center">
                        <p className="mt-4 text-lg">Elena Enka</p>
                        <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">Jeb incubator&apos;s Manager</p>
                    </div>
                </div>
            </div>
        </div>
    );
};