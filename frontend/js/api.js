const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('token');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    async login(usuario, senha) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ usuario, senha })
        });
    }

    async getAlunos() {
        return this.request('/alunos');
    }

    async getAluno(id) {
        return this.request(`/alunos/${id}`);
    }

    async createAluno(alunoData) {
        return this.request('/alunos', {
            method: 'POST',
            body: JSON.stringify(alunoData)
        });
    }

    async updateAluno(id, alunoData) {
        return this.request(`/alunos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(alunoData)
        });
    }

    async deleteAluno(id) {
        return this.request(`/alunos/${id}`, {
            method: 'DELETE'
        });
    }

    async getEstatisticas() {
        return this.request('/alunos/estatisticas');
    }
}

const api = new ApiClient();
