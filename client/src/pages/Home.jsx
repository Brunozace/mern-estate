import { useEffect, useState } from 'react';
import { FaArrowRight, FaBolt, FaBuilding, FaKey, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  const sections = [
    {
      title: 'Ofertas recientes',
      description: 'Propiedades con mejor precio para acelerar la decisión.',
      link: '/search?offer=true',
      linkLabel: 'Ver más ofertas',
      listings: offerListings,
    },
    {
      title: 'Arriendos recientes',
      description: 'Departamentos y casas listos para mudanza inmediata.',
      link: '/search?type=rent',
      linkLabel: 'Ver más arriendos',
      listings: rentListings,
    },
    {
      title: 'Ventas recientes',
      description: 'Inmuebles listos para inversion o vivienda familiar.',
      link: '/search?type=sale',
      linkLabel: 'Ver más ventas',
      listings: saleListings,
    },
  ];

  return (
    <main className="pb-20">
      <section className="page-shell pt-6">
        <div className="glass-panel relative overflow-hidden rounded-[36px] px-6 py-8 md:px-10 md:py-12">
          <div className="absolute -right-24 top-8 h-52 w-52 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-orange-200/60 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-700">
                Mercado inmobiliario
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                Propiedades con presencia, contexto y una experiencia que inspira confianza.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Doble Gestion Propiedades concentra oportunidades reales de venta y arriendo en
                un espacio claro, elegante y facil de recorrer desde cualquier dispositivo.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Comencemos
                  <FaArrowRight />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
                >
                  Conocenos 
                </Link>
              </div>

              
            </div>

            <div className="grid gap-4">
              <div className="soft-card rounded-[30px] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-500">
                  Qué mejora esta experiencia
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    [FaBolt, 'Búsqueda ágil', 'Filtros claros y respuestas rapidas para comparar opciones.'],
                    [FaShieldAlt, 'Confianza visual', 'Presentacion consistente para que cada anuncio se vea serio.'],
                    [FaKey, 'Contacto directo', 'Datos del anunciante disponibles sin friccion innecesaria.'],
                    [FaBuilding, 'Oferta real', 'Ventas, arriendos y promociones visibles para todos los usuarios.'],
                  ].map(([Icon, title, text]) => (
                    <div key={title} className="flex items-start gap-4 rounded-[22px] bg-slate-50 p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
              Descubre
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Seleccion para compradores y arrendatarios
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Cada bloque responde a una intención distinta: encontrar oportunidad, mudarse rapido o
            invertir con criterio.
          </p>
        </div>

        <div className="space-y-14">
          {sections.map((section) =>
            section.listings && section.listings.length > 0 ? (
              <div key={section.title}>
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{section.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{section.description}</p>
                  </div>
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700 hover:text-slate-900"
                    to={section.link}
                  >
                    {section.linkLabel}
                    <FaArrowRight />
                  </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {section.listings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
