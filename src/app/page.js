"use client";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import SearchRestaurants from "./components/SearchRestaurants";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
