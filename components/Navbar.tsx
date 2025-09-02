"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50 && !isOpen) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-transform duration-300 px-6 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${isOpen ? "bg-[#171717]" : "bg-none"} text-black`}
    >
      <div
        className={`max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 px-2 rounded-[30px]`}
      >
        <Link href="/" className="text-white font-bold text-2xl hover:text-orange-400 transition-all">
            <h1>Jeb</h1>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="relative w-10 h-10 flex flex-col justify-center items-center space-y-1 lg:hidden z-50 text-white"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        <div className="hidden lg:flex md:w-auto space-x-8 text-gray-500">
          <Link
            href="/"
            className="block px-3 py-2 hover:text-orange-400 hover:bg-orange-400/30 rounded-full transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/#projects"
            className="block px-3 py-2 hover:text-orange-400 hover:bg-orange-400/30 rounded-full transition-colors duration-300"
          >
            Projects
          </Link>
          <Link
            href="/#news"
            className="block px-3 py-2 hover:text-orange-400 hover:bg-orange-400/30 rounded-full transition-colors duration-300"
          >
            News
          </Link>
          <Link
            href="/#events"
            className="block px-3 py-2 hover:text-orange-400 hover:bg-orange-400/30 rounded-full transition-colors duration-300"
          >
            Events
          </Link>
          <Link
            href="/#advanced-search"
            className="block px-3 py-2 hover:text-orange-400 hover:bg-orange-400/30 rounded-full transition-colors duration-300"
          >
            Advanced Search
          </Link>
          <Link
            href="/#about"
            className="block px-3 py-2 hover:text-orange-400 hover:bg-orange-400/30 rounded-full transition-colors duration-300"
          >
            About
          </Link>
        </div>

        <div
          className={`w-full lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out
          ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
            <div className="w-full text-gray-500 flex flex-col gap-3 items-center justify-center mt-5">
                <Link
                    href="/login"
                    className="w-full flex justify-center text-gray-500 bg-[##292929] py-2 px-4 rounded-xl transition-colors duration-500 border-2 border-[#383837]">
                    Sign in
                </Link>
                <Link
                    href="/register-admin"
                    className="w-full flex justify-center text-black rounded-xl py-2 px-4 bg-white">
                    Get Started
                </Link>
            </div>
          <ul className="flex flex-col space-y-4 font-medium py-8 text-gray-500">
            {[
              { href: "/", label: "Home" },
              { href: "#projects", label: "Projects" },
              { href: "#news", label: "News" },
              { href: "#events", label: "Events" },
              { href: "#advanced-search", label: "Advanced Search" },
              { href: "#about", label: "About" },
            ].map(({ href, label }) => (
              <li key={href} className="border-b pb-3">
                <a
                  href={href}
                  onClick={() => {
                    setIsOpen(false);
                    setShowNavbar(false);
                  }}
                  className="hover:underline flex justify-between"
                >
                  {label}
                <ArrowRight className="" size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:w-auto space-x-8 text-gray-500 lg:flex items-center justify-center">
            <Link
                href="/login"
                className="text-gray-500 hover:text-white transition-colors duration-500">
                Sign in
            </Link>
            <Link
                href="/register-admin"
                className="text-black rounded-xl py-2 px-4 bg-white">
                Get Started
            </Link>
        </div>
      </div>
    </nav>
  );
}