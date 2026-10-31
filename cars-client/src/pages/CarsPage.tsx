import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCars(controller.signal);
        setCars(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Błąd podczas pobierania danych.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCars();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten samochód?');
    if (!confirmed) return;

    try {
      await deleteCar(id);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Nie udało się usunąć samochodu.');
    }
  }

  const filteredCars = cars.filter((car) => {
    const query = filterText.toLowerCase();
    return (
      car.brand.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query)
    );
  });

  if (isLoading) return <p>Ładowanie listy samochodów...</p>;
  if (error) return <p className="error-message">Błąd: {error}</p>;

  return (
    <section className="page-section">
      <div className="section-header">
        <h1>Lista samochodów</h1>
        <Link to="/cars/new" className="btn btn-primary">
          + Dodaj samochód
        </Link>
      </div>

      <div className="filter-box">
        <input
          type="text"
          placeholder="Filtruj po marce lub modelu..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {filteredCars.length === 0 ? (
        <p>Brak samochodów do wyświetlenia.</p>
      ) : (
        <div className="car-list">
          {filteredCars.map((car) => (
            <article key={car.id} className="car-card">
              <div>
                <h2>
                  {car.brand} {car.model}
                </h2>
                <p>
                  Rok/Data: {car.productionDate.slice(0, 10)} | Pojemność: {car.engineCapacity} cm³ |
                  Spalanie: {car.averageFuelConsumption} l/100km
                </p>
              </div>
              <div className="car-actions">
                <Link to={`/cars/${car.id}`} className="btn btn-secondary">
                  Szczegóły
                </Link>
                <Link to={`/cars/${car.id}/edit`} className="btn btn-secondary">
                  Edytuj
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(car.id)}
                >
                  Usuń
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}