import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Nie udało się pobrać szczegółów samochodu.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCar(id);

    return () => {
      controller.abort();
    };
  }, [id]);

  if (isLoading) return <p>Ładowanie szczegółów samochodu...</p>;
  if (error) return <p className="error-message">Błąd: {error}</p>;
  if (!car) return <p>Nie znaleziono samochodu.</p>;

  return (
    <section className="page-section">
      <h1>
        {car.brand} {car.model}
      </h1>
      <ul className="details-list">
        <li><strong>ID:</strong> {car.id}</li>
        <li><strong>Marka:</strong> {car.brand}</li>
        <li><strong>Model:</strong> {car.model}</li>
        <li><strong>Liczba drzwi:</strong> {car.doorsNumber}</li>
        <li><strong>Pojemność bagażnika:</strong> {car.luggageCapacity} l</li>
        <li><strong>Pojemność silnika:</strong> {car.engineCapacity} cm³</li>
        <li><strong>Rodzaj paliwa (kod):</strong> {car.fuelType}</li>
        <li><strong>Data produkcji:</strong> {car.productionDate.slice(0, 10)}</li>
        <li><strong>Średnie spalanie:</strong> {car.averageFuelConsumption} l/100km</li>
        <li><strong>Typ nadwozia (kod):</strong> {car.bodyType}</li>
      </ul>

      <div className="car-actions">
        <Link to={`/cars/${car.id}/edit`} className="btn btn-primary">
          Edytuj
        </Link>
        <Link to="/cars" className="btn btn-secondary">
          Powrót do listy
        </Link>
      </div>
    </section>
  );
}