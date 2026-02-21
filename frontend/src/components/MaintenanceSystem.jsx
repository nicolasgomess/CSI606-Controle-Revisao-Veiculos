import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MaintenanceSystem() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState(null);
  const [maintenances, setMaintenances] = useState([]);
  
  const [type, setType] = useState('Troca de Óleo');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/vehicles')
      .then(res => res.json())
      .then(list => {
        const found = list.find(v => v.id === parseInt(id));
        setVehicle(found);
      });
    fetchMaintenances();
  }, [id]);

  const fetchMaintenances = () => {
    fetch(`http://localhost:3001/api/maintenances/${id}`)
      .then(res => res.json())
      .then(data => setMaintenances(data));
  };

  const resetForm = () => {
    setType('Troca de Óleo');
    setDate('');
    setCost('');
    setDescription('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { vehicle_id: id, type, date, description, cost: parseFloat(cost) || 0 };

    if (editingId) {
      await fetch(`http://localhost:3001/api/maintenances/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      alert('Revisão atualizada com sucesso!');
    } else {
      await fetch('http://localhost:3001/api/maintenances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      alert('Revisão salva com sucesso!');
    }
    
    fetchMaintenances();
    resetForm();
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setType(item.type);
    setDate(item.date);
    setCost(item.cost);
    setDescription(item.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMaintenance = async (maintenanceId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta revisão?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/maintenances/${maintenanceId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchMaintenances();
          if (editingId === maintenanceId) resetForm(); 
        } else {
          alert('Erro ao excluir a revisão.');
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const totalCost = maintenances.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`; 
  };

  if (!vehicle) return <div className="loading">Carregando veículo...</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/vehicles')} className="btn-back">← Voltar aos Veículos</button>
      
      <div className="maintenance-header" style={{ position: 'relative' }}>
        <h2>Revisões: {vehicle.model}</h2>
        <p className="subtitle">Placa: {vehicle.plate} | Km: {vehicle.mileage}</p>
        
        <div style={{ background: '#dcfce7', color: '#166534', padding: '15px 25px', borderRadius: '12px', display: 'inline-block', marginTop: '15px', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid #bbf7d0' }}>
          Custo Total: {formatCurrency(totalCost)}
        </div>
      </div>

      <div className="maintenance-layout">
        <div className="form-section">
          {/* APENAS ESTE TÍTULO ESTÁ BRANCO AGORA */}
          <h3 style={{ color: editingId ? '#0369a1' : 'white' }}>
            {editingId ? '✏️ Editando Manutenção' : 'Nova Manutenção'}
          </h3>
          
          <form onSubmit={handleSubmit} className="styled-form">
            <label>Tipo</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option>Troca de Óleo</option>
              <option>Revisão Geral</option>
              <option>Freios</option>
              <option>Pneus</option>
              <option>Outros</option>
            </select>
            
            <label>Data</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            
            <label>Valor (R$)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0"
              value={cost} 
              onChange={e => setCost(e.target.value)} 
              required 
            />
            
            <label>Descrição</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="3" />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {editingId ? 'Salvar Alterações' : 'Registrar'}
              </button>
              
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-primary" style={{ flex: 1, backgroundColor: '#64748b' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="history-section">
          {/* E ESTE TÍTULO TAMBÉM ESTÁ BRANCO */}
          <h3 style={{ color: 'white' }}>Histórico de Serviços</h3>
          
          {maintenances.length === 0 ? <p>Nenhum registro encontrado.</p> : (
            <ul className="timeline">
              {maintenances.map((item) => (
                <li key={item.id} className="timeline-item">
                  <span className="date-tag">{formatDate(item.date)}</span>
                  <div className="content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{item.type}</strong>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', color: '#0369a1', fontWeight: 'bold' }}>
                          {formatCurrency(item.cost || 0)}
                        </span>
                        
                        <button 
                          onClick={() => handleEditClick(item)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0 5px' }}
                          title="Editar Revisão"
                        >
                          ✏️
                        </button>

                        <button 
                          onClick={() => handleDeleteMaintenance(item.id)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0 5px' }}
                          title="Excluir Revisão"
                        >
                          🗑️
                        </button>
                      </div>

                    </div>
                    <p style={{ marginTop: '8px' }}>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintenanceSystem;