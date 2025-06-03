import { NextResponse } from 'next/server';
import axios from "axios";

function haversineDistance(coords1, coords2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000;

  const lat1 = toRad(coords1.lat);
  const lon1 = toRad(coords1.lng);
  const lat2 = toRad(coords2.lat);
  const lon2 = toRad(coords2.lng);

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const typesParam = searchParams.get("types");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const priceLevelFilter = searchParams.get("priceLevel");

  const serverApiKey = process.env.MAPS_SERVER_API_KEY;

  if (!state || !city || !serverApiKey) {
    return new Response(JSON.stringify({ error: "Parâmetros obrigatórios (state, city) ou API key do servidor estão faltando." }), {
      status: 400,
    });
  }

  const radius = 50000;
  let locationBiasParam = '';
  let cityCoords = null;

  try {
    if (lat && lng) {
      cityCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
      locationBiasParam = `circle:${radius}@${lat},${lng}`;
    } else {
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city + ', ' + state + ', Brazil')}&key=${serverApiKey}`
      );

      if (geocodeResponse.data.status === 'OK' && geocodeResponse.data.results.length > 0) {
        cityCoords = geocodeResponse.data.results[0].geometry.location;
        locationBiasParam = `circle:${cityCoords.lat},${cityCoords.lng}`;
      } else {
        return new Response(JSON.stringify({ error: "Não foi possível encontrar coordenadas para a cidade/estado fornecidas para a busca." }), {
          status: 404,
        });
      }
    }

    const allPlaces = [];
    const seenPlaceIds = new Set();
    const selectedFrontendTypes = typesParam ? typesParam.split(',') : [];

    const typeToSearchQueryMap = {
      "restaurant": "restaurante",
      "bar": "bar",
      "cafe": "café",
    };

    const queriesToPerform = new Set();
    const typesToFilterBy = new Set(selectedFrontendTypes);

    if (selectedFrontendTypes.length === 0) {
      queriesToPerform.add(`restaurantes em ${city}, ${state}`);
      queriesToPerform.add(`bares em ${city}, ${state}`);
      queriesToPerform.add(`cafés em ${city}, ${state}`);
    } else {
      selectedFrontendTypes.forEach(typeValue => {
        const queryTerm = typeToSearchQueryMap[typeValue];
        if (queryTerm) {
          queriesToPerform.add(`${queryTerm} em ${city}, ${state}`);
        }
      });
    }

    const searchPromises = Array.from(queriesToPerform).map(async (queryText) => {
      let pageToken = null;
      let attempt = 0;
      const maxAttempts = 3;
      const placesForQuery = [];

      do {
        attempt++;
        if (attempt > maxAttempts) {
          break;
        }

        try {
          const textSearchParams = {
            query: queryText,
            key: serverApiKey,
            pagetoken: pageToken,
            location_bias: locationBiasParam,
            fields: "place_id,name,geometry,rating,user_ratings_total,photos,price_level,types,business_status,formatted_address,vicinity,opening_hours",
          };

          const textSearchResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json`,
            { params: textSearchParams }
          );

          if (textSearchResponse.data.status === 'OK' && textSearchResponse.data.results) {
            textSearchResponse.data.results.forEach(place => {
              if (
                place.place_id &&
                !seenPlaceIds.has(place.place_id) &&
                place.name &&
                place.geometry?.location &&
                place.business_status !== 'PERMANENTLY_CLOSED'
              ) {
                placesForQuery.push(place);
                seenPlaceIds.add(place.place_id);
              }
            });
            pageToken = textSearchResponse.data.next_page_token;
            if (pageToken) {
              await new Promise(resolve => setTimeout(resolve, 2200));
            }
          } else if (textSearchResponse.data.status === 'ZERO_RESULTS') {
            pageToken = null;
          } else if (textSearchResponse.data.status === 'INVALID_REQUEST' && textSearchResponse.data.error_message?.includes('pagetoken')) {
            pageToken = null;
          } else {
            pageToken = null;
          }
        } catch (textSearchError) {
          pageToken = null;
        }
      } while (pageToken);
      return placesForQuery;
    });

    const resultsFromAllQueries = await Promise.all(searchPromises);
    resultsFromAllQueries.forEach(queryPlaces => allPlaces.push(...queryPlaces));

    const uniquePlaces = Array.from(new Set(allPlaces.map(p => p.place_id)))
      .map(id => allPlaces.find(p => p.place_id === id));

    const filteredByDistance = uniquePlaces.filter(place => {
      if (!cityCoords || !place.geometry?.location) return false;
      const dist = haversineDistance(cityCoords, place.geometry.location);
      return dist <= radius;
    });

    const filteredPlaces = filteredByDistance.filter(place => {
      const passesTypeFilter = typesToFilterBy.size === 0 ||
        Array.from(typesToFilterBy).some(selectedType => place.types && place.types.includes(selectedType));

      const passesRating = !minRating || (place.rating && place.rating >= minRating);

      const passesPriceLevel = !priceLevelFilter ||
        (place.price_level !== undefined &&
          place.price_level !== null &&
          place.price_level === parseInt(priceLevelFilter, 10));

      return passesTypeFilter && passesRating && passesPriceLevel;
    });

    const sortedPlaces = filteredPlaces.sort((a, b) => {
      const openNowA = a.opening_hours?.open_now === true;
      const openNowB = b.opening_hours?.open_now === true;

      if (openNowA && !openNowB) return -1;
      if (!openNowA && openNowB) return 1;

      if (a.rating && b.rating) return b.rating - a.rating;
      if (a.rating && !b.rating) return -1;
      if (!a.rating && b.rating) return 1;
      return 0;
    });

    return new Response(JSON.stringify({
      status: "OK",
      results: sortedPlaces,
      total: sortedPlaces.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    let userErrorMessage = "Ocorreu um erro ao buscar estabelecimentos. Por favor, tente novamente.";
    if (axios.isAxiosError(error) && error.response?.data?.error_message) {
      userErrorMessage = `Erro da API Google: ${error.response.data.error_message}`;
    } else if (error.message) {
      userErrorMessage = `Erro interno: ${error.message}`;
    }
    return new Response(JSON.stringify({
      error: userErrorMessage,
      details: error.message,
    }), {
      status: 500,
    });
  }
}