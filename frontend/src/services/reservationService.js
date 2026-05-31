import api from './api.js';

export const reservationService = {
  list: (params) => api.get('/reservations', { params }).then(r => r.data),
  listMine: () => api.get('/reservations/me').then(r => r.data),
  create: (data) => api.post('/reservations', data).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status }).then(r => r.data)
};
