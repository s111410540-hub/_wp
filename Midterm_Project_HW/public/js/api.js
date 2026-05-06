const API_BASE = '/api';

class Api {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token, user) {
    this.token = token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '請求失敗');
    }

    return data;
  }

  // Auth
  login(email, password) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  register(username, email, password) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }); }
  getUserProfile(tab = 'questions') { return this.request(`/users/profile?tab=${tab}`); }

  // Questions
  getQuestions(tag = '', search = '', page = 1, sort = 'newest') {
    const params = new URLSearchParams();
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('sort', sort);
    return this.request(`/questions?${params.toString()}`);
  }
  getQuestion(id) { return this.request(`/questions/${id}`); }
  postQuestion(title, content, game_tag) { return this.request('/questions', { method: 'POST', body: JSON.stringify({ title, content, game_tag }) }); }
  editQuestion(id, title, content) { return this.request(`/questions/${id}`, { method: 'PUT', body: JSON.stringify({ title, content }) }); }
  deleteQuestion(id) { return this.request(`/questions/${id}`, { method: 'DELETE' }); }

  // Answers
  postAnswer(question_id, content) { return this.request('/answers', { method: 'POST', body: JSON.stringify({ question_id, content }) }); }
  editAnswer(id, content) { return this.request(`/answers/${id}`, { method: 'PUT', body: JSON.stringify({ content }) }); }
  deleteAnswer(id) { return this.request(`/answers/${id}`, { method: 'DELETE' }); }
  acceptAnswer(id) { return this.request(`/answers/${id}/accept`, { method: 'POST' }); }

  // Votes
  vote(target_type, target_id, value) { return this.request('/votes', { method: 'POST', body: JSON.stringify({ target_type, target_id, value }) }); }

  // Market & Materials
  async getMaterials(category = '') {
    const url = category ? `/materials?category=${encodeURIComponent(category)}` : '/materials';
    return await this.request(url);
  }

  async getListings(material_id = '', type = '', seller_id = '') {
    let params = new URLSearchParams();
    if (material_id) params.append('material_id', material_id);
    if (type) params.append('type', type);
    if (seller_id) params.append('seller_id', seller_id);
    const qs = params.toString();
    const url = qs ? `/listings?${qs}` : '/listings';
    return await this.request(url);
  }

  async postListing(data) {
    return await this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async editListing(id, data) {
    return await this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteListing(id) {
    return await this.request(`/listings/${id}`, {
      method: 'DELETE'
    });
  }
}

window.api = new Api();
