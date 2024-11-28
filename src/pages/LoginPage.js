import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`${process.env.REACT_APP_RED}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    response = await response.json();
    console.log(response.message)
    const token = response.token;

      // Guardar el token en localStorage
      localStorage.setItem('token', token);
      console.info(token);
      if (response.success) {
        alert('Inicio de sesión exitoso');
      navigate('/dashboard');
      }else {
        console.log(response.message)
      }
      
    } catch (error) {
      alert(error.response?.message || 'Error en el inicio de sesión :c');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
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
        Iniciar Sesión
      </button>
      <p className="text-center mt-4">
        ¿No tienes una cuenta? <a href="/register" className="text-purple-500">Regístrate</a>
      </p>
    </form>
  </div>
);
}
