// Tipos de documentos legales + campos de formulario + plantillas base
export interface CampoFormulario {
  id: string;
  label: string;
  tipo: 'text' | 'textarea' | 'date' | 'select' | 'number';
  placeholder?: string;
  opciones?: string[];
  requerido?: boolean;
  ancho?: 'full' | 'half';
}

export interface TipoDocumento {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
  materias: string[];
  tiempoEstimado: string;
  campos: CampoFormulario[];
  // plantilla con tokens {{campo}}
  plantilla: (d: Record<string, string>) => string;
}

const hoy = () => '[fecha del documento]';

export const TIPOS_DOCUMENTO: TipoDocumento[] = [
  {
    id: 'demanda',
    nombre: 'Demanda',
    descripcion: 'Escrito inicial de demanda con proemio, hechos, derecho y puntos petitorios',
    icon: '⚖',
    materias: ['civil', 'mercantil', 'laboral', 'familiar'],
    tiempoEstimado: '5 min',
    campos: [
      { id: 'actor', label: 'Nombre del actor / promovente', tipo: 'text', placeholder: 'Juan Pérez García', requerido: true, ancho: 'half' },
      { id: 'demandado', label: 'Nombre del demandado', tipo: 'text', placeholder: 'María López S.A. de C.V.', requerido: true, ancho: 'half' },
      { id: 'juzgado', label: 'Autoridad / Juzgado', tipo: 'text', placeholder: 'Juez de lo Civil en turno de la CDMX', requerido: true, ancho: 'full' },
      { id: 'via', label: 'Vía', tipo: 'select', opciones: ['Ordinaria civil', 'Ejecutiva mercantil', 'Oral mercantil', 'Especial', 'Sumaria'], requerido: true, ancho: 'half' },
      { id: 'prestaciones', label: 'Prestaciones que se reclaman', tipo: 'textarea', placeholder: 'a) El pago de la cantidad de...\nb) El pago de intereses...', requerido: true, ancho: 'full' },
      { id: 'hechos', label: 'Hechos (narración cronológica)', tipo: 'textarea', placeholder: '1. Con fecha...\n2. Posteriormente...', requerido: true, ancho: 'full' },
      { id: 'fundamentos', label: 'Fundamentos de derecho', tipo: 'textarea', placeholder: 'Artículos aplicables...', ancho: 'full' },
    ],
    plantilla: (d) => `C. JUEZ ${(d.juzgado || '[AUTORIDAD]').toUpperCase()}
P R E S E N T E.

${d.actor || '[ACTOR]'}, por mi propio derecho, señalando como domicilio para oír y recibir notificaciones el ubicado en [domicilio], y autorizando en términos del artículo 1069 del Código de Comercio / 112 del CFPC a los profesionistas que al final se indican, ante Usted con el debido respeto comparezco y expongo:

Que por medio del presente escrito, vengo a demandar en la VÍA ${(d.via || '[VÍA]').toUpperCase()} a ${d.demandado || '[DEMANDADO]'}, con domicilio en [domicilio del demandado], las siguientes:

P R E S T A C I O N E S

${d.prestaciones || '[Prestaciones reclamadas]'}

Fundo la presente demanda en los siguientes:

H E C H O S

${d.hechos || '[Narración de hechos]'}

D E R E C H O

${d.fundamentos || 'Son aplicables las disposiciones sustantivas y adjetivas que se invocan, así como los criterios jurisprudenciales aplicables al caso concreto.'}

P R U E B A S

1. LA DOCUMENTAL.- Consistente en [describir].
2. LA PRESUNCIONAL LEGAL Y HUMANA.- En todo lo que favorezca a los intereses de mi representado.
3. LA INSTRUMENTAL DE ACTUACIONES.- En todo lo que beneficie.

Por lo anteriormente expuesto y fundado, a Usted C. Juez, atentamente pido se sirva:

PRIMERO.- Tenerme por presentado en los términos del presente escrito, demandando en la vía y forma propuestas.
SEGUNDO.- Admitir la demanda, correr traslado y emplazar a la parte demandada.
TERCERO.- En su oportunidad, dictar sentencia condenando a la parte demandada al pago de las prestaciones reclamadas.

PROTESTO LO NECESARIO
${hoy()}

_______________________________
${d.actor || '[NOMBRE DEL PROMOVENTE]'}`,
  },
  {
    id: 'contrato',
    nombre: 'Contrato',
    descripcion: 'Contrato con declaraciones, cláusulas, obligaciones y firmas',
    icon: '📄',
    materias: ['civil', 'mercantil', 'corporativo', 'laboral'],
    tiempoEstimado: '4 min',
    campos: [
      { id: 'tipoContrato', label: 'Tipo de contrato', tipo: 'select', opciones: ['Compraventa', 'Arrendamiento', 'Prestación de servicios', 'Préstamo mutuo', 'Confidencialidad', 'Comodato'], requerido: true, ancho: 'half' },
      { id: 'parteA', label: '“La Parte A” / Vendedor / Arrendador', tipo: 'text', placeholder: 'Empresa ABC S.A. de C.V.', requerido: true, ancho: 'half' },
      { id: 'parteB', label: '“La Parte B” / Comprador / Arrendatario', tipo: 'text', placeholder: 'Persona física', requerido: true, ancho: 'half' },
      { id: 'objeto', label: 'Objeto del contrato', tipo: 'textarea', placeholder: 'Descripción del bien o servicio...', requerido: true, ancho: 'full' },
      { id: 'monto', label: 'Contraprestación / Precio', tipo: 'text', placeholder: '$100,000.00 MXN', ancho: 'half' },
      { id: 'vigencia', label: 'Vigencia', tipo: 'text', placeholder: '12 meses', ancho: 'half' },
      { id: 'clausulasExtra', label: 'Cláusulas especiales', tipo: 'textarea', placeholder: 'Penalizaciones, jurisdicción...', ancho: 'full' },
    ],
    plantilla: (d) => `CONTRATO DE ${(d.tipoContrato || '[TIPO]').toUpperCase()}

Contrato de ${d.tipoContrato || '[tipo]'} que celebran por una parte ${d.parteA || '[PARTE A]'}, en lo sucesivo "LA PARTE A", y por la otra parte ${d.parteB || '[PARTE B]'}, en lo sucesivo "LA PARTE B", al tenor de las siguientes declaraciones y cláusulas:

D E C L A R A C I O N E S

I. Declara "LA PARTE A" que cuenta con la capacidad legal y los recursos necesarios para celebrar el presente contrato.
II. Declara "LA PARTE B" que es su voluntad celebrar el presente contrato en los términos aquí establecidos.
III. Declaran ambas partes que se reconocen mutuamente la personalidad con que se ostentan.

C L Á U S U L A S

PRIMERA. OBJETO. ${d.objeto || '[Objeto del contrato]'}

SEGUNDA. CONTRAPRESTACIÓN. Como contraprestación, "LA PARTE B" pagará la cantidad de ${d.monto || '[monto]'}, en los términos y condiciones que las partes acuerden.

TERCERA. VIGENCIA. El presente contrato tendrá una vigencia de ${d.vigencia || '[vigencia]'}, contados a partir de la fecha de su firma.

CUARTA. OBLIGACIONES. Las partes se obligan a cumplir de buena fe con todas y cada una de las obligaciones derivadas del presente instrumento.

${d.clausulasExtra ? `QUINTA. CLÁUSULAS ESPECIALES. ${d.clausulasExtra}\n\n` : ''}SEXTA. JURISDICCIÓN. Para la interpretación y cumplimiento del presente contrato, las partes se someten a la jurisdicción de los tribunales competentes, renunciando a cualquier otro fuero.

Leído que fue el presente contrato y enteradas las partes de su contenido y alcance legal, lo firman de conformidad.

${hoy()}

_____________________          _____________________
   "LA PARTE A"                    "LA PARTE B"
${d.parteA || ''}                  ${d.parteB || ''}`,
  },
  {
    id: 'poder',
    nombre: 'Poder',
    descripcion: 'Poder notarial general o especial (pleitos, administración, dominio)',
    icon: '📜',
    materias: ['civil', 'corporativo', 'mercantil'],
    tiempoEstimado: '3 min',
    campos: [
      { id: 'poderdante', label: 'Poderdante (quien otorga)', tipo: 'text', placeholder: 'Nombre completo', requerido: true, ancho: 'half' },
      { id: 'apoderado', label: 'Apoderado (quien recibe)', tipo: 'text', placeholder: 'Nombre completo', requerido: true, ancho: 'half' },
      { id: 'tipoPoder', label: 'Tipo de poder', tipo: 'select', opciones: ['General para pleitos y cobranzas', 'General para actos de administración', 'General para actos de dominio', 'Especial'], requerido: true, ancho: 'full' },
      { id: 'facultades', label: 'Facultades específicas', tipo: 'textarea', placeholder: 'Facultades que se confieren...', ancho: 'full' },
    ],
    plantilla: (d) => `PODER ${(d.tipoPoder || '[TIPO]').toUpperCase()}

En la Ciudad de [____], a ${hoy()}, comparece ${d.poderdante || '[PODERDANTE]'}, a quien en lo sucesivo se le denominará "EL PODERDANTE", quien manifiesta que por medio del presente instrumento otorga PODER ${(d.tipoPoder || '').toUpperCase()} a favor de ${d.apoderado || '[APODERADO]'}, en lo sucesivo "EL APODERADO".

El presente poder se otorga en los términos del artículo 2554 del Código Civil Federal y sus correlativos en los Códigos Civiles de las Entidades Federativas, confiriéndose las siguientes facultades:

${d.tipoPoder?.includes('pleitos') ? 'PODER GENERAL PARA PLEITOS Y COBRANZAS con todas las facultades generales y las especiales que requieran cláusula especial conforme a la ley, incluyendo enunciativa y no limitativamente: presentar y contestar demandas, ofrecer y desahogar pruebas, articular y absolver posiciones, interponer toda clase de recursos, y desistirse del juicio de amparo.' : ''}
${d.tipoPoder?.includes('administración') ? 'PODER GENERAL PARA ACTOS DE ADMINISTRACIÓN con las más amplias facultades de administración sobre los bienes y negocios del poderdante.' : ''}
${d.tipoPoder?.includes('dominio') ? 'PODER GENERAL PARA ACTOS DE DOMINIO con todas las facultades de dueño, tanto en lo relativo a los bienes como para hacer toda clase de gestiones a fin de defenderlos.' : ''}

${d.facultades ? `FACULTADES ESPECIALES ADICIONALES:\n${d.facultades}\n` : ''}
EL APODERADO podrá ejercer las facultades aquí conferidas de manera [conjunta/separada], y el presente poder estará vigente hasta su revocación expresa.

PROTESTO LO NECESARIO

_______________________________
${d.poderdante || '[EL PODERDANTE]'}`,
  },
  {
    id: 'escrito',
    nombre: 'Escrito / Promoción',
    descripcion: 'Promoción dentro de juicio: ofrecimiento de pruebas, alegatos, incidentes',
    icon: '✍',
    materias: ['civil', 'penal', 'mercantil', 'amparo', 'administrativo'],
    tiempoEstimado: '3 min',
    campos: [
      { id: 'promovente', label: 'Promovente', tipo: 'text', placeholder: 'Nombre', requerido: true, ancho: 'half' },
      { id: 'expediente', label: 'Número de expediente', tipo: 'text', placeholder: '123/2026', requerido: true, ancho: 'half' },
      { id: 'juzgado', label: 'Autoridad', tipo: 'text', placeholder: 'Juzgado...', requerido: true, ancho: 'full' },
      { id: 'tipoEscrito', label: 'Tipo de promoción', tipo: 'select', opciones: ['Ofrecimiento de pruebas', 'Alegatos', 'Incidente', 'Recurso', 'Cumplimiento de requerimiento', 'Señalamiento de domicilio'], requerido: true, ancho: 'half' },
      { id: 'contenido', label: 'Contenido / petición', tipo: 'textarea', placeholder: 'Lo que se solicita...', requerido: true, ancho: 'full' },
    ],
    plantilla: (d) => `${(d.tipoEscrito || 'PROMOCIÓN').toUpperCase()}
EXPEDIENTE: ${d.expediente || '[___/____]'}

C. JUEZ ${(d.juzgado || '[AUTORIDAD]').toUpperCase()}
P R E S E N T E.

${d.promovente || '[PROMOVENTE]'}, dentro de los autos del expediente al rubro citado, ante Usted respetuosamente comparezco y expongo:

Que por medio del presente escrito, y en relación con el tipo de promoción "${d.tipoEscrito || '[tipo]'}", vengo a manifestar lo siguiente:

${d.contenido || '[Contenido de la promoción]'}

Por lo anteriormente expuesto, a Usted C. Juez, atentamente pido se sirva:

ÚNICO.- Tener por presentado el presente escrito y acordar de conformidad lo solicitado.

PROTESTO LO NECESARIO
${hoy()}

_______________________________
${d.promovente || '[PROMOVENTE]'}`,
  },
  {
    id: 'constitutiva',
    nombre: 'Acta Constitutiva',
    descripcion: 'Constitución de sociedad mercantil (S.A. de C.V. / S. de R.L.)',
    icon: '🏢',
    materias: ['corporativo', 'mercantil'],
    tiempoEstimado: '6 min',
    campos: [
      { id: 'denominacion', label: 'Denominación / Razón social', tipo: 'text', placeholder: 'Innovación Legal', requerido: true, ancho: 'half' },
      { id: 'tipoSociedad', label: 'Tipo de sociedad', tipo: 'select', opciones: ['S.A. de C.V.', 'S. de R.L. de C.V.', 'S.A.P.I. de C.V.', 'S.A.S.'], requerido: true, ancho: 'half' },
      { id: 'objetoSocial', label: 'Objeto social', tipo: 'textarea', placeholder: 'Actividades de la sociedad...', requerido: true, ancho: 'full' },
      { id: 'capital', label: 'Capital social', tipo: 'text', placeholder: '$50,000.00 MXN', requerido: true, ancho: 'half' },
      { id: 'duracion', label: 'Duración', tipo: 'text', placeholder: '99 años / Indefinida', ancho: 'half' },
      { id: 'socios', label: 'Socios / Accionistas', tipo: 'textarea', placeholder: 'Nombre, nacionalidad, aportación de cada socio...', requerido: true, ancho: 'full' },
      { id: 'administracion', label: 'Órgano de administración', tipo: 'select', opciones: ['Administrador Único', 'Consejo de Administración'], ancho: 'half' },
    ],
    plantilla: (d) => `ACTA CONSTITUTIVA DE "${(d.denominacion || '[DENOMINACIÓN]').toUpperCase()}" ${d.tipoSociedad || ''}

En la Ciudad de [____], a ${hoy()}, los comparecientes manifiestan su voluntad de constituir una sociedad mercantil al tenor de los siguientes estatutos:

CAPÍTULO I. DENOMINACIÓN, OBJETO, DOMICILIO Y DURACIÓN

PRIMERA. DENOMINACIÓN. La sociedad se denominará "${d.denominacion || '[DENOMINACIÓN]'}", seguida de las palabras ${d.tipoSociedad || '[tipo de sociedad]'}.

SEGUNDA. OBJETO SOCIAL. La sociedad tendrá por objeto: ${d.objetoSocial || '[objeto social]'}

TERCERA. DOMICILIO. La sociedad tendrá su domicilio en [____], sin perjuicio de establecer sucursales en cualquier parte de la República.

CUARTA. DURACIÓN. La duración de la sociedad será de ${d.duracion || '99 años'}.

CAPÍTULO II. CAPITAL SOCIAL

QUINTA. El capital social es de ${d.capital || '[capital]'}, representado por [acciones/partes sociales], suscrito y pagado de la siguiente forma:

${d.socios || '[Relación de socios y aportaciones]'}

CAPÍTULO III. ADMINISTRACIÓN

SEXTA. La administración de la sociedad estará a cargo de un ${d.administracion || 'Administrador Único'}, quien tendrá las más amplias facultades de administración, dominio y representación legal.

CAPÍTULO IV. DISPOSICIONES GENERALES

SÉPTIMA. La sociedad llevará sus asambleas y vigilancia conforme a la Ley General de Sociedades Mercantiles.

Los comparecientes ratifican el contenido de la presente acta y la firman de conformidad.

${hoy()}

[FIRMAS DE LOS SOCIOS Y FE NOTARIAL]`,
  },
  {
    id: 'convenio',
    nombre: 'Convenio',
    descripcion: 'Convenio transaccional, de pago o finiquito entre partes',
    icon: '🤝',
    materias: ['civil', 'laboral', 'mercantil', 'familiar'],
    tiempoEstimado: '3 min',
    campos: [
      { id: 'parteA', label: 'Primera parte', tipo: 'text', requerido: true, ancho: 'half' },
      { id: 'parteB', label: 'Segunda parte', tipo: 'text', requerido: true, ancho: 'half' },
      { id: 'tipoConvenio', label: 'Tipo de convenio', tipo: 'select', opciones: ['Transaccional', 'De pago', 'Finiquito laboral', 'De divorcio', 'Reconocimiento de adeudo'], requerido: true, ancho: 'full' },
      { id: 'acuerdos', label: 'Acuerdos / Cláusulas', tipo: 'textarea', placeholder: 'Lo que las partes convienen...', requerido: true, ancho: 'full' },
    ],
    plantilla: (d) => `CONVENIO ${(d.tipoConvenio || '').toUpperCase()}

Convenio que celebran ${d.parteA || '[PARTE A]'} y ${d.parteB || '[PARTE B]'}, al tenor de las siguientes declaraciones y cláusulas:

D E C L A R A C I O N E S

Manifiestan las partes que es su libre voluntad celebrar el presente convenio, reconociéndose mutuamente la personalidad y capacidad para obligarse.

C L Á U S U L A S

${d.acuerdos || '[Acuerdos entre las partes]'}

FINAL. Las partes manifiestan que en la celebración del presente convenio no existe dolo, error, mala fe ni lesión, y que es producto de su libre voluntad.

Leído que fue y enteradas las partes de su contenido, lo firman de conformidad.

${hoy()}

_____________________          _____________________
${d.parteA || '[PARTE A]'}          ${d.parteB || '[PARTE B]'}`,
  },
];

export const getTipoDocumento = (id: string) => TIPOS_DOCUMENTO.find((t) => t.id === id);
