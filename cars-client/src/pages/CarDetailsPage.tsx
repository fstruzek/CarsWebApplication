import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pobranie danych z magazynu Zustand
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const isFavorite = car ? favoriteCarIds.includes(car.id) : false;

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    async function loadCar(carId: string) {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCarById(carId, controller.signal);
        setCar(data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err instanceof Error ? err.message : 'Nie udało się pobrać szczegółów samochodu.');
      } finally {
        setIsLoading(false);
      }
    }
    loadCar(id);
    return () => controller.abort();
  }, [id]);

  if (isLoading) return <p>Ładowanie szczegółów samochodu...</p>;
  if (error) return <p className="error-message">Błąd: {error}</p>;
  if (!car) return <p>Nie znaleziono samochodu.</p>;

  return (
    <section className="page-section">
      <h1>{car.brand} {car.model}</h1>
      <ul className="details-list">
        <li><strong>ID:</strong> {car.id}</li>
        <li><strong>Marka:</strong> {car.brand}</li>
        <li><strong>Model:</strong> {car.model}</li>
        <li><strong>Data produkcji:</strong> {car.productionDate.slice(0, 10)}</li>
      </ul>

      <div className="car-actions">
        <button
          type="button"
          className={isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}
          onClick={() => toggleFavorite(car.id)}
        >
          {isFavorite ? '★ Ulubiony' : '☆ Dodaj do ulubionych'}
        </button>
        <Link to={`/cars/${car.id}/edit`} className="btn btn-primary">Edytuj</Link>
        <Link to="/cars" className="btn btn-secondary">Powrót do listy</Link>
      </div>
    </section>
  );
}