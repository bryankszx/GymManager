const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '../database/alunos.json');

function getAlunos(usuarioId = null) {
  try {
    const data = fs.readFileSync(databasePath, 'utf8');
    const alunos = JSON.parse(data);
    
    if (usuarioId) {
      return alunos.filter(aluno => aluno.usuarioId === usuarioId);
    }
    
    return alunos;
  } catch (error) {
    return [];
  }
}

function saveAlunos(alunos) {
  try {
    fs.writeFileSync(databasePath, JSON.stringify(alunos, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

function gerarId() {
  const alunos = getAlunos();
  if (alunos.length === 0) {
    return 1;
  }
  const maiorId = Math.max(...alunos.map(aluno => aluno.id));
  return maiorId + 1;
}

function criarAluno(dados) {
  const alunos = getAlunos();
  const novoAluno = {
    id: gerarId(),
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    plano: dados.plano,
    status: dados.status || 'ativo',
    usuarioId: dados.usuarioId || 'admin',
    dataCadastro: new Date().toISOString()
  };

  alunos.push(novoAluno);
  saveAlunos(alunos);
  return novoAluno;
}

function buscarAlunoPorId(id) {
  const alunos = getAlunos();
  return alunos.find(aluno => aluno.id === parseInt(id));
}

function atualizarAluno(id, dados) {
  const alunos = getAlunos();
  const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  alunos[index] = {
    ...alunos[index],
    ...dados,
    id: parseInt(id)
  };
  
  saveAlunos(alunos);
  return alunos[index];
}

function deletarAluno(id) {
  const alunos = getAlunos();
  const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
  
  if (index === -1) {
    return false;
  }
  
  alunos.splice(index, 1);
  saveAlunos(alunos);
  return true;
}

function getEstatisticas(usuarioId = null) {
  const alunos = getAlunos(usuarioId);
  const total = alunos.length;
  const ativos = alunos.filter(aluno => aluno.status === 'ativo').length;
  const inativos = alunos.filter(aluno => aluno.status === 'inativo').length;
  const atrasados = alunos.filter(aluno => aluno.status === 'atrasado').length;

  return {
    total,
    ativos,
    inativos,
    atrasados
  };
}

module.exports = {
  getAlunos,
  criarAluno,
  buscarAlunoPorId,
  atualizarAluno,
  deletarAluno,
  getEstatisticas
};
