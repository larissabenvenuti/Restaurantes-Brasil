import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const IBGE_STATES_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
const IBGE_CITIES_URL = (state) =>
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`;

export const useLocation = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [errorStates, setErrorStates] = useState(null);
  const [errorCities, setErrorCities] = useState(null);

  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      setErrorStates(null);
      try {
        const response = await axios.get(IBGE_STATES_URL);
        setStates(response.data);
      } catch (error) {
        setErrorStates("Error fetching states");
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      setErrorCities(null);
      try {
        const response = await axios.get(IBGE_CITIES_URL(selectedState));
        setCities(response.data);
        setSelectedCity(""); 
      } catch (error) {
        setErrorCities("Error fetching cities");
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState]);

  const loading = useMemo(() => loadingStates || loadingCities, [loadingStates, loadingCities]);

  return {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    loading,
    errorStates,
    errorCities,
    setSelectedState,
    setSelectedCity,
  };
};
