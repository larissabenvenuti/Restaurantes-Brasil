"use client";

import { useEffect, useState, useRef, useCallback } from "react";

let googleMapsScriptAlreadyAdded = false;

const useGoogleMaps = (apiKey, mapRef, initialCenter = null) => {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [placesServiceInstance, setPlacesServiceInstance] = useState(null);
  const [googleMapsError, setGoogleMapsError] = useState(null);
  const mapServiceInitializedRef = useRef(false);
  const initializeMapAndServices = useCallback(() => {
    if (!window.google || !window.google.maps || mapServiceInitializedRef.current || !mapRef.current) {
      return;
    }

    try {
      const mapOptions = {
        zoom: 13,
        center: initialCenter || { lat: -22.9068, lng: -43.1729 },
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMapInstance(newMap);
      setPlacesServiceInstance(new window.google.maps.places.PlacesService(newMap));
      mapServiceInitializedRef.current = true;
      setGoogleMapsError(null);
    } catch (err) {
      console.error("Erro ao inicializar o mapa ou PlacesService:", err);
      setGoogleMapsError("Erro ao inicializar o mapa. Tente recarregar a página.");
      mapServiceInitializedRef.current = false;
    }
  }, [apiKey, mapRef, initialCenter]);

  useEffect(() => {
    if (!apiKey) {
      console.error("Erro: A Google Maps API key está faltando.");
      setGoogleMapsError("A chave da API do Google Maps está faltando. Verifique suas variáveis de ambiente.");
      return;
    }

    if (window.google && window.google.maps && window.google.maps.Geocoder && window.google.maps.places) {
      setMapsLoaded(true);
      if (mapRef.current && initialCenter && !mapServiceInitializedRef.current) {
         initializeMapAndServices();
      }
      return;
    }

    if (googleMapsScriptAlreadyAdded) {
      return;
    }

    googleMapsScriptAlreadyAdded = true;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsApiCallback`;
    script.async = true;
    script.defer = true;

    window.initGoogleMapsApiCallback = () => {
      setMapsLoaded(true);
    };

    script.onerror = (e) => {
      console.error("Falha ao carregar o script do Google Maps:", e);
      setMapsLoaded(false);
      setGoogleMapsError("Falha ao carregar o script do Google Maps. Verifique sua conexão e a chave da API.");
      googleMapsScriptAlreadyAdded = false;
      if (window.initGoogleMapsApiCallback) {
        delete window.initGoogleMapsApiCallback;
      }
    };

    document.head.appendChild(script);

    return () => {
       
    };
  }, [apiKey, mapRef, initialCenter, initializeMapAndServices]); 

  useEffect(() => {
    if (mapsLoaded && mapRef.current && initialCenter && !mapServiceInitializedRef.current) {
      initializeMapAndServices();
    }
  }, [mapsLoaded, mapRef, initialCenter, initializeMapAndServices]);

  return { map: mapInstance, placesService: placesServiceInstance, mapsLoaded, error: googleMapsError };
};

export default useGoogleMaps;