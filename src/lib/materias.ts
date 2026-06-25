// Materias jurídicas (áreas del derecho mexicano)
export interface Materia {
  id: string;
  nombre: string;
  descripcion: string;
  color: string; // hue base para badges
  icon: string;
}

export const MATERIAS: Materia[] = [
  { id: 'civil', nombre: 'Civil', descripcion: 'Contratos, obligaciones, bienes, sucesiones', color: '#3b82f6', icon: '⚖' },
  { id: 'penal', nombre: 'Penal', descripcion: 'Delitos, procesos penales, amparo penal', color: '#ef4444', icon: '🛡' },
  { id: 'mercantil', nombre: 'Mercantil', descripcion: 'Sociedades, títulos de crédito, comercio', color: '#f59e0b', icon: '📈' },
  { id: 'laboral', nombre: 'Laboral', descripcion: 'Relaciones de trabajo, despidos, prestaciones', color: '#10b981', icon: '👷' },
  { id: 'familiar', nombre: 'Familiar', descripcion: 'Divorcio, pensiones, guarda y custodia', color: '#ec4899', icon: '👪' },
  { id: 'administrativo', nombre: 'Administrativo', descripcion: 'Actos de autoridad, procedimientos, nulidad', color: '#8b5cf6', icon: '🏛' },
  { id: 'fiscal', nombre: 'Fiscal', descripcion: 'Impuestos, créditos fiscales, defensa fiscal', color: '#06b6d4', icon: '💰' },
  { id: 'amparo', nombre: 'Amparo', descripcion: 'Juicio de amparo directo e indirecto', color: '#d4af37', icon: '📜' },
  { id: 'constitucional', nombre: 'Constitucional', descripcion: 'Derechos humanos, controversias, acciones', color: '#6366f1', icon: '🏟' },
  { id: 'corporativo', nombre: 'Corporativo', descripcion: 'Constitución de empresas, gobierno corporativo', color: '#14b8a6', icon: '🏢' },
];

export const getMateria = (id: string) => MATERIAS.find((m) => m.id === id);
