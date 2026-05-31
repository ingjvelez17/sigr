import api from './api.js';

export const reportService = {
  daily: (date) => api.get('/reports/daily', { params: { date } }).then(r => r.data),
  history: () => api.get('/reports/history').then(r => r.data),
  currentCash: () => api.get('/reports/cash/current').then(r => r.data),
  openCash: (data) => api.post('/reports/cash/open', data).then(r => r.data),
  closeCash: (id, data) => api.post(`/reports/cash/${id}/close`, data).then(r => r.data)
};
