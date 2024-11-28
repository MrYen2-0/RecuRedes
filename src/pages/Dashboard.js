import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import checkToken from '../validartoken';

// Función para validar el token y verificar si ha expirado

export default function Dashboard() {
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async function () {
        const token = localStorage.getItem('token');
        let response = await fetch(process.env.REACT_APP_API_URL + '/auth/token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
        response = await response.json();
        if (response.success) {
            console.info("usuario valido");
        } else {
            console.warn("usuario invalido");
            console.error(response.message);
            navigate("/");
        }
    })();
}, []);
  
  const handleDelete = (email) => {
    const updatedUsers = users.filter(user => user.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <div className="bg-black p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Dashboard</h1>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="p-2">Email</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(user.email)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
