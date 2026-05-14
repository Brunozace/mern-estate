import { useState } from 'react';
import { FaArrowRight, FaEdit, FaPlus, FaSignOutAlt, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../redux/user/userSlice.js';

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'No se pudo cerrar sesion');
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (err) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (err) {
      console.log(err.message);
    }
  };

  const getListingPrice = (listing) => {
    if (listing.offer && Number.isFinite(Number(listing.discountPrice))) {
      return Number(listing.discountPrice);
    }
    return Number(listing.regularPrice) || 0;
  };

  return (
    <main className="page-shell py-8">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel rounded-[36px] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
                Mi perfil
              </p>
              <h1 className="mt-3 text-4xl font-bold text-slate-900">Gestiona tu presencia comercial</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Ajusta tus datos, actualiza tu contacto y mantén visible una identidad clara para
                quienes revisan tus anuncios.
              </p>
            </div>
            <div className="soft-card rounded-[28px] p-4 text-center md:min-w-[220px]">
              <img
                src={currentUser.avatar}
                alt="perfil"
                className="mx-auto h-24 w-24 rounded-[28px] object-cover ring-4 ring-white"
              />
              <p className="mt-4 font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                {currentUser.username}
              </p>
              <p className="mt-1 text-sm text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="text"
                placeholder="Nombre de usuario"
                id="username"
                defaultValue={currentUser.username}
                onChange={handleChange}
                className="field-shell"
              />

              <input
                type="text"
                placeholder="Email"
                id="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="field-shell"
              />

              <input
                type="text"
                placeholder="Telefono"
                id="phone"
                defaultValue={currentUser.phone || ''}
                onChange={handleChange}
                className="field-shell"
              />

              <input
                type="password"
                placeholder="Contrasena"
                id="password"
                onChange={handleChange}
                className="field-shell"
              />
            </div>

            <button className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-emerald-700">
              {loading ? 'Actualizando...' : 'Guardar cambios'}
            </button>

            <Link
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-emerald-700 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 hover:bg-emerald-700 hover:text-white"
              to="/create-listing"
            >
              <FaPlus />
              Crear anuncio
            </Link>
          </form>

          {updateSuccess && (
            <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Perfil actualizado con exito.
            </p>
          )}
          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDeleteUser}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-red-700 hover:bg-red-50"
            >
              <FaTrashAlt />
              Eliminar cuenta
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 hover:bg-white"
            >
              <FaSignOutAlt />
              Cerrar sesion
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="glass-panel rounded-[36px] p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
                  Mis anuncios
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Tus anuncios activos</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  Revisa lo que ya publicaste y edita rapido lo que
                  necesita mejorar.
                </p>
              </div>
              <button
                onClick={handleShowListings}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-emerald-800"
              >
                Mostrar anuncios
                <FaArrowRight />
              </button>
            </div>

            {showListingsError && (
              <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                Error al mostrar anuncios.
              </p>
            )}
          </div>

          {userListings && userListings.length > 0 && (
            <div className="space-y-4">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="soft-card flex flex-col gap-4 rounded-[30px] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link to={`/listing/${listing._id}`} className="flex items-center gap-4 min-w-0">
                    <img
                      src={listing.imageUrls?.[0] || 'https://placehold.co/400x300?text=Sin+imagen'}
                      alt="listing cover"
                      className="h-24 w-24 rounded-[22px] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                        Anuncio
                      </p>
                      <p className="mt-2 truncate font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                        {listing.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        ${getListingPrice(listing).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </Link>

                  <div className="flex gap-3 sm:flex-col">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-700 hover:bg-red-50"
                    >
                      <FaTrashAlt />
                      Eliminar
                    </button>
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 hover:bg-emerald-50"
                    >
                      <FaEdit />
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
