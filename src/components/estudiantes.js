import React, { useState, useEffect } from 'react';
import '../css/estyles.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Estudiantes() {
  const navigate = useNavigate();

  // Estado para la búsqueda y lista de estudiantes
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/estudiantes');
        setStudents(response.data); // Establecer los estudiantes obtenidos
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    fetchStudents();
  }, []);

  const [formData, setFormData] = useState({
    Nombre: '',
    Genero: '',
    Codigo: ''
  });
  const [error, setError] = useState(null);

  // Filtrar estudiantes según la búsqueda
  const filteredStudents = students.filter(student =>
    student.Nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Manejar el envío del formulario para crear un estudiante
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/estudiantes', formData);
      if (response.status === 201) {
        setStudents([...students, response.data]); // Agregar el nuevo estudiante a la lista
        setFormData({ Nombre: '', Genero: '', Codigo: ''});
        setError(null);
      }
    } catch (error) {
      setError('Hubo un error en el registro, intente nuevamente.');
      console.error('Error en el registro:', error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  return (
    <div className='origen'>
      <div className='body'>
        <div className="container">
          <input
            type="text"
            className="search-bar"
            placeholder="Busqueda"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <h1 className='h1Estudiante'>Estudiantes</h1>
          <div className="students-background"></div>
          <div className="students-list">
            {filteredStudents.map((student, index) => (
              <StudentCard key={index} name={student.Nombre} gender={student.Genero} code={student.Codigo} />
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
                id="Nombre" 
                type="text" 
                required 
                className='crearGenero' 
                placeholder='Nombre'
                value={formData.Nombre} 
                onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
            />
            <input
                id="Genero" 
                type="text" 
                required 
                className='crearGenero' 
                placeholder='Genero'
                value={formData.Genero} 
                onChange={(e) => setFormData({ ...formData, Genero: e.target.value })}
            />
            <input
                id="Codigo" 
                type="text" 
                required 
                className='crearGenero' 
                placeholder='Codigo'
                value={formData.Codigo} 
                onChange={(e) => setFormData({ ...formData, Codigo: e.target.value })}
            />
            {error && <p className="error">{error}</p>}
            <button className="view-all-button" type="submit">Crear Estudiante</button>
          </form>
        </div>
      </div>
      <button className="back-button" onClick={handleBack}>Regresar</button>
    </div>
  );
}

function StudentCard({ name, gender, code }) {
  return (
    <div className={`student-card ${gender}`}>
      <div className="avatar"></div>
      <span>{name} | Género: {gender} | Código: {code} </span>
    </div>
  );
}

export default Estudiantes;
