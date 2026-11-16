import React, { createContext, useContext, useState, useCallback } from 'react';

// Estado global da lista de lugares, compartilhado entre todas as telas
const PlacesContext = createContext(null);

export function PlacesProvider({ children }) {
  const [places, setPlaces] = useState([]);

  const addPlace = useCallback((place) => {
    const newPlace = { ...place, id: String(Date.now()) };
    setPlaces((prev) => [newPlace, ...prev]);
    return newPlace;
  }, []);

  const updatePlace = useCallback((id, changes) => {
    setPlaces((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }, []);

  const removePlace = useCallback((id) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <PlacesContext.Provider value={{ places, addPlace, updatePlace, removePlace }}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const ctx = useContext(PlacesContext);
  if (!ctx) throw new Error('usePlaces deve ser usado dentro de PlacesProvider');
  return ctx;
}
