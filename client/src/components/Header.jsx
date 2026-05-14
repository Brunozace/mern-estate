import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    setSearchTerm(searchTermFromUrl || '');
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);

    if (searchTerm.trim()) {
      urlParams.set('searchTerm', searchTerm.trim());
    } else {
      urlParams.delete('searchTerm');
    }

    const queryString = urlParams.toString();
    navigate(queryString ? `/search?${queryString}` : '/search');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(245,247,242,0.82)] backdrop-blur-xl">
      <div className="page-shell py-4">
        <div className="glass-panel flex flex-col gap-4 rounded-[28px] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="rounded-2xl bg-white/80 p-2 shadow-sm ring-1 ring-black/5">
                <img
                  src="/logo.png"
                  alt="Doble Gestion Propiedades Logo"
                  className="h-14 w-auto object-contain md:h-16"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Concepcion</p>
                <p className="font-['Space_Grotesk'] text-lg font-bold text-slate-800">
                  Doble Gestion
                </p>
              </div>
            </Link>

            <Link
              to={currentUser ? '/profile' : '/sign-in'}
              className="md:hidden flex items-center justify-center"
            >
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white"
                />
              ) : (
                <span className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white">
                  Ingresar
                </span>
              )}
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="relative flex-1 md:max-w-xl">
            <input
              type="text"
              placeholder="Buscar por ciudad, propiedad o palabra clave"
              className="field-shell pr-14 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-slate-900 text-white hover:-translate-y-[55%] hover:bg-emerald-700"
            >
              <FaSearch />
            </button>
          </form>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white/80"
            >
              Principal
            </Link>
            <Link
              to="/about"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white/80"
            >
              Sobre nosotros
            </Link>
            <Link
              to={currentUser ? '/profile' : '/sign-in'}
              className="ml-2 flex items-center gap-3 rounded-full bg-slate-900 px-3 py-2 text-white shadow-lg shadow-slate-900/15 hover:bg-emerald-700"
            >
              {currentUser ? (
                <>
                  <img
                    src={currentUser.avatar}
                    alt="avatar"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white/70"
                  />
                  <span className="max-w-[120px] truncate text-sm font-semibold">
                    {currentUser.username}
                  </span>
                </>
              ) : (
                <span className="px-2 text-sm font-semibold">Iniciar sesion</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
