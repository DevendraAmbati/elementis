import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import Navbar from "./Navbar";

const HeroSection = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      title: "Americas",
      subtitle: "Chile",
      description:
        "Discover the breathtaking peaks and cultural richness of Chile in the heart of the Americas.",
    },
    {
      image:
        "https://wisconsinsbdc.org/wp-content/uploads/sites/2/2023/04/hileslakesmaller-1024x768.jpg",
      title: "Asia",
      subtitle: "Japan",
      description:
        "Experience the blend of ancient traditions and futuristic innovation across the islands of Japan.",
    },
    {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      title: "Europe",
      subtitle: "Iceland",
      description:
        "Explore the land of fire and ice — where glaciers, volcanoes, and auroras paint the skies.",
    },
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [nextImage, setNextImage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [flip, setFlip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const canScroll = useRef(true);
  const [showSidePanel, setShowSidePanel] = useState(false);

  // ✅ Mouse visibility for Explore button
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;
      const { clientX: x, clientY: y } = e;
      setMousePosition({ x, y });
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      if (y < 120 || (y > windowHeight - 150 && x > windowWidth - 400)) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Auto slide (disabled when side panel open)
  useEffect(() => {
    if (showSidePanel) return; // pause slideshow while panel is open

    let frame = 0;
    const duration = 4000;
    const frameRate = 30;
    const totalFrames = (duration / 1000) * frameRate;

    setProgress(0);
    const interval = setInterval(() => {
      frame++;
      setProgress((frame / totalFrames) * 100);
      if (frame >= totalFrames) {
        triggerNext();
        frame = 0;
      }
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [currentImage, showSidePanel]);

  // ✅ Scroll navigation (disabled when side panel open)
  useEffect(() => {
    const handleScroll = (e) => {
      if (showSidePanel) return;
      if (!canScroll.current) return;
      canScroll.current = false;

      if (e.deltaY > 0) triggerNext();
      else triggerPrev();

      setTimeout(() => {
        canScroll.current = true;
      }, 1500);
    };
    window.addEventListener("wheel", handleScroll, { passive: true });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [currentImage, showSidePanel]);

  const triggerNext = () => {
    setNextImage((currentImage + 1) % slides.length);
    setFlip(true);
    setTimeout(() => {
      setCurrentImage((currentImage + 1) % slides.length);
      setFlip(false);
    }, 1200);
  };

  const triggerPrev = () => {
    setNextImage((currentImage - 1 + slides.length) % slides.length);
    setFlip(true);
    setTimeout(() => {
      setCurrentImage((currentImage - 1 + slides.length) % slides.length);
      setFlip(false);
    }, 1200);
  };

  const currentSlide = slides[currentImage];
    const handleHeroClick = (e) => {
    const navbar = document.querySelector("nav"); // assuming Navbar renders a <nav>
    if (navbar && navbar.contains(e.target)) return; // ignore clicks on Navbar
    if (!showSidePanel) setShowSidePanel(true);
  };

  return (
    <div
      className="relative h-screen 2xl:h-[800px] w-full overflow-hidden"
      onClick={handleHeroClick} // prevent reopening trigger
    >
      {/* Background image */}
      <div
        key={currentImage}
        className="absolute inset-0 bg-cover bg-center hero-bg zoom-in-active"
        style={{ backgroundImage: `url(${currentSlide.image})` }}
      ></div>

      {/* Slices animation */}
      {flip ? (
        <div className="hero-slices-horizontal flip-active" key={currentImage}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="hero-slice-horizontal"
              style={{
                backgroundImage: `url(${currentSlide.image})`,
                backgroundPosition: `center ${(i / 30) * 100}%`,
                backgroundSize: `100% 3000%`,
                animationDelay: `${i * 0.03}s`,
              }}
            ></div>
          ))}
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center zoom-in-bg"
          style={{ backgroundImage: `url(${currentSlide.image})` }}
        ></div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <Navbar />

      {/* Floating Explore Button */}
      {visible && !showSidePanel && (
        <div
          className="hidden md:block absolute z-30 pointer-events-none transition-transform duration-100 ease-out"
          style={{
            left: `${mousePosition.x - 75}px`,
            top: `${mousePosition.y - 75}px`,
          }}
        >
          <button className="relative px-3 py-7 text-white font-semibold text-lg rounded-full overflow-hidden bg-white/10 border border-white/40 backdrop-blur-xl">
            <span className="relative z-10">Explore</span>
          </button>
        </div>
      )}

      {/* Hero Text */}
      <div className="absolute z-20 bottom-[45%] left-0 px-6 md:px-10 text-white w-full">
        <h2
          key={`${currentImage}-title`}
          className="text-4xl sm:text-5xl md:text-7xl font-light tracking-wide mb-4 animate-fadeUpSmooth"
        >
          {currentSlide.title}
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-b border-white/40 py-2 text-sm sm:text-lg font-light tracking-wide">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <span className="text-xl sm:text-2xl">≡</span>
            <span>Explore Destinations</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-10">
            <span>{currentSlide.title} | {currentSlide.subtitle}</span>
            <span className="text-white/70">
              {currentImage + 1 < 10
                ? `0${currentImage + 1}`
                : currentImage + 1} — {slides.length < 10 ? `0${slides.length}` : slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="absolute z-20 bottom-28 md:bottom-44 left-0 px-6 md:px-10 text-white w-full">
        <p
          key={`${currentImage}-desc`}
          className="text-white/80 max-w-md text-sm sm:text-base font-light mb-6 animate-fadeUpSmooth"
        >
          {currentSlide.description}
        </p>
      </div>

      {/* ✅ Thumbnails — remain visible and unchanged */}
      <div className="absolute z-30 bottom-5 right-0 md:right-5 flex flex-wrap md:flex-nowrap gap-4 md:gap-6 justify-center md:justify-end px-4">
        {slides.map((slide, index) => (
          <div key={index} className="flex flex-col items-start">
            <p className="text-white text-start text-sm sm:text-lg mb-1 font-light">
              {index + 1 < 10 ? `0${index + 1}.` : `${index + 1}.`}
            </p>
            <div className="relative">
              <img
                src={slide.image}
                alt={`Thumbnail ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!showSidePanel) setCurrentImage(index);
                }}
                className={`w-21 sm:w-32 md:w-32 h-18 sm:h-24 md:h-20 object-cover rounded-md cursor-pointer transition-all duration-[1200ms] ease-in-out ${
                  currentImage === index ? "opacity-100 scale-105" : "opacity-50"
                }`}
              />
            </div>
            <div
              className={`mt-2 h-[2px] w-21 sm:w-32 md:w-32 relative overflow-hidden transition-all duration-500 ${
                currentImage === index ? "bg-white/40" : "bg-transparent"
              }`}
            >
              {currentImage === index && (
                <div
                  className="absolute left-0 top-0 h-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Side Panel (does not affect background or thumbnails) */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[45%] bg-[#1d2b24] text-white transform transition-transform duration-700 z-[60] ${
          showSidePanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-lg sm:text-2xl">
            {currentSlide.title} | {currentSlide.subtitle}
          </h2>
          <button
            className="text-white text-lg"
            onClick={(e) => {
              e.stopPropagation();
              setShowSidePanel(false);
            }}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">
          <img
            src={currentSlide.image}
            alt={currentSlide.subtitle}
            className="rounded-lg mb-6"
          />
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {currentSlide.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
