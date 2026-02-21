import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function VehicleReport() {
  const [vehicles, setVehicles] = useState([]);
  const [sortBy, setSortBy] = useState('modeloAsc');

  useEffect(() => {
    fetch('http://localhost:3001/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error(err));
  }, []);

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortBy === 'modeloAsc') return a.model.localeCompare(b.model);
    if (sortBy === 'modeloDesc') return b.model.localeCompare(a.model);
    if (sortBy === 'anoDesc') return b.year - a.year;
    if (sortBy === 'anoAsc') return a.year - b.year;
    if (sortBy === 'placaAsc') return a.plate.localeCompare(b.plate);
    if (sortBy === 'kmAsc') return a.mileage - b.mileage;
    if (sortBy === 'kmDesc') return b.mileage - a.mileage;
    // Novas opções de ordenação pelas revisões:
    if (sortBy === 'revDesc') return b.maintenanceCount - a.maintenanceCount; 
    if (sortBy === 'revAsc') return a.maintenanceCount - b.maintenanceCount;
    return 0;
  });

  return (
    <div className="container">
      <Link to="/" className="btn-back" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Voltar para o Dashboard
      </Link>
      
      <h2 className="page-title">Relatório de Veículos</h2>
      
      <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', backgroundColor: '#f8fafc' }}
            >
              <option value="modeloAsc">Modelo (A-Z)</option>
              <option value="modeloDesc">Modelo (Z-A)</option>
              <option value="anoDesc">Ano (Mais Novos)</option>
              <option value="anoAsc">Ano (Mais Antigos)</option>
              <option value="placaAsc">Placa (A-Z)</option>
              <option value="kmAsc">Quilometragem (Menor KM)</option>
              <option value="kmDesc">Quilometragem (Maior KM)</option>
              <option value="revDesc">Mais Revisões</option>
              <option value="revAsc">Menos Revisões</option>
            </select>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Nenhum veículo cadastrado no momento.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--secondary)' }}>
                <th style={{ padding: '15px 10px' }}>Modelo</th>
                <th style={{ padding: '15px 10px' }}>Ano</th>
                <th style={{ padding: '15px 10px' }}>Placa</th>
                <th style={{ padding: '15px 10px' }}>Quilometragem</th>
                <th style={{ padding: '15px 10px', textAlign: 'center' }}>Qtd. Revisões</th>
              </tr>
            </thead>
            <tbody>
              {sortedVehicles.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '15px 10px', fontWeight: 'bold', color: 'var(--primary)' }}>{v.model}</td>
                  <td style={{ padding: '15px 10px' }}>{v.year}</td>
                  <td style={{ padding: '15px 10px' }}><span className="badge">{v.plate}</span></td>
                  <td style={{ padding: '15px 10px' }}>{v.mileage} km</td>
                  <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                    <span style={{ background: '#e2e8f0', color: '#475569', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {v.maintenanceCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default VehicleReport;