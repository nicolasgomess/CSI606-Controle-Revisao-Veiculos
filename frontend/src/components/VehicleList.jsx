import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id, model) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o ${model}? Todas as revisões dele também serão apagadas.`);
    
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/vehicles/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        } else {
          alert('Erro ao excluir o veículo.');
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.model.toLowerCase().includes(searchLower) ||
      vehicle.plate.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container">
      <h2 className="page-title">Meus Veículos</h2>
      
      {/* Barra de Pesquisa */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="🔍 Pesquisar por modelo ou placa..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* AQUI ESTÃO AS MENSAGENS COM A COR BRANCA */}
      {vehicles.length === 0 ? (
        <p className="empty-msg" style={{ textAlign: 'center', color: 'white' }}>Nenhum veículo cadastrado no sistema.</p>
      ) : filteredVehicles.length === 0 ? (
        <p className="empty-msg" style={{ textAlign: 'center', color: 'white' }}>Nenhum veículo corresponde à sua busca.</p>
      ) : (
        <div className="vehicle-grid">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <div className="card-header">
                <h3>{vehicle.model}</h3>
                <div className="header-actions">
                  <span className="badge">{vehicle.plate}</span>
                  <button onClick={() => handleDelete(vehicle.id, vehicle.model)} className="btn-delete" title="Excluir Veículo">
                    🗑️
                  </button>
                </div>
              </div>
              <p>Ano: {vehicle.year}</p>
              <p>Km: {vehicle.mileage}</p>
              <Link to={`/vehicle/${vehicle.id}`} className="btn-details">
                Gerenciar Revisões
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VehicleList;