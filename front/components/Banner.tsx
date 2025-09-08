import Link from "next/link";

export default function Banner() {
    return (
        <div className="w-full flex justify-center px-6 md:px-12 lg:px-20">
            <div className="flex flex-col items-center justify-center px-10 max-w-[85rem] w-full text-center rounded-2xl py-20 md:py-24 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/banners/image-2.png')] bg-cover bg-center bg-no-repeat">
                <h1 className="text-2xl md:text-3xl font-medium text-white max-w-2xl">Are you a startup?</h1>
                <div className="h-[3px] w-32 my-1 bg-gradient-to-l from-transparent to-white"></div>
                <p className="text-sm md:text-base text-white max-w-xl">
                    Join our incubator and grow with us. If you are a company interested in being part of our ecosystem, click the button below.
                </p>
                <Link href="/startup" className="px-10 py-3 mt-4 text-sm bg-white hover:scale-105 transition duration-300 rounded-full">
                    Apply Now
                </Link>
            </div>
        </div>
    );
};
