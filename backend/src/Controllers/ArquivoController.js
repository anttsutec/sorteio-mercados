require('../Utils/seedrandom.js');
const gerarSufixoNomeArquivo = require('../Utils/geradorsufixonomearquivo.js');
const md5 = require('../Utils/createMD5.js');
const sorteio = require('../Models/Sorteio.js');
const fs = require('fs');


exports.post = (req, res, next) => {
  
  const sufixoNomeArquivo = gerarSufixoNomeArquivo.gerarSufixo();
  fs.renameSync(req.file.path,`input_files/arquivofonte-sorteio${sufixoNomeArquivo}.json`);
  const inputFilePath = `input_files/arquivofonte-sorteio${sufixoNomeArquivo}.json`;

  let arquivoJson = fs.readFileSync(inputFilePath);
  arquivoJson = JSON.parse(arquivoJson);
  
  let resultadoJson = {};
  
  for(numSorteio in arquivoJson) {
    //mesmo método chamado ao clicar no botão "Gerar Lista"
    resultadoJson[numSorteio] = sorteio.gereEImprimaResultado(arquivoJson[numSorteio]['mercado'],
                                                              arquivoJson[numSorteio]['vagas'],
                                                              arquivoJson[numSorteio]['inscritos']);
  };
  
  const outputFilePath = `output_files/resultado-sorteio${sufixoNomeArquivo}.json`;
  const arquivoResultadoSorteioJson = JSON.stringify(resultadoJson);

  try {
    //salva o arquivo de resultado em disco
    fs.writeFileSync(outputFilePath, arquivoResultadoSorteioJson);

    //gera os hashes md5
    let inputFileHash = md5.createMD5(`input_files/arquivofonte-sorteio${sufixoNomeArquivo}.json`);
    let outputFileHash = md5.createMD5(`output_files/resultado-sorteio${sufixoNomeArquivo}.json`);

    //imprime no console o resultado de forma assíncrona
    // imprimeResultadoNoConsole(resultadoJson);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(201).send({ "success": true,
                           "inputFile": {
                             "prefixoNome": 'arquivofonte-sorteio',
                             "sufixoNome": sufixoNomeArquivo,
                             "hash": inputFileHash
                           },
                           "outputFile": {
                             "prefixoNome": 'resultado-sorteio',
                             "sufixoNome": sufixoNomeArquivo,
                             "hash": outputFileHash
                           },
                           "resultadoJson": arquivoResultadoSorteioJson
                          });
  } catch (error) {
    console.error('Error writing JSON data to file:', error);
    res.status(500).send("Error writing JSON data to file:" + error);
  }
  
};

async function imprimeResultadoNoConsole(resultadoJson) {
  for(numSorteio in resultadoJson) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`========> ${numSorteio} <========`);
    console.log(resultadoJson[numSorteio]);
  };
}

// exports.put = (req, res, next) => {
//   let id = req.params.id;
//   res.status(201).send(`Rota PUT com ID! --> ${id}`);
// };

// exports.delete = (req, res, next) => {
//   let id = req.params.id;
//   res.status(200).send(`Rota DELETE com ID! --> ${id}`);
// };

// exports.get = (req, res, next) => {
//   res.status(200).send('Rota GET!');
// };

// exports.getById = (req, res, next) => {
//   const id = req.params.id;
//   res.status(200).send(`Rota GET com ID! --> ${id}`);
// };

//permite o download de um arquivo fonte quando o link é clicado
exports.getInputFileByName = (req, res, next) => {
  const fileName = req.params.name;
  const inputFilePath = `/home/node/app/input_files/${fileName}`;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.download(
    inputFilePath, 
    fileName, // Remember to include file extension
    (err) => {
        if (err) {
            res.send({
                error : err,
                msg   : "Problem downloading the file"
            })
        }
  });
};

//retorna lista de arquivos fontes
exports.getInputFiles = (req, res, next) => {
  const inputFilesPath = `/home/node/app/input_files`;
  
  fs.readdir(inputFilesPath, function(err, files) {
    let arquivos = [];
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
      let arquivo = {"nome": file,
                     "hash": md5.createMD5(inputFilesPath+"/"+file)}
      arquivos.push(arquivo);    
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send({ "success": true,
                           "arquivos": arquivos
                          });
  });
};

//permite o download de um arquivo de resultado quando o link é clicado
exports.getOutputFileByName = (req, res, next) => {
  const fileName = req.params.name;
  const outputFilePath = `/home/node/app/output_files/${fileName}`;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.download(
    outputFilePath, 
    fileName, // Remember to include file extension
    (err) => {
        if (err) {
            res.send({
                error : err,
                msg   : "Problem downloading the file"
            })
        }
  });
};

//retorna lista de arquivos de retorno
exports.getOutputFiles = (req, res, next) => {
  const outputFilesPath = `/home/node/app/output_files`;
  
  fs.readdir(outputFilesPath, function(err, files) {
    let arquivos = [];
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
      let arquivo = {"nome": file,
                     "hash": md5.createMD5(outputFilesPath+"/"+file)}
      arquivos.push(arquivo);    
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send({ "success": true,
                           "arquivos": arquivos
                          });
  });
};