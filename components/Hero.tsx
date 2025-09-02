import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative text-white px-6 md:px-12 lg:px-20 py-20 flex items-center mt-20">
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Empowering Startups, Driving Innovation
                </h1>
                <p className="mt-6 text-lg text-gray-300 max-w-lg">
                    We are dedicated to helping startups succeed by providing innovative solutions, expert guidance, and a collaborative community.
                </p>

                <div className="mt-8 flex items-center gap-4">
                    <a
                    href="/register"
                    className="px-6 py-3 text-sm font-medium rounded-md bg-orange-400/30 hover:bg-orange-400/50 transition text-orange-400"
                    >
                    Join us
                    </a>
                    <a
                    href="/projects"
                    className="text-sm font-medium hover:underline flex items-center gap-1"
                    >
                    Projects
                    <ArrowRight className="w-[10px]"/>
                    </a>
                </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/tree.jpg" alt="People working" fill className="object-cover" />
                    </div>
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/tree.jpg" alt="Collaboration" fill className="object-cover" />
                    </div>
                  </div>

                  <div className="space-y-6 sm:mt-12 hidden sm:block">
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/tree.jpg" alt="Team" fill className="object-cover" />
                    </div>
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/tree.jpg" alt="Office" fill className="object-cover" />
                    </div>
                  </div>
                </div>
            </div>
            </section>
    );
}
