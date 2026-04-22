document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
    carregarEstatisticas();
    atualizarNomeUsuario();
});

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
}

function atualizarNomeUsuario() {
    const usuarioData = localStorage.getItem('usuario');
    const nomeUsuarioElement = document.getElementById('nomeUsuario');
    
    if (usuarioData && nomeUsuarioElement) {
        const usuario = JSON.parse(usuarioData);
        nomeUsuarioElement.textContent = usuario.nome || 'Administrador';
    }
}

async function carregarEstatisticas() {
    try {
        const response = await api.getEstatisticas();
        
        if (response.sucesso) {
            const stats = response.estatisticas;
            
            document.getElementById('totalAlunos').textContent = stats.total || 0;
            document.getElementById('alunosAtivos').textContent = stats.ativos || 0;
            document.getElementById('alunosInativos').textContent = stats.inativos || 0;
            document.getElementById('alunosAtrasados').textContent = stats.atrasados || 0;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
}

function abrirWhatsApp() {
    const mensagem = encodeURIComponent('Olá! Gostaria de mais informações sobre a academia.');
    const whatsappUrl = `https://wa.me/5511999999999?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
}
