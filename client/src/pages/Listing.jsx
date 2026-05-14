import { useEffect, useState } from 'react';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { useParams } from 'react-router-dom';
import Contact from '../components/Contact';

SwiperCore.use([Navigation]);

const Listing = () => {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const galleryImages = Array.isArray(listing?.imageUrls) && listing.imageUrls.length > 0
    ? listing.imageUrls
    : ['https://placehold.co/1400x900?text=Sin+imagen'];
  const displayPrice =
    listing?.offer && Number.isFinite(Number(listing?.discountPrice))
      ? Number(listing.discountPrice)
      : Number(listing?.regularPrice) || 0;
  const discountValue = Math.max((Number(listing?.regularPrice) || 0) - displayPrice, 0);

  return (
    <main className="pb-16">
      {loading && <p className="py-20 text-center text-2xl font-semibold text-slate-700">Cargando...</p>}
      {error && <p className="py-20 text-center text-2xl font-semibold text-red-700">Algo salio mal.</p>}

      {listing && !loading && !error && (
        <div>
          <section className="page-shell pt-6">
            <div className="relative overflow-hidden rounded-[38px]">
              <Swiper navigation>
                {galleryImages.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className="h-[320px] md:h-[520px]"
                      style={{
                        background: `linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0.24)), url(${url}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                type="button"
                className="absolute right-6 top-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-slate-700 shadow-xl shadow-slate-900/10 hover:scale-105"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              >
                <FaShare />
              </button>

              {copied && (
                <p className="absolute right-6 top-24 z-10 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-lg">
                  Enlace copiado
                </p>
              )}
            </div>
          </section>

          <section className="page-shell mt-8">
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="glass-panel rounded-[36px] p-6 md:p-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
                        Propiedad destacada
                      </p>
                      <h1 className="mt-3 text-4xl font-bold text-slate-900">{listing.name}</h1>
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                        <FaMapMarkerAlt className="text-emerald-700" />
                        <span>{listing.address}</span>
                      </div>
                    </div>

                    <div className="rounded-[28px] bg-slate-900 px-6 py-5 text-white shadow-2xl shadow-slate-900/15">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">Precio</p>
                      <p className="mt-2 font-['Space_Grotesk'] text-4xl font-bold">${displayPrice.toLocaleString('es-CL')}</p>
                      {listing.type === 'rent' && <p className="mt-2 text-sm text-white/70">por mes</p>}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-red-800">
                      {listing.type === 'rent' ? 'En arriendo' : 'En venta'}
                    </span>
                    {listing.offer && (
                      <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-800">
                        ${discountValue.toLocaleString('es-CL')} de descuento
                      </span>
                    )}
                  </div>

                  <div className="mt-8 rounded-[28px] border border-slate-200 bg-white/85 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                      Descripcion
                    </p>
                    <p className="mt-4 text-base leading-8 text-slate-700">{listing.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel rounded-[36px] p-6 md:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-500">
                    Ficha rapida
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      [FaBed, listing.bedrooms > 1 ? `${listing.bedrooms} habitaciones` : `${listing.bedrooms} habitación`],
                      [FaBath, listing.bathrooms > 1 ? `${listing.bathrooms} baños` : `${listing.bathrooms} baño`],
                      [FaParking, listing.parking ? 'Estacionamiento disponible' : 'Sin estacionamiento'],
                      [FaChair, listing.furnished ? 'Amoblado' : 'Sin amoblar'],
                    ].map(([Icon, text]) => (
                      <div key={text} className="rounded-[26px] border border-slate-200 bg-white/85 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                          <Icon />
                        </div>
                        <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {(!currentUser || listing.userRef !== currentUser._id) && !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-emerald-700"
                  >
                    Ver datos del propietario
                  </button>
                )}

                {contact && <Contact listing={listing} />}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Listing;
