import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth.jsx';

const SignIn = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <main className="page-shell py-8">
      <div className="mx-auto max-w-lg glass-panel rounded-[36px] p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">Acceso</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Inicia sesion</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Entra a tu panel para gestionar anuncios y editar propiedades.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="field-shell"
            id="email"
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
            {loading ? 'Cargando...' : 'Iniciar sesion'}
          </button>
          <OAuth />
        </form>

        <div className="mt-6 flex gap-2 text-sm text-slate-600">
          <p>No tienes una cuenta?</p>
          <Link to="/sign-up" className="font-semibold text-emerald-700 hover:text-slate-900">
            Registrarse
          </Link>
        </div>
        {error && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      </div>
    </main>
  );
};

export default SignIn;
