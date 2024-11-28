import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const [email, setEmail] = useState('');
  const [tokenExists, setTokenExists] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async function () {
      let response = await fetch(process.env.REACT_APP_RED + '/auth/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      });
      response = await response.json();
      if (response.success) {
        console.info("Usuario válido");
        setEmail(response.email);
        setTokenExists(true);
      } else {
        console.warn("Usuario inválido");
        console.error(response.message);
        navigate("/");  // Redirigir al login si el token es inválido
      }
    })();
  }, [token, navigate]);

  // Eliminar usuario
  async function handleDelete() {
    let response = await fetch(process.env.REACT_APP_RED + '/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    });
    response = await response.json();
    alert(response.message);
    if (response.success) {
        alert(response.message);
        setEmail('');
    } else {
        console.error(response.message);
    }
}

  // Editar usuario
  async function handleEdit() {
    Swal.fire({
      title: 'Editar Usuario',
      html: `
        <input id="email" class="swal2-input" value="${email}" placeholder="Correo electrónico" />
      `,
      focusConfirm: false,
      preConfirm: async () => {
        const newEmail = document.getElementById('email').value;
        
        if (!newEmail) {
          Swal.showValidationMessage('Por favor ingrese todos los campos');
          return false;
        }
        let response = await fetch(process.env.REACT_APP_RED + '/edit', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email: newEmail })
        });
        response = await response.json();
        if (response.success) {
          setEmail(response.email); // Actualiza el email en el estado
          return true;
        } else {
          Swal.showValidationMessage(response.message);
          return false;
        }
      }
    });
  }

  return (
    <div className="bg-black p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Dashboard</h1>

      {/* Mostrar información del usuario */}
      <div className="info-item">
        <strong>Correo electrónico:</strong> {email}
      </div>
      <div className="info-item">
        <strong>Token Existente:</strong> {tokenExists ? "Sí" : "No"}
      </div>

      {/* Tabla de usuarios */}
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

      {/* Botones de acción */}
      <div className="button-group mt-4">
        <button onClick={handleEdit} className="edit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Editar
        </button>
        <button onClick={() => handleDelete(email)} className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Eliminar
        </button>
      </div>
    </div>
  );
}
