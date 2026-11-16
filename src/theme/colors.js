// Cores usadas em todo o app
export const colors = {
  primary: '#1976d2',
  background: '#f4f6f8',
  card: '#ffffff',
  text: '#222222',
  muted: '#6b7280',
  danger: '#d32f2f',
  wantToVisit: '#f9a825', // status "Quero visitar"
  visited: '#2e7d32', // status "Visitado"
};

export const STATUS = {
  WANT: 'Quero visitar',
  VISITED: 'Visitado',
};

export const statusColor = (status) =>
  status === STATUS.VISITED ? colors.visited : colors.wantToVisit;
