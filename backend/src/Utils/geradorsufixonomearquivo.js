function gerarSufixo(){
  let dataAtual = new Date();
  dataAtual = dataAtual.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
  const dia = dataAtual.substring(0,2);
  const mes = dataAtual.substring(3,5);
  const ano = dataAtual.substring(6,10);
  const hora = dataAtual.substring(12,14);
  const minutos = dataAtual.substring(15,17);
  const segundos = dataAtual.substring(18,21);

  return `_${ano}${mes}${dia}${hora}${minutos}${segundos}`;
}

module.exports = { gerarSufixo };