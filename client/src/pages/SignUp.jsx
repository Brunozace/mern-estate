import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth.jsx';

const SignUp = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <main className="page-shell py-8">
      <div className="mx-auto max-w-lg glass-panel rounded-[36px] p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">Registro</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Crea tu cuenta</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Configura tu perfil comercial y publica propiedades con una presencia mas sólida desde el
          primer dia.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="field-shell"
            id="username"
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            className="field-shell"
            id="email"
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Telefono"
            className="field-shell"
            id="phone"
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Contrasena"
            className="field-shell"
            id="password"
            onChange={handleChange}
          />

          <button className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-emerald-700">
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
          <OAuth />
        </form>

        <div className="mt-6 flex gap-2 text-sm text-slate-600">
          <p>Ya tienes una cuenta?</p>
          <Link to="/sign-in" className="font-semibold text-emerald-700 hover:text-slate-900">
            Iniciar sesion
          </Link>
        </div>
        {error && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      </div>
    </main>
  );
};

export default SignUp;
