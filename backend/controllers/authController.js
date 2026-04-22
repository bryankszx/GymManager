function login(req, res) {
  const { usuario, senha } = req.body;
  
  if (!usuario || !senha) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Usuário e senha são obrigatórios'
    });
  }
  
  if (usuario === 'admin' && senha === '123456') {
    return res.json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      token: 'token-simples-demo',
      usuario: {
        nome: 'Administrador',
        usuario: 'admin'
      }
    });
  }
  
  return res.status(401).json({
    sucesso: false,
    mensagem: 'Usuário ou senha incorretos'
  });
}

module.exports = {
  login
};
