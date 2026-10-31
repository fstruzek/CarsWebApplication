import { Link, useNavigate } from 'react-router';
import CarForm from '../components/CarForm';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

export default function CreateCarPage() {
  const navigate = useNavigate();

  async function handleCreate(newCar: NewCar) {
    const created = await createCar(newCar);
    navigate(`/cars/${created.id}`);
  }

  return (
    <section className="page-section">
      <h1>Dodaj nowy samochód</h1>
      <CarForm submitLabel="Dodaj samochód" onSubmit={handleCreate} />
      <p>
        <Link to="/cars">← Anuluj i wróć do listy</Link>
      </p>
    </section>
  );
}