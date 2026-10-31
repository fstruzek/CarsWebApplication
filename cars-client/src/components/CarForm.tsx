import { useState, type FormEvent } from 'react';
import type { NewCar } from '../models/Car';

interface CarFormProps {
  initialData?: NewCar;
  submitLabel: string;
  onSubmit: (car: NewCar) => Promise<void>;
}

const defaultCar: NewCar = {
  brand: '',
  model: '',
  doorsNumber: 5,
  luggageCapacity: 400,
  engineCapacity: 1600,
  fuelType: 0,
  productionDate: '2023-01-01',
  averageFuelConsumption: 6.0,
  bodyType: 0,
};

export default function CarForm({ initialData, submitLabel, onSubmit }: CarFormProps) {
  const [formData, setFormData] = useState<NewCar>(initialData ?? defaultCar);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas zapisu.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <label>
        Marka:
        <input
          type="text"
          required
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        />
      </label>

      <label>
        Model:
        <input
          type="text"
          required
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
      </label>

      <label>
        Liczba drzwi (2-5):
        <input
          type="number"
          min={2}
          max={5}
          required
          value={formData.doorsNumber}
          onChange={(e) => setFormData({ ...formData, doorsNumber: Number(e.target.value) })}
        />
      </label>

      <label>
        Pojemność bagażnika (l):
        <input
          type="number"
          min={0}
          required
          value={formData.luggageCapacity}
          onChange={(e) => setFormData({ ...formData, luggageCapacity: Number(e.target.value) })}
        />
      </label>

      <label>
        Pojemność silnika (cm³):
        <input
          type="number"
          min={1}
          required
          value={formData.engineCapacity}
          onChange={(e) => setFormData({ ...formData, engineCapacity: Number(e.target.value) })}
        />
      </label>

      <label>
        Rodzaj paliwa (0 - Petrol, 1 - Hybrid, 2 - Diesel, 3 - LPG):
        <input
          type="number"
          min={0}
          max={3}
          required
          value={formData.fuelType}
          onChange={(e) => setFormData({ ...formData, fuelType: Number(e.target.value) })}
        />
      </label>

      <label>
        Data produkcji:
        <input
          type="date"
          required
          value={formData.productionDate.slice(0, 10)}
          onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
        />
      </label>

      <label>
        Średnie spalanie (l/100km):
        <input
          type="number"
          step="0.1"
          min={0.1}
          required
          value={formData.averageFuelConsumption}
          onChange={(e) =>
            setFormData({ ...formData, averageFuelConsumption: Number(e.target.value) })
          }
        />
      </label>

      <label>
        Typ nadwozia (0 - Hatchback, 1 - Sedan, 2 - Kombi, 3 - SUV, 4 - Road):
        <input
          type="number"
          min={0}
          max={4}
          required
          value={formData.bodyType}
          onChange={(e) => setFormData({ ...formData, bodyType: Number(e.target.value) })}
        />
      </label>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Zapisywanie...' : submitLabel}
      </button>
    </form>
  );
}