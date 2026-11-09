import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import CarCard from '../components/CarCard';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobranie danych z magazynu Zustand
  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCars() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCars(controller.signal);
        setCars(data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err instanceof Error ? err.message : 'Błąd podczas pobierania danych.');
      } finally {
        setIsLoading(false);
      }
    }
    loadCars();
    return () => controller.abort();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten samochód?');
    if (!confirmed) return;
    try {
      await deleteCar(id);
      removeFavorite(id); // Krok 17: usunięcie z ulubionych po skasowaniu
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Nie udało się usunąć samochodu.');
    }
  }

  // Krok 16: Logika filtrowania
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);
    const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);
    return matchesSearch && matchesFavorite;
  });

  if (isLoading) return <p>Ładowanie listy samochodów...</p>;
  if (error) return <p className="error-message">Błąd: {error}</p>;

  return (
    <section className="page-section">
      <div className="section-header">
        <h1>Lista samochodów</h1>
        <Link to="/cars/new" className="btn btn-primary">+ Dodaj samochód</Link>
      </div>

      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Szukaj po marce lub modelu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="favorite-filter">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
          />
          Tylko ulubione
        </label>
      </div>

      {visibleCars.length === 0 ? (
        <p>Brak samochodów do wyświetlenia.</p>
      ) : (
        <div className="car-list">
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}