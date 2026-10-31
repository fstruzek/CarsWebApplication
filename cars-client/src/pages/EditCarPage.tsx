import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import CarForm from '../components/CarForm';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        setError(err instanceof Error ? err.message : 'Nie udało się pobrać danych do edycji.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCar(id);

    return () => {
      controller.abort();
    };
  }, [id]);

  async function handleUpdate(updatedCar: NewCar) {
    if (!id) return;
    await updateCar(id, updatedCar);
    navigate(`/cars/${id}`);
  }

  if (isLoading) return <p>Ładowanie formularza edycji...</p>;
  if (error) return <p className="error-message">Błąd: {error}</p>;
  if (!car) return <p>Nie znaleziono samochodu.</p>;

  const { id: _unusedId, ...initialFormValues } = car;

  return (
    <section className="page-section">
      <h1>Edycja samochodu: {car.brand} {car.model}</h1>
      <CarForm
        initialData={initialFormValues}
        submitLabel="Zapisz zmiany"
        onSubmit={handleUpdate}
      />
      <p>
        <Link to={`/cars/${car.id}`}>← Anuluj i wróć do szczegółów</Link>
      </p>
    </section>
  );
}