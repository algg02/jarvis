// Datos de muestra: criterios/tesis y noticias.
// PLACEHOLDER: reemplazar con integración real (SCJN, DOF, etc.) vía API/MCP.

export interface Criterio {
  id: string;
  rubro: string;
  texto: string;
  materia: string;
  instancia: string;
  tipo: 'Jurisprudencia' | 'Tesis Aislada';
  epoca: string;
  registro: string;
  fecha: string;
}

export const CRITERIOS: Criterio[] = [
  {
    id: 'c1',
    rubro: 'DAÑO MORAL. SU ACREDITAMIENTO NO REQUIERE PRUEBA DIRECTA CUANDO DERIVA DE UN HECHO ILÍCITO EVIDENTE.',
    texto: 'El daño moral puede acreditarse mediante presunciones cuando el hecho ilícito y su relación con la afectación a los derechos de la personalidad resultan evidentes, sin que sea exigible una prueba directa de la afectación interna del sujeto.',
    materia: 'civil',
    instancia: 'Primera Sala',
    tipo: 'Jurisprudencia',
    epoca: 'Undécima Época',
    registro: '2026451',
    fecha: '2026-03-14',
  },
  {
    id: 'c2',
    rubro: 'PRISIÓN PREVENTIVA OFICIOSA. PARÁMETROS PARA SU REVISIÓN A LA LUZ DEL CONTROL DE CONVENCIONALIDAD.',
    texto: 'Los juzgadores deben revisar periódicamente la subsistencia de la prisión preventiva oficiosa, ponderando el principio de presunción de inocencia y los estándares interamericanos en materia de libertad personal.',
    materia: 'penal',
    instancia: 'Pleno',
    tipo: 'Jurisprudencia',
    epoca: 'Undécima Época',
    registro: '2026388',
    fecha: '2026-02-28',
  },
  {
    id: 'c3',
    rubro: 'DESPIDO INJUSTIFICADO. LA CARGA DE LA PRUEBA CORRESPONDE AL PATRÓN CUANDO NIEGA LA RELACIÓN LABORAL.',
    texto: 'Cuando el patrón niega el despido pero reconoce la relación de trabajo, le corresponde acreditar la subsistencia de la relación laboral y las condiciones en que se prestaba el servicio.',
    materia: 'laboral',
    instancia: 'Segunda Sala',
    tipo: 'Jurisprudencia',
    epoca: 'Undécima Época',
    registro: '2026300',
    fecha: '2026-01-20',
  },
  {
    id: 'c4',
    rubro: 'SUSPENSIÓN EN EL AMPARO. PROCEDE CONTRA EL BLOQUEO DE CUENTAS BANCARIAS CUANDO NO EXISTE ORDEN JUDICIAL.',
    texto: 'La suspensión provisional procede para el efecto de que se desbloqueen las cuentas del quejoso cuando la autoridad responsable no acredita la existencia de una orden judicial o procedimiento que justifique la medida.',
    materia: 'amparo',
    instancia: 'Tribunales Colegiados',
    tipo: 'Tesis Aislada',
    epoca: 'Undécima Época',
    registro: '2026512',
    fecha: '2026-04-02',
  },
  {
    id: 'c5',
    rubro: 'DEDUCCIONES AUTORIZADAS. REQUISITOS DE LA MATERIALIDAD DE LAS OPERACIONES PARA EFECTOS FISCALES.',
    texto: 'Para que proceda la deducción, el contribuyente debe acreditar la materialidad de las operaciones mediante elementos que demuestren su existencia real, más allá de la simple emisión de comprobantes fiscales.',
    materia: 'fiscal',
    instancia: 'Segunda Sala',
    tipo: 'Jurisprudencia',
    epoca: 'Undécima Época',
    registro: '2026477',
    fecha: '2026-03-30',
  },
  {
    id: 'c6',
    rubro: 'GUARDA Y CUSTODIA COMPARTIDA. EL INTERÉS SUPERIOR DEL MENOR COMO PRINCIPIO RECTOR.',
    texto: 'La determinación sobre la guarda y custodia debe atender de forma preponderante al interés superior del menor, privilegiando su desarrollo integral por encima de la conveniencia de los progenitores.',
    materia: 'familiar',
    instancia: 'Primera Sala',
    tipo: 'Jurisprudencia',
    epoca: 'Undécima Época',
    registro: '2026244',
    fecha: '2026-02-10',
  },
  {
    id: 'c7',
    rubro: 'NULIDAD DE ACTOS ADMINISTRATIVOS. INDEBIDA FUNDAMENTACIÓN Y MOTIVACIÓN COMO VICIO DE LEGALIDAD.',
    texto: 'Todo acto de autoridad debe estar debidamente fundado y motivado; su ausencia genera la nulidad lisa y llana del acto impugnado en el juicio contencioso administrativo.',
    materia: 'administrativo',
    instancia: 'Tribunales Colegiados',
    tipo: 'Tesis Aislada',
    epoca: 'Undécima Época',
    registro: '2026190',
    fecha: '2026-01-08',
  },
  {
    id: 'c8',
    rubro: 'SOCIEDADES MERCANTILES. RESPONSABILIDAD DE LOS ADMINISTRADORES POR ACTOS QUE EXCEDEN EL OBJETO SOCIAL.',
    texto: 'Los administradores responden frente a la sociedad y terceros por los daños causados al realizar actos que exceden el objeto social, salvo que acrediten haber actuado con la diligencia de un administrador prudente.',
    materia: 'mercantil',
    instancia: 'Primera Sala',
    tipo: 'Tesis Aislada',
    epoca: 'Undécima Época',
    registro: '2026422',
    fecha: '2026-03-21',
  },
];

