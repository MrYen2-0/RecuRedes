import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`${process.env.REACT_APP_RED}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verifica si la respuesta del servidor tiene un status 200-299
      if (!response.ok) {
        const errorData = await response.json(); // Convertir a JSON para leer el mensaje
        throw new Error(errorData.message || 'Error al registrar');
      }

      const responseData = await response.json(); // Si todo va bien, convertir a JSON
      alert(responseData.message); // Mostrar el mensaje del servidor
      navigate('/'); // Redirigir al login o página de inicio

    } catch (error) {
      // Mostrar error ya sea de red o de validación del servidor
      alert(error.message || 'Error al registrar');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Regístrate</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="bg-purple-500 text-white w-full py-2 rounded hover:bg-purple-600">
          Registrarse
        </button>
      </form>
    </div>
  );
}
