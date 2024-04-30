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
      const link = document.createElement('a');
      link.href = `http://localhost:8001/arquivoresultado/${json.outputFile.prefixoNome}${json.outputFile.sufixoNome}.json`;
      document.body.append(link);
      link.click();
      link.parentNode.removeChild(link);
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