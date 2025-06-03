"use client";

import { useState, useEffect, useCallback } from "react";

const mainRestaurantTypes = [
  { name: "Restaurante", value: "restaurant" },
  { name: "Bar", value: "bar" },
  { name: "Café", value: "cafe" },
];

const priceLevels = [
  { name: "Barato ($)", value: 1 },
  { name: "Moderado ($$)", value: 2 },
  { name: "Caro ($$$)", value: 3 },
  { name: "Muito Caro ($$$$)", value: 4 },
];

const FilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [selectedTypes, setSelectedTypes] = useState(currentFilters.types || []);
  const [minRating, setMinRating] = useState(currentFilters.minRating || 0);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState(currentFilters.priceLevel || null);

  useEffect(() => {
    if (isOpen) {
      setSelectedTypes(currentFilters.types || []);
      setMinRating(currentFilters.minRating || 0);
      setSelectedPriceLevel(currentFilters.priceLevel || null);
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto"; 
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, currentFilters]);

  const handleTypeChange = useCallback((event) => {
    const { value, checked } = event.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  }, []);

  const handleRatingChange = useCallback((event) => {
    setMinRating(parseFloat(event.target.value));
  }, []);

  const handlePriceLevelChange = useCallback((value) => {
    setSelectedPriceLevel(selectedPriceLevel === value ? null : value);
  }, [selectedPriceLevel]);

  const applyFilters = useCallback(() => {
    onApplyFilters({
      types: selectedTypes,
      minRating: minRating,
      priceLevel: selectedPriceLevel,
    });
    onClose();
  }, [selectedTypes, minRating, selectedPriceLevel, onApplyFilters, onClose]);

  const clearFilters = useCallback(() => {
    setSelectedTypes([]);
    setMinRating(0);
    setSelectedPriceLevel(null);
    onApplyFilters({ types: [], minRating: 0, priceLevel: null });
    onClose();
  }, [onApplyFilters, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-auto relative transform transition-all scale-100 opacity-100 ease-out duration-300 pointer-events-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
          <h3 className="text-2xl font-extrabold text-gray-900">Filtrar</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fechar filtros"
          >
            &times;
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 text-lg mb-3">Tipo de Estabelecimento</h4>
          <div className="flex flex-wrap gap-3">
            {mainRestaurantTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-full cursor-pointer transition-colors
                  ${selectedTypes.includes(type.value) ? "bg-amber-600 text-white border-amber-600 shadow-md" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"}`
                }
              >
                <input
                  type="checkbox"
                  value={type.value}
                  checked={selectedTypes.includes(type.value)}
                  onChange={handleTypeChange}
                  className="hidden" 
                />
                <span className="font-medium text-sm">{type.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 text-lg mb-3">Avaliação Mínima</h4>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={handleRatingChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
              aria-label={`Avaliação mínima: ${minRating === 0 ? "Qualquer" : minRating + " estrelas"}`}
            />
            <span className="text-gray-700 font-bold text-base min-w-[70px] text-right">
              {minRating === 0 ? "Qualquer" : `${minRating} ⭐`}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 text-lg mb-3">Nível de Preço</h4>
          <div className="flex flex-wrap gap-2">
            {priceLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => handlePriceLevelChange(level.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  selectedPriceLevel === level.value
                    ? "bg-amber-600 text-white shadow-md border-amber-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                }`}
                aria-pressed={selectedPriceLevel === level.value}
                aria-label={`Filtrar por nível de preço: ${level.name}`}
              >
                {level.name}
              </button>
            ))}
            <button
              onClick={() => handlePriceLevelChange(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                selectedPriceLevel === null
                  ? "bg-amber-600 text-white shadow-md border-amber-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
              }`}
              aria-pressed={selectedPriceLevel === null}
              aria-label="Remover filtro de preço"
            >
              Qualquer Preço
            </button>
          </div>
        </div>

        <div className="flex justify-between space-x-3 pt-5 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm text-base"
          >
            Limpar
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-md text-base"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;