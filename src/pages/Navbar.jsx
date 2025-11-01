import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // ✅ Menu links
  const navLinks = [
    { name: "Destinations", href: "#destinations" },
    { name: "Wellness", href: "#wellness" },
    { name: "Innovation", href: "#innovation" },
    { name: "Nature", href: "#nature" },
    { name: "Community", href: "#community" },
    { name: "The Story", href: "#story" },
  ];

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-5 sm:px-10 py-4 flex justify-between items-center text-white bg-transparent">
      {/* Logo */}
      <h1 className="text-xl sm:text-2xl font-light tracking-[0.3em]">
        ELEMENTIS
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex list-none gap-6 lg:gap-10 text-sm lg:text-base font-light">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a href={link.href} className="hover:underline cursor-pointer">
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop Join Button */}
      <button className="hidden lg:block border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition">
        Join Us
      </button>

      {/* Mobile/Tablet Menu Icon */}
      <div
        className="lg:hidden text-3xl cursor-pointer transition-transform duration-300"
        onClick={toggleMenu}
      >
        <FiMenu />
      </div>

      {/* ✅ Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-lg text-white flex flex-col items-center justify-center gap-8 text-lg font-light lg:hidden transform transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        {/* ✅ Close Icon Inside Overlay */}
        <button
          onClick={toggleMenu}
          className="absolute top-6 right-6 text-4xl cursor-pointer text-white hover:scale-110 transition-transform"
        >
          <FiX />
        </button>

        <ul className="flex flex-col items-start list-none gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="hover:underline cursor-pointer"
                onClick={() => setIsOpen(false)} // close menu on link click
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
          onClick={() => setIsOpen(false)}
        >
          Join Us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
