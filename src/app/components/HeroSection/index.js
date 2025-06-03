"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchRestaurants from "../SearchRestaurants";
import RestaurantModal from "../RestaurantModal";

export default function HeroSection() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  const handleSearch = (state, city) => {
    setSelectedState(state);
    setSelectedCity(city);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const onScroll = () => {
      setShowScrollArrow(window.scrollY < 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const badges = [
    { label: "Dados atualizados", icon: "✅" },
    { label: "Busca inteligente", icon: "🔍" },
    { label: "Interface moderna", icon: "✨" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/assets/images/imagem-fundo.jpg')] bg-cover bg-center opacity-85"
        aria-hidden="true"
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-orange-900/30 to-yellow-900/40" />

      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10 md:space-y-12 lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4 max-w-sm sm:max-w-md"
            >
              <h2 className="text-amber-300 font-light text-sm sm:text-base md:text-lg tracking-widest uppercase drop-shadow-md select-text">
                Descubra os Melhores
              </h2>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight drop-shadow-lg select-text"
                style={{
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Restaurantes do Brasil
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-white/95 text-base sm:text-lg leading-relaxed tracking-wide px-2"
              >
                Explore opções deliciosas e experiências gastronômicas únicas em cada cidade.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="w-full max-w-sm sm:max-w-md bg-amber-50/15 backdrop-blur-md border border-amber-200/30 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(245,222,179,0.2)] p-6 sm:p-8"
              style={{ boxShadow: "0 8px 32px rgba(139, 69, 19, 0.3)" }}
            >
              <SearchRestaurants onSearch={handleSearch} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-sm"
            >
              {badges.map(({ label, icon }, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
                  className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm cursor-default select-none bg-amber-900/30 px-3 py-1 rounded-full backdrop-blur-sm border border-amber-300/25"
                  style={{ userSelect: "none" }}
                >
                  <span className="text-sm sm:text-base">{icon}</span> {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 xl:space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-amber-300 font-light text-lg xl:text-xl tracking-widest uppercase drop-shadow-md select-text">
                  Descubra os Melhores
                </h2>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                  className="text-white font-extrabold text-6xl xl:text-7xl 2xl:text-8xl leading-tight tracking-tight drop-shadow-lg select-text"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  Restaurantes do Brasil
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-white/95 text-lg xl:text-xl leading-relaxed tracking-wide max-w-lg"
                >
                  Explore opções deliciosas e experiências gastronômicas únicas em cada cidade.
                </motion.p>
              </div>

              <div className="flex flex-wrap gap-4 xl:gap-5">
                {badges.map(({ label, icon }, i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                    className="flex items-center gap-2 text-white font-semibold text-sm xl:text-base cursor-default select-none bg-amber-900/30 px-4 py-2 rounded-full backdrop-blur-sm border border-amber-300/25"
                    style={{ userSelect: "none" }}
                  >
                    <span className="text-base xl:text-lg">{icon}</span> {label}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              className="bg-amber-50/15 backdrop-blur-md border border-amber-200/30 rounded-3xl shadow-[0_20px_60px_rgba(245,222,179,0.2)] p-8 xl:p-12 2xl:p-14"
              style={{ boxShadow: "0 8px 32px rgba(139, 69, 19, 0.3)" }}
            >
              <SearchRestaurants onSearch={handleSearch} />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showScrollArrow && (
          <motion.div
            key="scroll-arrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer select-none group"
            aria-label="Scroll down indicator"
            title="Desça para explorar mais"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 sm:h-12 sm:w-12 text-white/95 drop-shadow-lg group-hover:text-amber-300 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && (
        <RestaurantModal
          state={selectedState}
          city={selectedCity}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}