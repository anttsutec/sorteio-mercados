/*
<!--INSTITUTO FEDERAL DE SANTA CATARINA - DEPARTAMENTO DE INGRESSO-->
<!--Autores: Antonielly Garcia Rodrigues, Alex Helder Cordeiro de Oliveira-->
<!--20/01/2011-->
<!--EM CASO DE AUDITORIA:
Da maneira como este c�digo-fonte se encontra implementado, a semente utilizada na gera��o de n�meros pseudo-aleat�rios � o tempo (quantos milissegundos se passaram desde 1 de Janeiro de 1970 at� o momento em que o bot�o "Gerar lista" foi clicado). Assim, cada vez que se clica no bot�o "Gerar lista", uma lista diferente � gerada, sendo o tempo o fator que torna a lista pseudo-aleat�ria em lista realmente aleat�ria.
Caso deseje verificar a autenticidade da lista impressa publicada usando a semente fixa que aparece ao final dela, siga os seguintes passos:
1) Fa�a busca neste c�digo-fonte por tr�s asteriscos (***), contidos em coment�rios, e siga todas as instru��es de altera��o;
2) Utilize a semente de gera��o de n�meros pseudo-aleat�rios que lhe foi fornecida ao final da lista impressa em papel e assinada pelas testemunhas do processo seletivo;
3) Efetue a compara��o da sa�da do programa com a lista impressa publicada.-->
<?xml version="1.0" encoding="ISO-8859-1" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<title>Sorteio Eletr�nico - Instituto Federal de Educa��o, Ci�ncia e Tecnologia de Santa Catarina (IFSC)</title>
<script src=seedrandom.js></script>
<script>
*/

function gereEImprimaResultado(mercado, vagas, inscritos) {
	// var nomeCurso = 'TESTE API'; //document.sorteio.nomeCurso.value;
	// var inscritos = 10; //document.sorteio.totalInscritos.value;
	var semente = new Date().getTime();
	// if(document.sorteio.sementeManual.checked) {
	// 	semente = parseInt(document.sorteio.semente.value);
	// } else {
	// 	semente = new Date().getTime();
	// }
	// var vagas = 3; //document.sorteio.vagas.value;

  //monta json que será retornado como resultado
  let resultadoJson = {};

  resultadoJson['mercado'] = mercado;
  resultadoJson['vagas'] = vagas;
  resultadoJson['inscritos'] = {};

  //define identificador para cada CNPJ
  let indice = 1;
  inscritos.forEach(element => {
    resultadoJson['inscritos'][indice] = element;
    indice++;
  });
  
	var embaralhada = gereListaEmbaralhada(inscritos.length, semente);
	// var pontoImpressao = //document.sorteio.textArea;
	// var pontoImpressao = document.getElementById('resultado');
	// imprimaResultado(nomeCurso, semente, embaralhada, vagas, pontoImpressao);
  resultadoJson['semente'] = embaralhada['semente'];
  resultadoJson['resultadoSorteio'] = embaralhada['resultadoSorteio'];
  resultadoJson['timestamp'] = Date.now();

  return resultadoJson;
}

function gereListaEmbaralhada(inscritos, semente){
	Math.seedrandom(semente);
	var consumida = new Array(inscritos);
	var resultado = new Array(inscritos);
	for(var i = 0; i < inscritos; i++) {
		consumida[i] = 1+i;
		resultado[i] = 0;
	}

	for(var i = 0; i < inscritos; i++) {
		var aleatorio = Math.floor(Math.random()*inscritos);
		while(consumida[aleatorio] == 0) {
			aleatorio = (1+aleatorio)%inscritos;
		}
		resultado[i] = consumida[aleatorio];
		consumida[aleatorio] = 0;
	}
	
	return {"semente": semente, "resultadoSorteio": resultado};
}

// function imprimaResultado(nomeCurso, semente, embaralhada, vagas, pontoImpressao) {
//   console.log("imprimaResultado================");
// 	var conteudo = "";
// 	conteudo += gereVisualDeCabecalhoDaLista(nomeCurso, semente);
// 	conteudo += gereVisualDeListaDeSelecionados(embaralhada, vagas);
// 	conteudo += gereVisualDeCabecalhoDaEspera(nomeCurso);
// 	conteudo += gereVisualDeListaDeEspera(embaralhada, vagas);
// 	conteudo += gereVisualDeFim();
// 	conteudo += gereVisualDeInformacoesTecnicas(semente);
// 	//pontoImpressao.value = conteudo;
// 	//pontoImpressao.innerHTML = conteudo;
// }

