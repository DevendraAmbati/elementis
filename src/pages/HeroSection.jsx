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
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
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
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const canScroll = useRef(true); // 🟢 control one-time scroll

  // Mouse visibility handler (desktop only)
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

  // Auto slide change
  useEffect(() => {
    let frame = 0;
    const duration = 4000;
    const frameRate = 30;
    const totalFrames = (duration / 1000) * frameRate;

    setProgress(0);
    const interval = setInterval(() => {
      frame++;
      setProgress((frame / totalFrames) * 100);
      if (frame >= totalFrames) {
        frame = 0;
        setCurrentImage((prev) => (prev + 1) % slides.length);
      }
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [currentImage, slides.length]);

  // 🖱 Scroll (only one slide per scroll event)
  useEffect(() => {
    const handleScroll = (e) => {
      if (!canScroll.current) return; // ignore if cooldown active
      canScroll.current = false; // disable new scrolls

      if (e.deltaY > 0) {
        // Scroll down → next slide
        setCurrentImage((prev) => (prev + 1) % slides.length);
      } else if (e.deltaY < 0) {
        // Scroll up → previous slide
        setCurrentImage((prev) => (prev - 1 + slides.length) % slides.length);
      }

      // Enable scroll again after 1.2s
      setTimeout(() => {
        canScroll.current = true;
      }, 1200);
    };

    window.addEventListener("wheel", handleScroll, { passive: true });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [slides.length]);

  const currentSlide = slides[currentImage];

  return (
    <div className="relative h-screen 2xl:h-[800px] w-full overflow-hidden">
      {/* Background Image Transition */}
      <div
        key={currentImage}
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out animate-zoomIn"
        style={{ backgroundImage: `url(${currentSlide.image})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Navbar */}
      <Navbar />

      {/* Floating Explore Button */}
      {visible && (
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

      {/* Hero Content */}
      <div className="absolute z-20 bottom-[45%] left-0 px-6 md:px-10 text-white w-full">
        <h2
          key={`${currentImage}-title`}
          className="text-4xl sm:text-5xl text-start md:text-7xl font-light tracking-wide mb-4 animate-fadeUpSmooth"
        >
          {currentSlide.title}
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-b border-white/40 py-2 text-sm sm:text-lg font-light tracking-wide">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <span className="text-xl sm:text-2xl">≡</span>
            <span>Explore Destinations</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-10">
            <span
              className="animate-fadeUpSmooth"
              key={`${currentImage}-bottom`}
              style={{ animationDelay: "0.4s" }}
            >
              {currentSlide.title} | {currentSlide.subtitle}
            </span>
            <span className="text-white/70">
              {currentImage + 1 < 10
                ? `0${currentImage + 1}`
                : currentImage + 1}{" "}
              — {slides.length < 10 ? `0${slides.length}` : slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="absolute z-20 bottom-28 md:bottom-44 lg:bottom-18 left-0 px-6 md:px-10 text-white w-full">
        <p
          key={`${currentImage}-desc`}
          className="text-white/80 max-w-md text-sm sm:text-base font-light mb-6 animate-fadeUpSmooth"
          style={{ animationDelay: "0.2s" }}
        >
          {currentSlide.description}
        </p>
      </div>

      {/* Thumbnail Carousel */}
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
                onClick={() => setCurrentImage(index)}
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
    </div>
  );
};

export default HeroSection;
