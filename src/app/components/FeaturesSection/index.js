"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(null);

  const featureVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
    hover: { y: -8, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)", transition: { duration: 0.2 } },
  };

  const textRevealVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const features = [
    {
      id: 1,
      title: "Busca Inteligente",
      description:
        "Sistema avançado de busca que encontra exatamente o que você procura. Filtre por tipo de culinária, faixa de preço e avaliações em qualquer cidade do Brasil.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 lg:h-16 lg:w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      hoverContent: (
        <motion.div variants={textRevealVariants} className="mt-4 flex items-center text-amber-600 font-semibold text-sm lg:text-base">
          <span>Saiba mais</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      ),
    },
    {
      id: 2,
      title: "Google Maps Oficial",
      description:
        "Integração completa com a API oficial do Google Maps. Informações sempre atualizadas, rotas precisas, horários de funcionamento e avaliações reais dos usuários.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 lg:h-16 lg:w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      hoverContent: (
        <motion.div variants={textRevealVariants} className="bg-amber-50 p-3 rounded-lg mt-4">
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Dados sempre atualizados
          </div>
        </motion.div>
      ),
    },
    {
      id: 3,
      title: "Performance Otimizada",
      description:
        "Plataforma otimizada para máxima velocidade. Encontre informações instantaneamente sem travamentos, com interface intuitiva e carregamento ultrarrápido.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 lg:h-16 lg:w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      hoverContent: (
        <motion.div variants={textRevealVariants} className="mt-4 grid grid-cols-2 gap-2 text-xs lg:text-sm">
          <div className="flex items-center text-gray-600">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
            Carregamento rápido
          </div>
          <div className="flex items-center text-gray-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            Interface intuitiva
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-amber-950 leading-tight">
            Por que somos a melhor escolha?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Desenvolvida com <strong className="text-amber-700">tecnologia de ponta</strong> para oferecer a melhor experiência na busca por restaurantes e estabelecimentos gastronômicos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg border border-amber-100 cursor-pointer relative overflow-hidden"
            >
              <div className="text-amber-700 mb-5 mx-auto w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-amber-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
              {activeFeature === feature.id && feature.hoverContent}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-16 md:mt-24 bg-amber-900 rounded-2xl p-8 md:p-12 text-white shadow-xl"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Pronto para descobrir novos sabores?
          </h3>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
            Milhares de restaurantes esperando por você em todo o Brasil.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {[
              { text: "Gratuito para usar", icon: "✅", color: "text-amber-300" },
              { text: "Sem cadastro necessário", icon: "📝", color: "text-white" },
              { text: "Resultados instantâneos", icon: "⚡", color: "text-amber-300" },
            ].map((item, index) => (
              <span key={index} className={`flex items-center ${item.color} text-sm sm:text-base font-medium`}>
                <span className="text-lg mr-2">{item.icon}</span> {item.text}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}