//carrega a lista de arquivos quando a página é carregada
function carregarArquivos(){
  fetch("http://localhost:8001/arquivosfontes", {
    method: "GET",
    mode: "cors"
  })
  .then(response => response.json())
  .then(jsonInput => {

    if(jsonInput.success){

      fetch("http://localhost:8001/arquivosresultados", {
        method: "GET",
        mode: "cors"
      })
      .then(response => response.json())
      .then(jsonOutput => {

        if(jsonOutput.success) {

          for(i in jsonInput.arquivos){
            const tr = document.createElement('tr');
    
            const tdArquivoFonte = document.createElement('td');
            const linkArquivoFonte = document.createElement('a');
            linkArquivoFonte.href = `http://localhost:8001/arquivofonte/${jsonInput.arquivos[i].nome}`;
            linkArquivoFonte.innerText = `${jsonInput.arquivos[i].nome}`;
            tdArquivoFonte.append(linkArquivoFonte);
            tr.append(tdArquivoFonte);
    
            const tdHashArquivoFonte = document.createElement('td');
            tdHashArquivoFonte.innerText = jsonInput.arquivos[i].hash;
            tr.append(tdHashArquivoFonte);
    
            const tdArquivoResultado = document.createElement('td');
            const linkArquivoResultado = document.createElement('a');
            linkArquivoResultado.href = `http://localhost:8001/arquivoresultado/${jsonOutput.arquivos[i].nome}`;
            linkArquivoResultado.innerText = `${jsonOutput.arquivos[i].nome}`;
            tdArquivoResultado.append(linkArquivoResultado);
            tr.append(tdArquivoResultado);
    
            const tdHashArquivoResultado = document.createElement('td');
            tdHashArquivoResultado.innerText = jsonOutput.arquivos[i].hash;
            tr.append(tdHashArquivoResultado);
    
            document.getElementById('listaArquivos').append(tr);
          }
        }
      });

    }
  });
}

