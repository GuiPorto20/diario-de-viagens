// Cores e constantes usadas em todo o app
export const colors = {
  primary: '#0E7C86', // verde-azulado
  primaryDark: '#0A5A62',
  primarySoft: '#E0F2F3',
  background: '#F3F7F8',
  card: '#FFFFFF',
  text: '#16282B',
  muted: '#6B7F83',
  border: '#DCE5E7',
  danger: '#D64545',
  wantToVisit: '#F59E0B', // status "Quero visitar"
  visited: '#16A34A', // status "Visitado"
};

export const STATUS = {
  WANT: 'Quero visitar',
  VISITED: 'Visitado',
};

export const statusColor = (status) =>
  status === STATUS.VISITED ? colors.visited : colors.wantToVisit;

export const statusIcon = (status) =>
  status === STATUS.VISITED ? 'checkmark-circle' : 'bookmark';

// Sombra padrão dos cards
export const shadow = {
  shadowColor: '#0A2A2E',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
};
