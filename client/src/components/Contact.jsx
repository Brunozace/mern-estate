import { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (data.success === false) return;
        setLandlord(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  const copyToClipboard = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback(`${label} copiado`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (error) {
      console.log(error.message);
      setCopyFeedback(`No se pudo copiar ${label.toLowerCase()}`);
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  if (!landlord) return null;

  return (
    <div className="glass-panel rounded-[28px] p-6">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
          Contacto directo
        </p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">Habla con el corredor</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {landlord.username} publicó esta propiedad. Usa estos datos para coordinar visita,
          solicitar documentos o resolver dudas sobre {listing.name.toLowerCase()}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[22px] border border-slate-200 bg-white/90 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <FaEnvelope />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Correo
              </p>
              <p className="truncate font-semibold text-slate-800">{landlord.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(landlord.email, 'Correo')}
            className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
          >
            Copiar correo
          </button>
        </div>

        <div className="rounded-[22px] border border-slate-200 bg-white/90 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <FaPhone />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Telefono
              </p>
              <p className="font-semibold text-slate-800">
                {landlord.phone || 'Telefono no disponible'}
              </p>
            </div>
          </div>
          {landlord.phone && (
            <button
              type="button"
              onClick={() => copyToClipboard(landlord.phone, 'Telefono')}
              className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700"
            >
              Copiar telefono
            </button>
          )}
        </div>
      </div>

      {copyFeedback && <p className="mt-4 text-sm font-semibold text-emerald-700">{copyFeedback}</p>}
    </div>
  );
};

export default Contact;
