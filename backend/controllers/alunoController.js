const alunoModel = require('../models/alunoModel');

function criarAluno(req, res) {
  const { nome, email, telefone, plano, status } = req.body;
  const usuarioId = req.usuario?.usuario || 'admin';

  if (!nome || !email || !telefone || !plano) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Nome, email, telefone e plano são obrigatórios'
    });
  }

  try {
    const novoAluno = alunoModel.criarAluno({
      nome,
      email,
      telefone,
      plano,
      status,
      usuarioId
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Aluno criado com sucesso',
      aluno: novoAluno
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar aluno'
    });
  }
}

function listarAlunos(req, res) {
  const usuarioId = req.usuario?.usuario || 'admin';
  
  try {
    const alunos = alunoModel.getAlunos(usuarioId);
    return res.json({
      sucesso: true,
      alunos: alunos
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar alunos'
    });
  }
}

function buscarAluno(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuario?.usuario || 'admin';

  if (!id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID do aluno é obrigatório'
    });
  }

  try {
    const aluno = alunoModel.buscarAlunoPorId(id);

    if (!aluno) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }

    // Verificar se o aluno pertence ao usuário
    if (aluno.usuarioId !== usuarioId) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para acessar este aluno'
      });
    }

    return res.json({
      sucesso: true,
      aluno: aluno
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar aluno'
    });
  }
}

function atualizarAluno(req, res) {
  const { id } = req.params;
  const { nome, email, telefone, plano, status } = req.body;
  const usuarioId = req.usuario?.usuario || 'admin';

  if (!id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID do aluno é obrigatório'
    });
  }

  try {
    const alunoExistente = alunoModel.buscarAlunoPorId(id);
    
    if (!alunoExistente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }

    // Verificar se o aluno pertence ao usuário
    if (alunoExistente.usuarioId !== usuarioId) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para editar este aluno'
      });
    }

    const alunoAtualizado = alunoModel.atualizarAluno(id, {
      nome,
      email,
      telefone,
      plano,
      status
    });

    return res.json({
      sucesso: true,
      mensagem: 'Aluno atualizado com sucesso',
      aluno: alunoAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar aluno'
    });
  }
}

function deletarAluno(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuario?.usuario || 'admin';

  if (!id) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID do aluno é obrigatório'
    });
  }

  try {
    const alunoExistente = alunoModel.buscarAlunoPorId(id);
    
    if (!alunoExistente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }

    // Verificar se o aluno pertence ao usuário
    if (alunoExistente.usuarioId !== usuarioId) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Você não tem permissão para deletar este aluno'
      });
    }

    const deletado = alunoModel.deletarAluno(id);

    return res.json({
      sucesso: true,
      mensagem: 'Aluno deletado com sucesso'
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar aluno'
    });
  }
}

function getEstatisticas(req, res) {
  const usuarioId = req.usuario?.usuario || 'admin';
  
  try {
    const estatisticas = alunoModel.getEstatisticas(usuarioId);
    return res.json({
      sucesso: true,
      estatisticas: estatisticas
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar estatísticas'
    });
  }
}

module.exports = {
  criarAluno,
  listarAlunos,
  buscarAluno,
  atualizarAluno,
  deletarAluno,
  getEstatisticas
};