// function gereVisualDeCabecalhoDaLista(nomeCurso, semente){
// 	var data = new Date(semente);
// 	return "Hor�rio do sorteio: " + data.getDate() + "/" + (pad(data.getMonth()+1)) + "/" + pad(data.getFullYear()) + ", " + pad(data.getHours()) + ":" + pad(data.getMinutes()) + ":" + pad(data.getSeconds()) + ".<H1>Lista <b>OFICIAL</b> do sorteio - " + nomeCurso + "</H1><H2>Primeira chamada</H2>";

// }

// function gereVisualDeListaDeSelecionados(lista, ultimaPosicao){
// 	var conteudo = "";
// 	for(var i = 0; i < ultimaPosicao; i++){
// 		conteudo += "<font size='6'><tt><b>" + lista[i] + "</b>" + padSpaces(lista[i], lista.length) + "(" + (i+1) + "�)</tt></font>";

// 		if(i < ultimaPosicao - 1){
// 			conteudo += "<br/>";
// 		}
// 	}
// 	return conteudo;
// }

// function gereVisualDeCabecalhoDaEspera(nomeCurso){
// 	return "<H2>Lista de Espera - " + nomeCurso + "</H2>";
// }

// function gereVisualDeListaDeEspera(lista, ultimaPosicao){
// 	var conteudo = "";
// 	for(var i = ultimaPosicao; i < lista.length; i++){
// 		conteudo += "<font size='5'><tt>" + lista[i] + padSpaces(lista[i], lista.length) + "(" + (parseInt(i)+1) + "�)</tt></font>";

// 		if(i < lista.length - 1){
// 			conteudo += "<br/>";
// 		}
// 	}
// 	return conteudo;
// }

// function gereVisualDeFim() {
// 	return "<br/><b>FIM.</b>";
// }

// function gereVisualDeInformacoesTecnicas(semente) {
// 	var conteudo = "<H3>Informa��es t�cnicas do sistema</H3>";
// 	conteudo += "<b>platform:</b> " + navigator.platform + "<br/>";
// 	conteudo += "<b>appName:</b> " + navigator.appName + "<br/>";
// 	conteudo += "<b>appVersion:</b> " + navigator.appVersion + "<br/>";
// 	conteudo += "<b>userAgent:</b> " + navigator.userAgent + "<br/>";
// 	conteudo += "<b>Vers�o deste sistema:</b> 20/01/2011<br/>"
// 	conteudo += "<b>Semente utilizada:</b> \"" + semente + "\"<br/>";
// 	return conteudo;
// }

// function pad(number) {
//      return (number < 10 ? '0' : '') + number;
   
// }

// function padSpaces(atual, maximo) {
//      var conteudo = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
//      var espacosExtras = (maximo + "").length-(atual + "").length;

//      for(var i = 1; i <= espacosExtras; i++){
//         conteudo += "&nbsp;";
//      }

//      return conteudo;
// }

/*
</script>
</head>
<body>
<img src="logo.jpg" />
 <form name="sorteio">
  <table border=0>
   <tr>
    <td>
     Arquivo: 
    </td>
    <td colspan=3>
    <input type="file" name="arquivo" size=75 maxlength=100>
    </td>
   </tr>
   <tr>
   <!-- <tr>
    <td>
     Curso: 
    </td>
    <td colspan=3>
    <input type="text" name="nomeCurso" size=75 maxlength=100>
    </td>
   </tr>
   <tr>
    <td>
     Total de Inscritos: 
    </td>
    <td colspan=1>
    <input type="text" name="totalInscritos" size=10 maxlength=5>
    </td>
    <td>
     Vagas: 
    </td>
    <td colspan=2>
    <input type="text" name="vagas" size=10 maxlength=5>
    </td>
   </tr> -->
   <tr>
    <td>
    <input type="button" value="Gerar Lista" onclick="gereEImprimaResultado()">
    </td>
    <!-- <td width=270> -->
<!--***EM CASO DE AUDITORIA: TROQUE O VALOR DE style DE 'visibility:hidden' para 'visibility:visible', e descomente o texto "Inserir semente manualmente", que aparece abaixo***-->
    <!-- <input type="checkbox" name="sementeManual" onclick="document.sorteio.semente.disabled = !this.checked;" style='visibility:visible'>Inserir semente manualmente
    </td>
    <td> -->
<!--***EM CASO DE AUDITORIA: Descomente o texto "Semente: ", que aparece abaixo***-->
<!-- Semente:
    </td>
    <td> -->
<!--***EM CASO DE AUDITORIA: TROQUE O VALOR DE style DE 'visibility:hidden' para 'visibility:visible'***-->
    <!-- <input type="text" name="semente" size=20 maxlength=50 disabled style='visibility:visible'>
    </td> -->
   </tr>
  </table>
  <p id="resultado"></p>
 <!--<textarea name="textArea" rows=26 cols=92 readonly>
 </textarea>-->
 </form>
</body>
</html>
*/

module.exports = { gereEImprimaResultado };