import api from './api.js';

export const menuService = {
  listCategories: () => api.get('/menu/categories').then(r => r.data),
  createCategory: (data) => api.post('/menu/categories', data).then(r => r.data),
  listItems: (params) => api.get('/menu/items', { params }).then(r => r.data),
  getItem: (id) => api.get(`/menu/items/${id}`).then(r => r.data),
  createItem: (data) => api.post('/menu/items', data).then(r => r.data),
  updateItem: (id, data) => api.put(`/menu/items/${id}`, data).then(r => r.data),
  deleteItem: (id) => api.delete(`/menu/items/${id}`).then(r => r.data)
};
