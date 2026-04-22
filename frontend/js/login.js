document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const mensagemDiv = document.getElementById('mensagem');
    
    if (!usuario || !senha) {
        mostrarMensagem('Por favor, preencha todos os campos', 'erro');
        return;
    }
    
    try {
        const response = await api.login(usuario, senha);
        
        if (response.sucesso) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            mostrarMensagem('Login realizado com sucesso!', 'sucesso');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            mostrarMensagem(response.mensagem || 'Erro ao fazer login', 'erro');
        }
    } catch (error) {
        mostrarMensagem('Erro de conexão com o servidor', 'erro');
        console.error('Erro no login:', error);
    }
}

function mostrarMensagem(mensagem, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = mensagem;
    mensagemDiv.className = `mensagem ${tipo}`;
    
    setTimeout(() => {
        mensagemDiv.textContent = '';
        mensagemDiv.className = 'mensagem';
    }, 5000);
}
