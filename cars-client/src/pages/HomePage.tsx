import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section className="page-section">
      <h1>Witaj w aplikacji Cars Client</h1>
      <p>
        Aplikacja kliencka napisana w React + TypeScript + Vite do zarządzania bazą samochodów
        (operacje CRUD z wykorzystaniem lokalnego serwera json-server).
      </p>
      <Link to="/cars" className="btn btn-primary">
        Przejdź do listy samochodów
      </Link>
    </section>
  );
}