/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const FETCH_URL = "http://localhost:8083";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "errored":
      return { ...state, isLoading: false, error: action.payload };
    case "citiesLoaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "cityLoaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cityCreated":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cityDeleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((c) => c.id !== action.payload),
        currentCity: {},
      };
    default:
      throw new Error("unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${FETCH_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "citiesLoaded", payload: data });
      } catch (err) {
        dispatch({ type: "errored", payload: err.message });
        alert(err.message);
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      // early return if city already loaded
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${FETCH_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "cityLoaded", payload: data });
      } catch (err) {
        dispatch({ type: "errored", payload: err.message });
        alert(err.message);
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${FETCH_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "cityCreated", payload: data });
    } catch (err) {
      dispatch({ type: "errored", payload: err.message });
      alert(err.message);
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${FETCH_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cityDeleted", payload: id });
    } catch (err) {
      dispatch({ type: "errored", payload: err.message });
      alert(err.message);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of CitiesProvider");
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
