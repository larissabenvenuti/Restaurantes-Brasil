"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import useGoogleMaps from "../../hooks/useGoogleMaps";
import { useFetchRestaurants } from "../../hooks/useFetchRestaurants";
import FilterModal from "../FilterModal";
import RestaurantDetails from "../RestaurantDetails";
import PhotoModal from "../PhotoModal";

const PLACE_DETAILS_FIELDS = [
  "name",
  "formatted_address",
  "rating",
  "user_ratings_total",
  "photos",
  "formatted_phone_number",
  "international_phone_number",
  "website",
  "price_level",
  "opening_hours",
  "reviews",
  "types",
  "vicinity",
  "url",
];

const RestaurantModal = ({ state, city, onClose }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);

  const [cityCenter, setCityCenter] = useState(null);

  const {
    map,
    placesService,
    mapsLoaded,
    error: googleMapsError,
  } = useGoogleMaps(apiKey, mapRef, cityCenter);
  const {
    restaurants,
    isLoading,
    error,
    fetchRestaurants: _fetchRestaurants,
  } = useFetchRestaurants();

  const markers = useRef([]);
  const infoWindow = useRef(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    types: [],
    minRating: 0,
    priceLevel: null,
  });
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (mapsLoaded && window.google && !infoWindow.current) {
      infoWindow.current = new window.google.maps.InfoWindow();
    }
  }, [mapsLoaded]);

  const fetchRestaurantsWithFilters = useCallback(
    async (state, city, coords, filters, initialLoad = false) => {
      setFiltersApplied(!initialLoad);
      await _fetchRestaurants(state, city, coords, filters);
    },
    [_fetchRestaurants]
  );

  useEffect(() => {
    const getCoordinatesAndFetchInitial = async () => {
      if (!state || !city || !mapsLoaded || !window.google?.maps) return;

      const geocoder = new window.google.maps.Geocoder();
      const query = `${city}, ${state}, Brazil`;
      let coords = null;

      try {
        const results = await new Promise((resolve, reject) => {
          geocoder.geocode({ address: query }, (res, status) =>
            status === "OK" && res?.[0] ? resolve(res) : reject(status)
          );
        });

        const location = results[0].geometry.location;
        coords = { lat: location.lat(), lng: location.lng() };
        setCityCenter(coords);
      } catch (err) {
        console.error("Erro ao obter coordenadas da cidade:", err);
      }

      fetchRestaurantsWithFilters(state, city, coords, {}, true);
    };

    getCoordinatesAndFetchInitial();
  }, [state, city, mapsLoaded, fetchRestaurantsWithFilters]);

  useEffect(() => {
    if (map && cityCenter) {
      clearMarkers();
      addRestaurantMarkers();
      fitMapBounds();
      setShowFilterButton(true);
    } else {
      setShowFilterButton(false);
    }
  }, [map, cityCenter, restaurants]);

  const clearMarkers = () => {
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current = [];
  };

  const getAllReadableTypes = useCallback((types) => {
    if (!types || types.length === 0) return ["Estabelecimento Geral"];

    const readableTypesMap = {
      "restaurant": "Restaurante",
      "bar": "Bar",
      "cafe": "Café",
    };

    const readableTypes = new Set();
    for (const type of types) {
      if (readableTypesMap[type]) {
        readableTypes.add(readableTypesMap[type]);
      }
    }

    if (readableTypes.size === 0 && types.includes('establishment')) {
      readableTypes.add("Estabelecimento Geral");
    } else if (readableTypes.size === 0 && types.includes('point_of_interest')) {
      readableTypes.add("Ponto de Interesse");
    } else if (readableTypes.size === 0 && types.includes('food')) {
      readableTypes.add("Comida Geral");
    }

    if (readableTypes.size === 0) {
      return ["Não Classificado"];
    }

    return Array.from(readableTypes);
  }, []);

  const addRestaurantMarkers = () => {
    if (!map) return;

    restaurants.forEach((restaurant) => {
      const { lat, lng } = restaurant.geometry || {};
      if (!lat || !lng) return;

      const position = { lat, lng };

      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: restaurant.name,
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener("click", () =>
        handleMarkerClick(restaurant, position)
      );
      markers.current.push(marker);
    });
  };

  const fitMapBounds = () => {
    if (!map || !cityCenter) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(cityCenter);
    restaurants.forEach(({ geometry }) => {
      if (geometry?.lat && geometry?.lng) bounds.extend(geometry);
    });

    const numPoints = restaurants.length + 1;

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 50 });
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() < 12 && numPoints > 1) {
          map.setZoom(12);
        } else if (map.getZoom() > 16 && numPoints <= 5) {
          map.setZoom(15);
        } else if (numPoints === 1) {
          map.setZoom(13);
        }
        window.google.maps.event.removeListener(listener);
      });
    } else {
      map.setCenter(cityCenter);
      map.setZoom(13);
    }
  };

  const handleMarkerClick = (restaurant, position) => {
    if (!infoWindow.current || !map) return;

    infoWindow.current.close();
    map.panTo(position);
    map.setZoom(Math.max(map.getZoom(), 15));

    const placeId = restaurant.id || restaurant.place_id;

    if (!placeId) {
      setSelectedRestaurant(createBasicRestaurantData(restaurant));
      return;
    }

    if (!placesService) {
      setSelectedRestaurant(createBasicRestaurantData(restaurant));
      return;
    }

    placesService.getDetails(
      {
        placeId,
        fields: PLACE_DETAILS_FIELDS,
      },
      (placeResult, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          placeResult
        ) {
          setSelectedRestaurant(createDetailedRestaurantData(placeResult));
        } else {
          console.error("Erro ao buscar detalhes do lugar:", status);
          setSelectedRestaurant(createBasicRestaurantData(restaurant));
        }
      }
    );
  };

  const createBasicRestaurantData = (restaurant) => ({
    name: restaurant.name,
    photos: restaurant.photoRef
      ? [
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${restaurant.photoRef}&key=${apiKey}`,
        ]
      : [],
    rating: restaurant.rating,
    userRatingsTotal: null,
    address: restaurant.address,
    phone: "N/A",
    website: null,
    priceLevel: restaurant.priceLevel,
    openingHours: null,
    reviews: [],
    types: restaurant.types || [],
  });

  const createDetailedRestaurantData = (placeResult) => {
    const photos =
      placeResult.photos?.slice(0, 6).map((photo) =>
        photo.getUrl({ maxWidth: 800, maxHeight: 600 })
      ) || [];

    return {
      name: placeResult.name,
      photos: photos,
      rating: placeResult.rating,
      userRatingsTotal: placeResult.user_ratings_total,
      address: placeResult.address || placeResult.vicinity, 
      phone:
        placeResult.formatted_phone_number ||
        placeResult.international_phone_number ||
        "N/A",
      website: placeResult.website || null,
      priceLevel: placeResult.price_level ?? null,
      openingHours: placeResult.opening_hours?.weekday_text || null,
      reviews: placeResult.reviews?.slice(0, 5) || [],
      types: placeResult.types || [],
      googleUrl: placeResult.url || null,
    };
  };

  const priceLevelToDollar = (level) =>
    level === null || level === undefined ? "N/A" : "$".repeat(Math.max(1, level));

  const handleApplyFilters = useCallback(
    (filters) => {
      setActiveFilters(filters);
      fetchRestaurantsWithFilters(state, city, cityCenter, filters);
      setSelectedRestaurant(null);
    },
    [cityCenter, state, city, fetchRestaurantsWithFilters]
  );

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div className="fixed inset-4 md:inset-8 lg:inset-12 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl overflow-hidden flex flex-col md:flex-row pointer-events-auto">
          <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full">
            {!mapsLoaded ? (
              <div className="w-full h-full flex items-center justify-center bg-amber-50 animate-pulse">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-400 mx-auto mb-4"></div>
                  <p className="text-amber-800 font-medium">
                    Carregando Google Maps...
                  </p>
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-full" />
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b border-amber-100 bg-amber-50 flex-shrink-0">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-950">
                    {city}, {state}
                  </h3>
                  <p className="text-amber-700 text-sm sm:text-base mt-1">
                    {restaurants.length} estabelecimentos encontrados
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-amber-400 hover:text-amber-600 text-2xl sm:text-3xl p-1 sm:p-2 hover:bg-amber-100 rounded-full transition-colors"
                  aria-label="Fechar modal"
                >
                  ✕
                </button>
              </div>

              {showFilterButton && (
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="mt-3 w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Filtrar Resultados
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-amber-800 font-medium">
                      Buscando estabelecimentos...
                    </p>
                  </div>
                </div>
              )}
              {error && (
                <div className="m-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <p className="text-orange-700">{error}</p>
                </div>
              )}
              {googleMapsError && (
                <div className="m-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <p className="text-orange-700">
                    Erro ao carregar o mapa: {googleMapsError}
                  </p>
                </div>
              )}
              {!selectedRestaurant && !isLoading && !error && !googleMapsError && (
                restaurants.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <div className="text-amber-400 mb-6">
                      <svg
                        className="w-20 h-20 mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-amber-950 mb-3">
                      {filtersApplied
                        ? "Nenhum estabelecimento encontrado com os filtros aplicados."
                        : "Nenhum estabelecimento encontrado nesta área."}
                    </h4>
                    <p className="text-amber-800">
                      {filtersApplied
                        ? "Tente ajustar seus filtros."
                        : "Verifique a grafia da cidade/estado ou tente uma cidade maior."}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <div className="text-amber-400 mb-6">
                      <svg
                        className="w-20 h-20 mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-amber-950 mb-3">
                      Clique em um marcador do mapa para ver os detalhes.
                    </h4>
                    <p className="text-amber-800">
                      Explore os estabelecimentos exibidos no mapa ou aplique
                      filtros.
                    </p>
                  </div>
                )
              )}
              {selectedRestaurant && (
                <RestaurantDetails
                  restaurant={selectedRestaurant}
                  onPhotoSelect={setSelectedPhoto}
                  priceLevelToDollar={priceLevelToDollar}
                  getAllReadableTypes={getAllReadableTypes}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </div>
  );
};

export default RestaurantModal;