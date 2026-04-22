let alunos = [];

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
    atualizarNomeUsuario();
    carregarAlunos();
    
    const alunoForm = document.getElementById('alunoForm');
    if (alunoForm) {
        alunoForm.addEventListener('submit', handleAlunoSubmit);
    }
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

async function carregarAlunos() {
    try {
        const response = await api.getAlunos();
        
        if (response.sucesso) {
            alunos = response.alunos;
            renderizarTabelaAlunos(alunos);
        }
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        const tbody = document.getElementById('alunosTableBody');
        tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar alunos</td></tr>';
    }
}

function renderizarTabelaAlunos(alunosList) {
    const tbody = document.getElementById('alunosTableBody');
    
    if (alunosList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum aluno cadastrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = alunosList.map(aluno => `
        <tr>
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.email}</td>
            <td>${aluno.telefone}</td>
            <td>${aluno.plano}</td>
            <td><span class="status-badge status-${aluno.status}">${aluno.status}</span></td>
            <td class="action-buttons">
                <button onclick="editarAluno(${aluno.id})" class="btn btn-secondary btn-small">Editar</button>
                <button onclick="deletarAluno(${aluno.id})" class="btn btn-danger btn-small">Deletar</button>
            </td>
        </tr>
    `).join('');
}

function buscarAlunos() {
    const buscaInput = document.getElementById('buscaInput');
    const termoBusca = buscaInput.value.toLowerCase().trim();
    
    if (!termoBusca) {
        renderizarTabelaAlunos(alunos);
        return;
    }
    
    const alunosFiltrados = alunos.filter(aluno => 
        aluno.nome.toLowerCase().includes(termoBusca) ||
        aluno.email.toLowerCase().includes(termoBusca)
    );
    
    renderizarTabelaAlunos(alunosFiltrados);
}

function abrirModalCadastro() {
    document.getElementById('modalTitle').textContent = 'Novo Aluno';
    document.getElementById('alunoForm').reset();
    document.getElementById('alunoId').value = '';
    document.getElementById('modalAluno').style.display = 'block';
}

async function editarAluno(id) {
    try {
        const response = await api.getAluno(id);
        
        if (response.sucesso) {
            const aluno = response.aluno;
            
            document.getElementById('modalTitle').textContent = 'Editar Aluno';
            document.getElementById('alunoId').value = aluno.id;
            document.getElementById('nome').value = aluno.nome;
            document.getElementById('email').value = aluno.email;
            document.getElementById('telefone').value = aluno.telefone;
            document.getElementById('plano').value = aluno.plano;
            document.getElementById('status').value = aluno.status;
            
            document.getElementById('modalAluno').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar aluno:', error);
        alert('Erro ao carregar dados do aluno');
    }
}

async function handleAlunoSubmit(event) {
    event.preventDefault();
    
    const alunoId = document.getElementById('alunoId').value;
    const alunoData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        plano: document.getElementById('plano').value,
        status: document.getElementById('status').value
    };
    
    try {
        let response;
        
        if (alunoId) {
            response = await api.updateAluno(alunoId, alunoData);
        } else {
            response = await api.createAluno(alunoData);
        }
        
        if (response.sucesso) {
            fecharModal();
            carregarAlunos();
            alert(response.mensagem);
        } else {
            alert(response.mensagem || 'Erro ao salvar aluno');
        }
    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        alert('Erro ao salvar aluno');
    }
}

async function deletarAluno(id) {
    if (!confirm('Tem certeza que deseja deletar este aluno?')) {
        return;
    }
    
    try {
        const response = await api.deleteAluno(id);
        
        if (response.sucesso) {
            carregarAlunos();
            alert(response.mensagem);
        } else {
            alert(response.mensagem || 'Erro ao deletar aluno');
        }
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        alert('Erro ao deletar aluno');
    }
}

function fecharModal() {
    document.getElementById('modalAluno').style.display = 'none';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
}

window.onclick = function(event) {
    const modal = document.getElementById('modalAluno');
    if (event.target === modal) {
        fecharModal();
    }
}
