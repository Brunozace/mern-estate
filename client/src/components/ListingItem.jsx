import { FaBath, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ListingItem = ({ listing }) => {
  const priceValue =
    listing.offer && Number.isFinite(Number(listing.discountPrice))
      ? Number(listing.discountPrice)
      : Number(listing.regularPrice) || 0;

  return (
    <div className="group soft-card w-full overflow-hidden rounded-[28px]">
      <Link to={`/listing/${listing._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={listing.imageUrls?.[0] || 'https://placehold.co/800x600?text=Sin+imagen'}
            alt="listing cover"
            className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-800">
              {listing.type === 'rent' ? 'Arriendo' : 'Venta'}
            </span>
            {listing.offer && (
              <span className="rounded-full bg-emerald-700/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                Oferta
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-['Space_Grotesk'] text-xl font-bold text-white">
                {listing.name}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <FaMapMarkerAlt className="shrink-0 text-emerald-300" />
                <span className="truncate">{listing.address}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/92 px-4 py-3 text-right shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Desde
              </p>
              <p className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
                ${priceValue.toLocaleString('es-CL')}
              </p>
              {listing.type === 'rent' && <p className="text-xs text-slate-500">por mes</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{listing.description}</p>
          <div className="flex items-center gap-5 border-t border-slate-200/80 pt-4 text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <FaBed className="text-emerald-700" />
              <span>{listing.bedrooms > 1 ? `${listing.bedrooms} habs` : `${listing.bedrooms} hab`}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBath className="text-emerald-700" />
              <span>
                {listing.bathrooms > 1 ? `${listing.bathrooms} baños` : `${listing.bathrooms} baño`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
