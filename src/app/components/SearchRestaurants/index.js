"use client";

import { useLocation } from "../../hooks/useLocation";

const SearchRestaurants = ({ onSearch }) => {
  const {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    setSelectedState,
    setSelectedCity,
  } = useLocation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedState && selectedCity) {
          onSearch(selectedState, selectedCity);
          document.body.style.overflow = "hidden";
        }
      }}
      className="space-y-4 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">
          Encontre Restaurantes
        </h3>
        <p className="text-white/80 text-sm">
          Selecione seu estado e cidade
        </p>
      </div>

      <div className="space-y-4">
        
        <div className="relative group">
          <label 
            htmlFor="state" 
            className="block text-amber-100 font-semibold mb-2 text-sm tracking-wide" 
          >
            Estado
            {loadingStates && (
              <span className="ml-2 text-amber-300 animate-pulse"> 
                carregando...
              </span>
            )}
          </label>
          
          <div className="relative">
            <select
              id="state"
              className="w-full px-3 py-3 rounded-lg border-2 border-amber-400/70 bg-white text-amber-950 placeholder-amber-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={loadingStates}
              required
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23C2410C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25em 1.25em",
              }}
            >
              <option value="" className="text-amber-900 bg-white">
                Selecione o estado
              </option>
              {states.map((state) => (
                <option key={state.id} value={state.sigla} className="text-amber-900 bg-white">
                  {state.nome}
                </option>
              ))}
            </select>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg 
                className="w-4 h-4 text-orange-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative group">
          <label 
            htmlFor="city" 
            className="block text-amber-100 font-semibold mb-2 text-sm tracking-wide"
          >
            Cidade
            {loadingCities && (
              <span className="ml-2 text-amber-300 animate-pulse"> 
                carregando...
              </span>
            )}
          </label>
          
          <div className="relative">
            <select
              id="city"
              className="w-full px-3 py-3 rounded-lg border-2 border-amber-400/70 bg-white text-amber-950 placeholder-amber-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed appearance-none" 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState || loadingCities}
              required
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23C2410C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, 
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25em 1.25em",
              }}
            >
              <option value="" className="text-amber-900 bg-white">
                {!selectedState ? "Primeiro selecione um estado" : "Selecione a cidade"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.nome} className="text-amber-900 bg-white">
                  {city.nome}
                </option>
              ))}
            </select>
            
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg 
                className="w-4 h-4 text-orange-700" // Cor da seta ajustada
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!selectedState || !selectedCity}
          className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 p-0.5 text-white font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <div className="relative rounded-md bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 transition-all duration-300 group-hover:from-amber-700 group-hover:to-orange-700">
            <div className="flex items-center justify-center space-x-2">
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-bold tracking-wide">
                Buscar Restaurantes
              </span>
            </div>
            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-white via-transparent to-white transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </div>
        </button>
      </div>

      <div className="text-center pt-1">
        <p className="text-amber-100 text-xs"> 
          💡 Descubra os melhores restaurantes
        </p>
      </div>
    </form>
  );
};

export default SearchRestaurants;