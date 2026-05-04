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

  // Questions
  getQuestions(tag = '', search = '') {
    const params = new URLSearchParams();
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);
    return this.request(`/questions?${params.toString()}`);
  }
  getQuestion(id) { return this.request(`/questions/${id}`); }
  postQuestion(title, content, game_tag) { return this.request('/questions', { method: 'POST', body: JSON.stringify({ title, content, game_tag }) }); }

  // Answers
  postAnswer(question_id, content) { return this.request('/answers', { method: 'POST', body: JSON.stringify({ question_id, content }) }); }
  acceptAnswer(id) { return this.request(`/answers/${id}/accept`, { method: 'POST' }); }

  // Votes
  vote(target_type, target_id, value) { return this.request('/votes', { method: 'POST', body: JSON.stringify({ target_type, target_id, value }) }); }
}

window.api = new Api();
