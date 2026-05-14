import { useEffect, useState } from 'react';
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const typeFromUrl = urlParams.get('type') || 'all';
    const parkingFromUrl = urlParams.get('parking') === 'true';
    const furnishedFromUrl = urlParams.get('furnished') === 'true';
    const offerFromUrl = urlParams.get('offer') === 'true';
    const sortFromUrl = urlParams.get('sort') || 'createdAt';
    const orderFromUrl = urlParams.get('order') || 'desc';

    setSidebarData({
      searchTerm: searchTermFromUrl,
      type: typeFromUrl,
      parking: parkingFromUrl,
      furnished: furnishedFromUrl,
      offer: offerFromUrl,
      sort: sortFromUrl,
      order: orderFromUrl,
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);

      try {
        const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'No se pudo obtener los anuncios');
        }

        const nextListings = Array.isArray(data) ? data : [];
        setListings(nextListings);
        setShowMore(nextListings.length >= 9);
      } catch (error) {
        console.log(error);
        setListings([]);
        setShowMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === 'all' || id === 'rent' || id === 'sale') {
      setSidebarData((prev) => ({
        ...prev,
        type: id,
      }));
    }

    if (id === 'searchTerm') {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: value,
      }));
    }

    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebarData((prev) => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
      }));
    }

    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebarData((prev) => ({
        ...prev,
        sort: sort || 'createdAt',
        order: order || 'desc',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (sidebarData.searchTerm) {
      urlParams.set('searchTerm', sidebarData.searchTerm);
    }

    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    try {
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'No se pudo cargar mas anuncios');
      }

      const nextListings = Array.isArray(data) ? data : [];
      setListings((prev) => [...prev, ...nextListings]);
      setShowMore(nextListings.length >= 9);
    } catch (error) {
      console.log(error);
    }
  };

  const optionBase =
    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50';

  return (
    <main className="page-shell py-8">
      <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
        <aside className="glass-panel rounded-[32px] p-6 md:p-7 xl:sticky xl:top-32 xl:self-start">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <FaSlidersH />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Filtros
              </p>
              <h1 className="text-2xl font-bold text-slate-900">Ajusta la búsqueda</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-7">
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Palabra clave
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Buscar..."
                  className="field-shell pr-12"
                  value={sidebarData.searchTerm}
                  onChange={handleChange}
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Tipo
              </label>
              <div className="space-y-3">
                <label
                  className={`${optionBase} ${sidebarData.type === 'all' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="all"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={sidebarData.type === 'all'}
                  />
                  Arriendo y venta
                </label>
                <label
                  className={`${optionBase} ${sidebarData.type === 'rent' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="rent"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={sidebarData.type === 'rent'}
                  />
                  Arriendo
                </label>
                <label
                  className={`${optionBase} ${sidebarData.type === 'sale' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="sale"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={sidebarData.type === 'sale'}
                  />
                  Venta
                </label>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Amenidades
              </label>
              <div className="space-y-3">
                <label
                  className={`${optionBase} ${sidebarData.offer ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="offer"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={sidebarData.offer}
                  />
                  Oferta
                </label>
                <label
                  className={`${optionBase} ${sidebarData.parking ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="parking"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={sidebarData.parking}
                  />
                  Estacionamiento
                </label>
                <label
                  className={`${optionBase} ${sidebarData.furnished ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="furnished"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={sidebarData.furnished}
                  />
                  Amoblado
                </label>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Ordenar
              </label>
              <select
                onChange={handleChange}
                defaultValue={'createdAt_desc'}
                id="sort_order"
                className="field-shell"
                value={`${sidebarData.sort}_${sidebarData.order}`}
              >
                <option value="regularPrice_desc">Precio de mayor a menor</option>
                <option value="regularPrice_asc">Precio de menor a mayor</option>
                <option value="createdAt_desc">Mas recientes</option>
                <option value="createdAt_asc">Mas antiguos</option>
              </select>
            </div>

            <button className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-emerald-700">
              Buscar
            </button>
          </form>
        </aside>

        <section className="space-y-6">
          <div className="glass-panel rounded-[32px] p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-700">
              Resultados
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Encuentra tu preferencia</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Explora propiedades filtradas segun tipo, amenidades, precio y momento de publicación.
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600">
                {listings.length} resultado{listings.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {!loading && listings.length === 0 && (
            <div className="glass-panel rounded-[32px] p-10 text-center">
              <h3 className="text-2xl font-bold text-slate-900">No se encontraron anuncios</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ajusta filtros, elimina restricciones o prueba otra palabra clave.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-panel rounded-[32px] p-10 text-center">
              <p className="text-xl font-semibold text-slate-700">Cargando resultados...</p>
            </div>
          )}

          {!loading && listings.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {showMore && (
            <div className="text-center">
              <button
                onClick={onShowMoreClick}
                className="rounded-full border border-emerald-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700 hover:bg-emerald-700 hover:text-white"
              >
                Cargar mas
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Search;
