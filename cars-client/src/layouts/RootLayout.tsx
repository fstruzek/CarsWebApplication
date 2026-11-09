import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
  // Pobranie liczby ulubionych samochodów z magazynu Zustand
  const favoriteCount = useCarUiStore((state) => state.favoriteCarIds.length);

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="navbar-brand">Cars Client</div>
        
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Strona główna
          </NavLink>
          <NavLink
            to="/cars"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Samochody
          </NavLink>
          <NavLink
            to="/cars/new"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Dodaj samochód
          </NavLink>
        </nav>

        {/* Licznik ulubionych wyświetlany w nawigacji */}
        <span className="favorite-counter">
          Ulubione: {favoriteCount}
        </span>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}