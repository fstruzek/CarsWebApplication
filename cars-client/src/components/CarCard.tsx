import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  const isFavorite = useCarUiStore((state) => state.favoriteCarIds.includes(car.id));
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  return (
    <article className="car-card">
      <div>
        <h2>{car.brand} {car.model}</h2>
        <p>
          Rok: {car.productionDate.slice(0, 10)} | Pojemność: {car.engineCapacity} cm³ | 
          Spalanie: {car.averageFuelConsumption} l/100km
        </p>
      </div>

      <div className="car-actions">
        <button
          type="button"
          className={isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}
          onClick={() => toggleFavorite(car.id)}
        >
          {isFavorite ? 'Ulubiony' : 'Ulubione'}
        </button>

        <Link to={`/cars/${car.id}`} className="btn btn-secondary">Szczegóły</Link>
        <Link to={`/cars/${car.id}/edit`} className="btn btn-secondary">Edytuj</Link>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(car.id)}>Usuń</button>
      </div>
    </article>
  );
}