export interface Noticia {
  id: string;
  titulo: string;
  resumen: string;
  fuente: string;
  materia: string;
  fecha: string;
  destacada?: boolean;
}

export const NOTICIAS: Noticia[] = [
  {
    id: 'n1',
    titulo: 'Reforma al Código Nacional de Procedimientos Civiles y Familiares entra en vigor',
    resumen: 'El nuevo código unifica los procedimientos en materia civil y familiar a nivel nacional, estableciendo la oralidad como regla general y nuevos plazos procesales.',
    fuente: 'Diario Oficial de la Federación',
    materia: 'civil',
    fecha: '2026-06-20',
    destacada: true,
  },
  {
    id: 'n2',
    titulo: 'SCJN resuelve contradicción de criterios sobre prisión preventiva oficiosa',
    resumen: 'El Pleno determinó los parámetros que deben seguir los jueces para revisar la medida cautelar, fortaleciendo el control de convencionalidad.',
    fuente: 'Suprema Corte de Justicia de la Nación',
    materia: 'penal',
    fecha: '2026-06-18',
    destacada: true,
  },
  {
    id: 'n3',
    titulo: 'Nuevas reglas de la Resolución Miscelánea Fiscal 2026',
    resumen: 'El SAT publica modificaciones relevantes en materia de comprobantes fiscales digitales y obligaciones de los contribuyentes.',
    fuente: 'Servicio de Administración Tributaria',
    materia: 'fiscal',
    fecha: '2026-06-15',
  },
  {
    id: 'n4',
    titulo: 'Incremento al salario mínimo y su impacto en prestaciones laborales',
    resumen: 'La CONASAMI anuncia ajustes que impactan el cálculo de finiquitos, aguinaldos y demás prestaciones para el siguiente ejercicio.',
    fuente: 'CONASAMI',
    materia: 'laboral',
    fecha: '2026-06-12',
  },
  {
    id: 'n5',
    titulo: 'Lineamientos para la constitución de sociedades por medios electrónicos',
    resumen: 'La Secretaría de Economía simplifica el proceso de constitución de S.A.S. mediante la plataforma digital, reduciendo tiempos y costos.',
    fuente: 'Secretaría de Economía',
    materia: 'corporativo',
    fecha: '2026-06-08',
  },
  {
    id: 'n6',
    titulo: 'Criterio relevante sobre suspensión en amparo contra bloqueo de cuentas',
    resumen: 'Tribunales colegiados establecen que procede la suspensión cuando no existe orden judicial que justifique el bloqueo de cuentas bancarias.',
    fuente: 'Semanario Judicial de la Federación',
    materia: 'amparo',
    fecha: '2026-06-05',
  },
];
