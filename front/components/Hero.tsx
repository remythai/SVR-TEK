import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative text-white px-6 md:px-12 lg:px-20 py-20 flex items-center mt-20">
          <div className="absolute -left-40 top-[20%] md:top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] rounded-full bg-primary-400 blur-3xl" />
            <div className="absolute -right-0 top-[80%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-secondary-400 blur-3xl" />
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="z-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-secondary-100">
                    Empowering Startups, Driving Innovation
                </h1>
                <p className="mt-6 text-lg text-black max-w-lg">
                    We are dedicated to helping startups succeed by providing innovative solutions, expert guidance, and a collaborative community.
                </p>

                <div className="mt-8 flex items-center gap-4">
                    <Link
                      href="/register"
                      className="px-6 py-3 text-sm font-medium rounded-full bg-secondary-300 text-white hover:bg-secondary-200 transition-colors duration-300"
                      >
                      Join us
                    </Link>
                    <Link
                    href="/projects"
                    className="text-sm text-secondary-100 font-medium hover:underline flex items-center gap-1"
                    >
                    Projects
                    <ArrowRight className="w-[10px]"/>
                    </Link>
                </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/startup1.jpg" alt="People working" fill className="object-cover" />
                    </div>
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/startup2.jpg" alt="Collaboration" fill className="object-cover" />
                    </div>
                  </div>

                  <div className="space-y-6 sm:mt-12 hidden sm:block">
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/startup3.jpg" alt="Team" fill className="object-cover" />
                    </div>
                    <div className="relative w-full h-[250px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden">
                      <Image src="/startup4.jpg" alt="Office" fill className="object-cover" />
                    </div>
                  </div>
                </div>
            </div>
            </section>
    );
}
