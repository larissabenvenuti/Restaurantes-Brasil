import { useState, useCallback } from "react";
import axios from "axios";

export const useFetchRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async (state, city, coordinates = null, filters = {}) => {
    if (!state || !city) {
      setError("Estado e cidade são informações obrigatórias para buscar estabelecimentos.");
      setRestaurants([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        state,
        city,
        ...(coordinates?.lat && coordinates?.lng && {
          lat: coordinates.lat,
          lng: coordinates.lng
        }),
        ...(filters.types?.length > 0 && { types: filters.types.join(',') }),
        ...(filters.minRating > 0 && { minRating: filters.minRating }),
        ...(filters.priceLevel !== null && filters.priceLevel !== undefined && { priceLevel: filters.priceLevel.toString() }),
      };

      const response = await axios.get("/api/restaurants", { params });
      const rawData = response.data;

      if (rawData.status === "OK" && Array.isArray(rawData.results)) {
        const processedRestaurants = rawData.results.map((place) => ({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || place.vicinity || "Endereço não disponível",
          rating: place.rating || null,
          userRatingsTotal: place.user_ratings_total || null,
          geometry: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          photoUrl: place.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`
            : null,
          priceLevel: place.price_level ?? null,
          businessStatus: place.business_status,
          types: place.types || [],
          openNow: place.opening_hours?.open_now || null,
          vicinity: place.vicinity || null
        }));

        setRestaurants(processedRestaurants);

        if (processedRestaurants.length === 0) {
          const hasActiveFilters = Object.keys(filters).some(key =>
            filters[key] !== null &&
            filters[key] !== undefined &&
            (Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key] > 0)
          );
          if (hasActiveFilters) {
            setError(`Nenhum estabelecimento encontrado com os filtros aplicados. Tente ajustar suas escolhas.`);
          } else {
            setError(`Não foi possível encontrar estabelecimentos em ${city}, ${state}.`);
          }
        }

      } else {
        const errorMessage = rawData.error || rawData.error_message || rawData.status || "Erro desconhecido na busca de estabelecimentos.";
        setError(`Problema na busca: ${errorMessage}`);
        setRestaurants([]);
      }
    } catch (err) {
      let userMessage = "Ocorreu um erro inesperado. Por favor, tente novamente.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          userMessage = err.response.data?.error || err.response.data?.message || `Erro do servidor: ${err.response.status}`;
        } else if (err.request) {
          userMessage = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
        } else {
          userMessage = `Erro ao enviar requisição: ${err.message}`;
        }
      } else {
        userMessage = `Erro: ${err.message}`;
      }

      setError(userMessage);
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRestaurants = useCallback(() => {
    setRestaurants([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    restaurants,
    isLoading,
    error,
    fetchRestaurants,
    clearRestaurants
  };
};