//faz upload e processamento de um arquivo
function enviarArquivo(){

  let aguardandoProcessamentoArquivo = true;
  let processamentoFinalizado = false;
  const btnModalClose = document.getElementById('btn-modal-close');
  const btnModalOk = document.getElementById('btn-modal-ok');
  const textarea = document.getElementById('modal_log-text');

  btnModalClose.setAttribute("disabled", "");
  btnModalOk.setAttribute("disabled", "");
  document.body.style.pointerEvents = "none";

  textarea.value = `${dateInDDMMYYYYhhmmss(Date.now())}  Processando . . .`;

  const exibirTextoProcessando = async () => {
    while(true) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (aguardandoProcessamentoArquivo) textarea.value += ' .';
      if (processamentoFinalizado) {
        btnModalClose.removeAttribute('disabled');
        btnModalOk.removeAttribute('disabled');
        document.body.style.pointerEvents = "";
        break;
      }
    };
  }
   
  exibirTextoProcessando();

  const arquivo = document.getElementById("arquivoFonteSorteio").files[0];
  const formData = new FormData();
  formData.append('file', arquivo);

  fetch("http://localhost:8001/arquivofonte", {
    method: "POST",
    mode: "cors",
    body: formData
  })
  .then(response => response.json())
  .then(json => {

    if (json.success){

      aguardandoProcessamentoArquivo = false;

      //exibe o log do sorteio em tela
      const exibirLogProcessamento = async () => {
        let resultado = JSON.parse(json.resultadoJson);

        for(sorteio in resultado){
          await new Promise(resolve => setTimeout(resolve, 80));

          let tamanhoTextoInicial = textarea.value.length;
          let datahora = dateInDDMMYYYYhhmmss(resultado[sorteio].semente);
  
          textarea.value += `\n${datahora}  ******** ${sorteio} ********`;
          textarea.value += `\n${datahora}  Mercado: ${resultado[sorteio].mercado}`;
          textarea.value += `\n${datahora}  Vagas: ${resultado[sorteio].vagas}`;
          textarea.value += `\n${datahora}  semente: ${resultado[sorteio].semente}`;
  
          for(x=0; x<resultado[sorteio].vagas; x++) {
            const idVencedor = resultado[sorteio].resultadoSorteio[x];
            const cnpjVencedor = resultado[sorteio].inscritos[idVencedor];
            textarea.value += `\n${datahora}  Vencedor (nº ${x+1}):  ${cnpjVencedor}`;
            textarea.scrollTop = textarea.scrollHeight;
          }

          let tamanhoTextoFinal = textarea.value.length;

          if (tamanhoTextoFinal > 50000) {
            //remove do início a quantidade de caracteres inseridos
            //desta forma impede que o textarea seja sobrecarregado
            textarea.value = textarea.value.substr(tamanhoTextoFinal-tamanhoTextoInicial,tamanhoTextoFinal);
          }
        }

        textarea.value += `\n${dateInDDMMYYYYhhmmss(Date.now())}  Processamento finalizado!!!`;
        textarea.scrollTop = textarea.scrollHeight;
        
        processamentoFinalizado = true;
      }

      exibirLogProcessamento();

      //inclui links para download dos arquivos e os hashes
      const tr = document.createElement('tr');

      const tdArquivoFonte = document.createElement('td');
      const linkArquivoFonte = document.createElement('a');
      linkArquivoFonte.href = `http://localhost:8001/arquivofonte/${json.inputFile.prefixoNome}${json.inputFile.sufixoNome}.json`;
      linkArquivoFonte.innerText = `${json.inputFile.prefixoNome}${json.inputFile.sufixoNome}.json`;
      tdArquivoFonte.append(linkArquivoFonte);
      tr.append(tdArquivoFonte);

      const tdHashArquivoFonte = document.createElement('td');
      tdHashArquivoFonte.innerText = json.inputFile.hash;
      tr.append(tdHashArquivoFonte);

      const tdArquivoResultado = document.createElement('td');
      const linkArquivoResultado = document.createElement('a');
      linkArquivoResultado.href = `http://localhost:8001/arquivoresultado/${json.outputFile.prefixoNome}${json.outputFile.sufixoNome}.json`;
      linkArquivoResultado.innerText = `${json.outputFile.prefixoNome}${json.outputFile.sufixoNome}.json`;
      tdArquivoResultado.append(linkArquivoResultado);
      tr.append(tdArquivoResultado);

      const tdHashArquivoResultado = document.createElement('td');
      tdHashArquivoResultado.innerText = json.outputFile.hash;
      tr.append(tdHashArquivoResultado);

      document.getElementById('tabelaArquivos').append(tr);

      document.getElementById('nomeArquivoFonteSelecionado').value = "";
      document.getElementById('btnEnviarArquivo').innerHTML = 'Enviar Arquivo';

      //aciona o download automaticamente
      // const link = document.createElement('a');
      // link.href = `http://localhost:8001/arquivoresultado/${json.outputFile.prefixoNome}${json.outputFile.sufixoNome}.json`;
      // document.body.append(link);
      // link.click();
      // link.parentNode.removeChild(link);
    }
  })
  .catch(err => console.log(err));

  document.getElementById('btnEnviarArquivo').innerHTML = 'Enviar Arquivo <i class="fa fa-spinner fa-spin"></i>';
}

//atualiza texto do Input Text com o nome do arquivo selecionado
document.getElementById('arquivoFonteSorteio').addEventListener('change', (event) => {
  document.getElementById('nomeArquivoFonteSelecionado').value = event.target.files[0].name;
  document.getElementById('btnEnviarArquivo').focus();
});


function dateInDDMMYYYYhhmmss(timestamp){
  let date = new Date(timestamp);
  date = date.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
  const dia = date.substring(0,2);
  const mes = date.substring(3,5);
  const ano = date.substring(6,10);
  const hora = date.substring(12,14);
  const minutos = date.substring(15,17);
  const segundos = date.substring(18,21);

  return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}  `;
}