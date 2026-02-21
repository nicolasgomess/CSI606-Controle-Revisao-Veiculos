import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🚗 PitStop</div>
      <ul className="navbar-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/vehicles">Meus Veículos</Link></li>
        <li><Link to="/add">Cadastrar Veículo</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;