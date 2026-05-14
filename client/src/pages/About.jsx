import { FaChartLine, FaHandshake, FaHome, FaMapMarkedAlt } from 'react-icons/fa';

const About = () => {
  const pillars = [
    {
      icon: FaHome,
      title: 'Selección comercial',
      text: 'Cada propiedad se presenta con foco en claridad, contexto y decision de compra.',
    },
    {
      icon: FaHandshake,
      title: 'Gestión cercana',
      text: 'El contacto entre cliente y anunciante se reduce a lo esencial para acelerar acuerdos.',
    },
    {
      icon: FaMapMarkedAlt,
      title: 'Conocimiento local',
      text: 'La propuesta parte del mercado de Concepcion y se adapta a su dinamica real.',
    },
    {
      icon: FaChartLine,
      title: 'Visión de negocio',
      text: 'No solo se publican inmuebles: se construye una vitrina que debe convertir.',
    },
  ];

  return (
    <main className="page-shell py-8">
      <section className="glass-panel overflow-hidden rounded-[36px] p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-700">
              Sobre nosotros
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Una presencia inmobiliaria que se ve tan seria como el servicio que promete.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
              Doble Gestion Propiedades nace para ordenar la experiencia de compra y arriendo:
              menos ruido, mejor presentacion y rutas mas claras para contactar, comparar y tomar
              una decision informada.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              El objetivo no es solo publicar anuncios. Es elevar la percepcion del catalogo,
              proyectar confianza y facilitar conversaciones comerciales entre personas reales.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="soft-card rounded-[30px] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Lo que buscamos lograr
              </p>
              <div className="mt-5 grid gap-4">
                {pillars.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-[24px] border border-slate-200 bg-white/85 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <Icon />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900">{title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
