"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, User, LogOut } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const renderAuthButtons = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <>
          <Link
            href="/dashboard"
            className="hover:underline flex items-center gap-2"
          >
            <User size={16} />
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="text-secondary-100 rounded-full py-2 px-4 border border-red-300 hover:text-white hover:bg-red-500 transition-colors duration-300 flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <Link href="/login" className="hover:underline">
          Sign in
        </Link>
        <Link
          href="/register"
          className="text-secondary-100 rounded-full py-2 px-4 border border-secondary-300 hover:text-white hover:bg-secondary-200 transition-colors duration-300"
        >
          Get Started
        </Link>
      </>
    );
  };

  const renderMobileAuthButtons = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 w-full bg-gray-300 rounded"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="w-full flex flex-col gap-3 items-center justify-center mt-5">
          <Link
            href="/dashboard"
            className="w-full flex justify-center text-secondary-100 py-2 px-4 rounded-xl transition-colors duration-500 border-2 border-secondary-100"
          >
            <User size={16} className="mr-2" />
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex justify-center text-white rounded-xl py-2 px-4 bg-red-500/80 hover:bg-red-500"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col gap-3 items-center justify-center mt-5">
        <Link
          href="/login"
          className="w-full flex justify-center text-secondary-100 py-2 px-4 rounded-xl transition-colors duration-500 border-2 border-secondary-100"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="w-full flex justify-center text-secondary-100 rounded-xl py-2 px-4 bg-secondary-500/30"
        >
          Get Started
        </Link>
      </div>
    );
  };

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-transform duration-300 px-6 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${isOpen ? "bg-white" : "bg-none"} text-black`}
    >
      <div
        className={`max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 px-2 rounded-[30px]`}
      >
        <Link href="/" className="font-bold text-2xl text-secondary-100">
          <h1>Jeb</h1>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="relative w-10 h-10 flex flex-col justify-center items-center space-y-1 lg:hidden z-50"
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

        <div className="hidden lg:flex md:w-auto space-x-8">
          <Link
            href="/"
            className="block px-3 py-2 text-secondary-100 bg-secondary-400/30 rounded-full transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/#projects"
            className="block px-3 py-2 hover:text-secondary-100 hover:bg-secondary-400/30 rounded-full transition-colors duration-300"
          >
            Projects
          </Link>
          <Link
            href="/#news"
            className="block px-3 py-2 hover:text-secondary-100 hover:bg-secondary-400/30 rounded-full transition-colors duration-300"
          >
            News
          </Link>
          <Link
            href="/#events"
            className="block px-3 py-2 hover:text-secondary-100 hover:bg-secondary-400/30 rounded-full transition-colors duration-300"
          >
            Events
          </Link>
          <Link
            href="/#about"
            className="block px-3 py-2 hover:text-secondary-100 hover:bg-secondary-400/30 rounded-full transition-colors duration-300"
          >
            About
          </Link>
        </div>

        <div
          className={`w-full lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out
          ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          {renderMobileAuthButtons()}
          <ul className="flex flex-col space-y-4 font-medium py-8">
            {[
              { href: "/", label: "Home" },
              { href: "/#projects", label: "Projects" },
              { href: "/#news", label: "News" },
              { href: "/#events", label: "Events" },
              { href: "/#about", label: "About" },
            ].map(({ href, label }) => (
              <li key={href} className="border-b pb-3">
                <Link
                  href={href}
                  onClick={() => {
                    setIsOpen(false);
                    setShowNavbar(false);
                  }}
                  className="hover:underline flex justify-between"
                >
                  {label}
                  <ArrowRight className="" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:w-auto space-x-8 lg:flex items-center justify-center">
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  );
}