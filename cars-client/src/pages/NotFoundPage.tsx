import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="page-section">
      <h1>404 - Nie znaleziono strony</h1>
      <p>Podany adres URL nie istnieje w aplikacji.</p>
      <Link to="/" className="btn btn-primary">
        Wróć na stronę główną
      </Link>
    </section>
  );
}