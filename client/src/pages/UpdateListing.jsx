import { useEffect, useState } from 'react';
import { FaCheckCircle, FaCloudUploadAlt, FaPenFancy, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = 'mern-estate';

const UpdateListing = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'sale',
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/get/${params.id}`);
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        return;
      }

      setFormData(data);
    };

    fetchListing();
  }, [params.id]);

  const storeImage = async (file) =>
    new Promise((resolve, reject) => {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      uploadData.append('folder', CLOUDINARY_FOLDER);

      fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: uploadData,
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            reject(new Error(data.error?.message || 'Cloudinary upload failed'));
            return;
          }
          resolve(data.secure_url);
        })
        .catch(reject);
    });

  const handleImageSubmit = async () => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setImageUploadError('Falta configurar Cloudinary en client/.env');
      return;
    }

    if (files.length === 0) {
      setImageUploadError('Selecciona al menos una imagen');
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('Solo puedes subir un maximo de 6 imagenes');
      return;
    }

    try {
      setUploading(true);
      setImageUploadError('');

      const urls = await Promise.all([...files].map((file) => storeImage(file)));

      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));
      setFiles([]);
    } catch (err) {
      setImageUploadError(err?.message || 'La carga de imagenes fallo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, checked, value, type } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      setError('Debes subir al menos una imagen');
      return;
    }

    if (Number(formData.regularPrice) < Number(formData.discountPrice)) {
      setError('El precio con descuento no puede ser mayor al precio regular');
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const optionBase =
    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50';

  return (
    <main className="page-shell py-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel rounded-[36px] p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-900 text-white">
              <FaPenFancy />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">
                Edicion
              </p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">Refina la presentacion del anuncio</h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
            Ajusta texto, imagenes y precio para mantener la propiedad competitiva y consistente
            con el resto del catalogo.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="grid gap-5">
              <input
                type="text"
                placeholder="Titulo del anuncio"
                className="field-shell"
                id="name"
                maxLength={62}
                minLength={10}
                required
                onChange={handleChange}
                value={formData.name}
              />

              <textarea
                placeholder="Descripcion del anuncio"
                className="field-shell min-h-[150px] resize-none"
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
              />

              <input
                type="text"
                placeholder="Ubicacion"
                className="field-shell"
                id="address"
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Tipo y atributos
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <label
                  className={`${optionBase} ${formData.type === 'sale' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="sale"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={formData.type === 'sale'}
                  />
                  Venta
                </label>
                <label
                  className={`${optionBase} ${formData.type === 'rent' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="rent"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={formData.type === 'rent'}
                  />
                  Arriendo
                </label>
                <label
                  className={`${optionBase} ${formData.parking ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="parking"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  Estacionamiento
                </label>
                <label
                  className={`${optionBase} ${formData.furnished ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="furnished"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  Amoblado
                </label>
                <label
                  className={`${optionBase} ${formData.offer ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white/80'}`}
                >
                  <input
                    type="checkbox"
                    id="offer"
                    className="h-4 w-4 accent-emerald-700"
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  Oferta activa
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="soft-card rounded-[24px] p-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Habitaciones
                </span>
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="field-shell mt-3"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </label>

              <label className="soft-card rounded-[24px] p-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Baños
                </span>
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className="field-shell mt-3"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </label>

              <label className="soft-card rounded-[24px] p-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Precio normal
                </span>
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000000000"
                  required
                  className="field-shell mt-3"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
              </label>

              {formData.offer && (
                <label className="soft-card rounded-[24px] p-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Precio oferta
                  </span>
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000000000"
                    className="field-shell mt-3"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                </label>
              )}
            </div>

            <button
              disabled={loading || uploading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FaCheckCircle />
              {loading ? 'Actualizando anuncio...' : 'Actualizar anuncio'}
            </button>

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          </form>
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-[36px] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Galeria visual
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Renueva la percepcion del anuncio</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <FaCloudUploadAlt className="text-xl" />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Reemplaza imagenes flojas, mejora portada y mantén un maximo de 6 para conservar ritmo visual.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="field-shell"
                onChange={(e) => setFiles(e.target.files)}
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                disabled={uploading}
                className="rounded-2xl border border-emerald-700 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700 hover:bg-emerald-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {uploading ? 'Subiendo...' : 'Subir'}
              </button>
            </div>

            {imageUploadError && (
              <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {imageUploadError}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="soft-card flex items-center justify-between gap-4 rounded-[28px] p-4"
              >
                <div className="flex items-center gap-4">
                  <img src={url} alt="listing" className="h-24 w-24 rounded-[20px] object-cover" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                      Imagen {index + 1}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {index === 0 ? 'Portada principal del anuncio' : 'Imagen complementaria'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default UpdateListing;
