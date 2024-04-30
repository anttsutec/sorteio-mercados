const ArquivoController = require('../Controllers/ArquivoController');
const multer = require('multer');
const diskStorage = multer.diskStorage({ destination: 'input_files'} );
const upload = multer({ storage: diskStorage });

module.exports = (app) => {
   app.post('/arquivofonte', upload.single('file'), ArquivoController.post);
  //  app.put('/arquivo/:id', ArquivoController.put);
  //  app.delete('/arquivo/:id', ArquivoController.delete);
  //  app.get('/arquivos', ArquivoController.get);
  //  app.get('/arquivo/:id', ArquivoController.getById);
   app.get('/arquivofonte/:name', ArquivoController.getInputFileByName);
   app.get('/arquivosfontes', ArquivoController.getInputFiles);
   app.get('/arquivoresultado/:name', ArquivoController.getOutputFileByName);
   app.get('/arquivosresultados', ArquivoController.getOutputFiles);
}