"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [count, setCount] = useState(1);
  const [restaurants, setRestaurants] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        setCities([]);
        setSelectedCity("");
        setLoading(true);
        try {
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`
          );
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCities();
    }
  }, [selectedState]);

  const fetchRestaurants = async () => {
    if (!selectedCity || !selectedState) {
      alert("Por favor, selecione uma cidade e um estado!");
      return;
    }

    setLoading(true);
    try {
      const cityName =
        cities.find((city) => city.id === parseInt(selectedCity))?.nome ||
        selectedCity;
      const stateName =
        states.find((state) => state.id === parseInt(selectedState))?.nome ||
        selectedState;

      if (!cityName || !stateName) {
        throw new Error("Cidade ou estado não encontrados.");
      }

      const searchLocation = `${cityName},${stateName},Brasil`;
      const mockRestaurants = [
        { id: 1, name: "Restaurante 1" },
        { id: 2, name: "Restaurante 2" },
        { id: 3, name: "Restaurante 3" },
        { id: 4, name: "Restaurante 4" },
        { id: 5, name: "Restaurante 5" },
        { id: 6, name: "Restaurante 6" },
        { id: 7, name: "Restaurante 7" },
      ];

      setRestaurants(mockRestaurants);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar restaurantes:", error);
      alert(
        "Não foi possível carregar os restaurantes. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev === 4 ? 1 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    setLoading(true);
    try {
      const response = await fetch(
        "https://67d2fd0a8bca322cc268c28e.mockapi.io/restaurantes/reserva",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Reserva enviada com sucesso!");
        setShowForm(false);
        e.target.reset();
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao enviar a reserva. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans text-gray-800">
      <section
        className="relative h-screen flex items-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-black/70"></div>
        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-2xl text-left">
            <h1 className="text-6xl font-bold leading-tight mb-6 text-white">
              <span className="text-green-400">Descubra</span> os Melhores
              Restaurantes do Brasil
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Explore opções deliciosas e experiências gastronômicas únicas em
              cada cidade. Encontre, avalie e faça reservas em seus restaurantes
              preferidos!
            </p>

            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                Encontre restaurantes perto de você
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Selecione um estado</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    disabled={!selectedState || loading}
                  >
                    <option value="">
                      {loading ? "Carregando..." : "Selecione uma cidade"}
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchRestaurants}
                    disabled={!selectedCity || loading}
                    className={`w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 transition-all duration-300 ${
                      !selectedCity || loading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {loading ? "Buscando..." : "Buscar Restaurantes"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 100-14 7 7 0 000 14z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">1000+ cidades</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-3.182 3.182a1 1 0 00-.313.819V14a1 1 0 001 1h12a1 1 0 001-1v-1.192a1 1 0 00-.313-.819l-3.182-3.182A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      20.000+ restaurantes
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v4H5a1 1 0 000 2h4a1 1 0 001-1v-1h4a1 1 0 001 1v1a1 1 0 001-1v-1h1a1 1 0 000-2h-1V6a4 4 0 00-4-4H10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Reservas online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            fill="#ffffff"
          >
            <path
              fillOpacity="1"
              d="M0,192L60,176C120,160,240,128,360,138.7C480,149,600,203,720,208C840,213,960,171,1080,154.7C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">
            Por que escolher nossa plataforma?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-500 text-4xl mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
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
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-700">
                Busca Simples
              </h3>
              <p className="text-gray-600">
                Encontre facilmente os melhores restaurantes em qualquer cidade
                do Brasil com nossa ferramenta de busca intuitiva.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-500 text-4xl mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-700">
                Reservas Online
              </h3>

              <p className="text-gray-600 mb-4">
                Reserve sua mesa com apenas alguns cliques e garanta uma
                experiência gastronômica sem filas ou esperas.
              </p>

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300"
              >
                Fazer Reserva
              </button>

              {showForm && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-medium text-purple-700 mb-4">
                    Preencha os dados para sua reserva
                  </h4>
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nome completo:
                      </label>
                      <input
                        type="text"
                        name="nome"
                        placeholder="Seu nome completo"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        E-mail:
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="seu.email@exemplo.com"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Telefone:
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Restaurante:
                      </label>
                      <select
                        name="restaurante"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      >
                        <option value="">Selecione um restaurante</option>
                        {restaurants.length > 0 ? (
                          restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                              {restaurant.name}
                            </option>
                          ))
                        ) : (
                          <option value="Restaurante Exemplo">
                            Restaurante Exemplo
                          </option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Data:
                      </label>
                      <input
                        type="date"
                        name="data"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Horário:
                      </label>
                      <input
                        type="time"
                        name="horario"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Número de pessoas:
                      </label>
                      <input
                        type="number"
                        name="pessoas"
                        min="1"
                        max="20"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300"
                      >
                        Confirmar Reserva
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-500 text-4xl mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-700">
                Atendimento Agilizado
              </h3>
              <p className="text-gray-600">
                Conte com um suporte rápido e eficiente para resolver suas
                dúvidas e garantir uma experiência tranquila.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
