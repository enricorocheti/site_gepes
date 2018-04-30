$(document).ready(function(){
	
	//VARIÁVEIS GLOBAIS
	var nTeses = 200;
	var nProf = 3;
	var menorAnoTeses = new Date().getFullYear();
	
	//TÍTULO DO DOCUMENTO
	document.title = "GEPES";
		
	//MATRIZ DAS TESES
	var matrizTeses = [];
	for (var i = 0; i < nTeses; i++) {
		matrizTeses[i] = [];
	}
	//MATRIZ DOS PROFESSORES
	var matrizProfessores = [];
	for (var i = 0; i < nProf; i++) {
		matrizProfessores[i] = [];
	}
	
	//FUNÇÕES INICIAIS
	carregaRodape();
	$.when(carregaColuna2()).done(function(){
		carregaColuna1("noticias");
	});
	carregaMenu("menu.gepes");
	carregaMatrizProfessores();
	$("body").scrollTop("0px");
	
	// LOGIN DROPDOWN
	$("#loginTrigger").click(function(){
        $(this).next("#loginBox").slideToggle();
        $(this).toggleClass("active");                    
        
        if ($(this).hasClass("active")) 
			$(this).find("span").html("&#x25B2;")
		else
			$(this).find("span").html("&#x25BC;")
    });
	
	//LOGIN SUBMIT
	$("#loginSubmit").click(function(){
		
	});
	
	//FUNÇÃO QUE CARREGA OS PROFESSORES DO gepes EM UMA MATRIZ
	function carregaMatrizProfessores(){
		$.getJSON("pages/professores.gepes", function(data){
			j = 0;
			for (var i in data) {
				matrizProfessores[j][0] = data[i].id;
				matrizProfessores[j][1] = data[i].nome;
				j++;
			}
		});
	}
	
	function alertRegistro(registro){
		if (registro == 0)
			alert("Nenhum registro encontrado.");
		else if (registro == 1)
			alert("1 registro encontrado.");
		else 
			alert(registro+ " registros encontrados.");
	}
	
	//FUNÇÃO PARA CARREGAR AS TESES DOS PROFESSORES EM UMA MATRIZ
	function carregaTeses(){
		$.ajax({
			url: "pages/teses_matriz.gepes",
			async: false,
			dataType: "json"
		}).success(function(data){
			j = 0;
			for (var i in data){
				matrizTeses[j][0] = data[i].id;
				matrizTeses[j][1] = data[i].id_prof;
				matrizTeses[j][2] = data[i].ano;
				matrizTeses[j][3] = data[i].nivel;
				matrizTeses[j][4] = data[i].titulo;
				matrizTeses[j][5] = data[i].autor;
				matrizTeses[j][6] = data[i].link;
				j++;
				if (data[i].ano < menorAnoTeses)
					menorAnoTeses = data[i].ano;
			}
			menorAnoTeses--;
		});
	}
	
	//FUNÇÃO QUE IMPRIME AS TESES DOS PROFESSORES
	function imprimeTeses(num_teses, id_prof, ano){
		id_prof = id_prof || 0;
		ano = ano || 0;
		var html = "";
		html += "<div class='coluna1margin'>";
		html += "<div class='barraSuperiorTeses'>"
		html += "	<h1>Teses</h1>";
		html += "		<select id='selectProf'>";
		html += "			<option value='0'>Todos orientadores</option>";
		for (var i = 0; i < nProf; i++)
			if (matrizProfessores[i][1]) html += "<option value='" + matrizProfessores[i][0] + "'>" + matrizProfessores[i][1] + "</option>";
		html += "		</select>";
		html += "		<input type='text' id='textSearchTeses'>";
		html += "		<input type='button' id='btnSearchTeses' value='Pesquisar'>";
		html += "		<label class='checkAutoClose'><input type='checkbox' id='checkAutoClose'>Fechamento <br>autom&aacute;tico</label>";
		html += "</div>";
		if(!ano && !id_prof){
			html += "<div class='barraInferiorTeses'>";
			ano = new Date().getFullYear();
			while (ano != menorAnoTeses){
				for (var i = 0; i < num_teses; i++) {
					if (matrizTeses[i][2] == ano){
						html += "<div class='barraInferiorTesesAno' data-ano='" + ano + "' title='Clique aqui para exibir as teses deste ano'> " + ano + "<span class='barraInferiorSpan' name='" + ano + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>";
						break;
					}
				}
				ano--;
			}
			html += "</div>";
			html += "<div class='boxTeses'>";
			ano = new Date().getFullYear();
			while (ano != menorAnoTeses){
				for (var i = 0; i < num_teses; i++) {
					if (matrizTeses[i][2] == ano){
						html += "<div class='tesesAnoBloco' data-ano='" + ano + "' title='Clique aqui para exibir as teses'>";
						html += "	<div class='tesesAno tituloNoticia'>" + ano + " <span class='dropTeses'>&#x25BC;</span></div>";
						html += "	<div class='tesesAnoItens'>";
						for (var j = 0; j < nProf; j++) {
							for (var k = 0; k < num_teses; k++) {
								if (matrizTeses[k][1] == matrizProfessores[j][0] && matrizTeses[k][2] == ano){
									html += "<div class='tesesProf coluna1margin' data-id_prof='" + matrizProfessores[j][0] + "'>";
									html += "	<div class='tesesProfNome'>" + matrizProfessores[j][1] + " <span class='dropTeses'>&#x25BC;</span></div>";
									html += "	<div class='tesesProfItens'>";
									for (var l = 0; l < num_teses; l++) {
										if (matrizTeses[l][1] == matrizProfessores[j][0] && matrizTeses[l][2] == ano && matrizTeses[l][3] == "d"){
											if (matrizTeses[l][6])
												html += "<a href='" + matrizTeses[l][6] + "' target='_blank'><p id='" + matrizTeses[l][0] + "'>Doutorando: " + matrizTeses[l][5] + "</br>" + matrizTeses[l][4] + "</p></a>";
											else
												html += "<p id='" + matrizTeses[l][0] + "'>Doutorando: " + matrizTeses[l][5] + "</br>" + matrizTeses[l][4] + "</p>";
										}
									}
									for (var l = 0; l < num_teses; l++) {
										if (matrizTeses[l][1] == matrizProfessores[j][0] && matrizTeses[l][2] == ano && matrizTeses[l][3] == "m"){
											if (matrizTeses[l][6])
												html += "<a href='" + matrizTeses[l][6] + "' target='_blank'><p id='" + matrizTeses[l][0] + "'>Mestrando: " + matrizTeses[l][5] + "</br>" + matrizTeses[l][4] + "</p></a>";
											else
												html += "<p id='" + matrizTeses[l][0] + "'>Mestrando: " + matrizTeses[l][5] + "</br>" + matrizTeses[l][4] + "</p>";
										}
									}
									html += "	</div>";
									html += "</div>";
									break;
								}
							}
						}
						html += "	</div>";
						html += "</div>";
						break;
					}
				}
				ano--;
			}
			html += "</div>";
		}
		html += "</div>";
		return html;
	}
	
	function pesquisaTeses(){
		//INICIALIZANDO A MATRIZ DOS ANOS
		var matrizAnos = [];
		indexAnos = new Date().getFullYear();
		while (indexAnos != 1970){
			matrizAnos[indexAnos] = 0;
			indexAnos--;
		}
		$(".barraInferiorSpan").each(function(){
			$(this).html("&nbsp;");
		});
		texto = $("#textSearchTeses").val().toLowerCase();
		prof = $("#selectProf").val();
		registro = 0;
		if (!texto){
			alert("Por favor, digite um valor para pesquisa!");
			return false;
		}
		if (prof != 0){
			for (var i = 0; i < nTeses; i++){
				for (var j = 0; j < nProf; j++) {
					if (prof == matrizProfessores[j][0] && prof == matrizTeses[i][1] && (String(matrizTeses[i][2]).toLowerCase().indexOf(texto) >= 0 || String(matrizTeses[i][4]).toLowerCase().indexOf(texto) >= 0 || String(matrizTeses[i][5]).toLowerCase().indexOf(texto) >= 0)){
						matrizAnos[matrizTeses[i][2]]++;
						$(".tesesProfItens p[id='" + matrizTeses[i][0] + "']").css("color","red");
					} else {
						$(".tesesProfItens p[id='" + matrizTeses[i][0] + "']").css("color","inherit");
					}
				}	
			}
			indexAnos = new Date().getFullYear();
			while (indexAnos != 1970){
				if (matrizAnos[indexAnos] != 0){
					$("span[name='" + indexAnos + "']").html(matrizAnos[indexAnos]);
					registro++;
				}
				indexAnos--;
			}
			alertRegistro(registro);
		} else {
			for (var i = 0; i < nTeses; i++){
				if (String(matrizTeses[i][2]).toLowerCase().indexOf(texto) >= 0 || String(matrizTeses[i][4]).toLowerCase().indexOf(texto) >= 0 || String(matrizTeses[i][5]).toLowerCase().indexOf(texto) >= 0){
					matrizAnos[matrizTeses[i][2]]++;
					$(".tesesProfItens p[id='" + matrizTeses[i][0] + "']").css("color","red");
				} else {
					$(".tesesProfItens p[id='" + matrizTeses[i][0] + "']").css("color","inherit");
				}
			}
			indexAnos = new Date().getFullYear();
			while (indexAnos != 1970){
				if (matrizAnos[indexAnos] != 0){
					$("span[name='" + indexAnos + "']").html(matrizAnos[indexAnos]);
					registro++;
				}
				indexAnos--;
			}
			alertRegistro(registro);
		}
	}
	
	//FUNÇÃO QUE CARREGA INFORMAÇÕES NO RODAPÉ DO SITE
	function carregaRodape(){
		$.getJSON("pages/informacoes.gepes", function(data){
			for (var i in data) {
				var html = data[i].predio + " - " + data[i].faculdade + " - " + data[i].endereco + ", " + data[i].telefone;
			}
			$(".rodape").append(html);
		});
	}
	
	//FUNÇÃO QUE GERA O MENU ATRAVÉS DO ARQUIVO JSON
	function carregaMenu(arquivo){
		var html = "<ul>";
		$.getJSON("pages/"+arquivo, function(data){
			for (var i in data) {
				if (data[i].submenu == 0){
					if (data[i].aux)
						html += "<li class='menuClick' id='" + data[i].classe + "' data-aux='" + data[i].aux +"'><a>" + data[i].texto + "</a></li>";
					else
						html += "<li class='menuClick' id='" + data[i].classe + "'><a>" + data[i].texto + "</a></li>";
				} else {
					html += "<li class='has-sub'><a>" + data[i].texto +"</a><ul>";
					for (var j in data[i].itens_submenu){
						if (data[i].itens_submenu[j].submenu == 0){
							if (data[i].itens_submenu[j].aux)
								html += "<li class='menuClick' id='" + data[i].itens_submenu[j].classe + "' data-aux='" + data[i].itens_submenu[j].aux + "'><a>" + data[i].itens_submenu[j].texto + "</a></li>";
							else
								html += "<li class='menuClick' id='" + data[i].itens_submenu[j].classe + "'><a>" + data[i].itens_submenu[j].texto + "</a></li>";
						} else {
							html += "<li class='has-sub'><a>" + data[i].itens_submenu[j].texto + "</a><ul>";
							for (var k in data[i].itens_submenu[j].itens_submenu){
								if (data[i].itens_submenu[j].itens_submenu[k].aux)
									html += "<li class='menuClick' id='" + data[i].itens_submenu[j].itens_submenu[k].classe + "' data-aux='" + data[i].itens_submenu[j].itens_submenu[k].aux + "'><a>" + data[i].itens_submenu[j].itens_submenu[k].texto + "</a></li>";
								else
									html += "<li class='menuClick' id='" + data[i].itens_submenu[j].itens_submenu[k].classe + "'><a>" + data[i].itens_submenu[j].itens_submenu[k].texto + "</a></li>";
							}
							html += "</ul></li>";
						}
					}
					html += "</ul></li>";
				}
			}
			html += "</ul>";
			$("#cssmenu").append(html);
			
			$(".menuClick").click(function(){
				el = $(this);
				if (el.attr("data-aux")){
					$.when(carregaColuna2()).done(function(){
						carregaColuna1(el.attr("id"),el.attr("data-aux"));
					});
				} else {
					$.when(carregaColuna2()).done(function(){
						carregaColuna1(el.attr("id"));
					});
				}
			});
		});
	}
	
	//FUNÇÃO PARA CARREGAR JSON A PARTIR DE UM DIRETÓRIO
	function carregaJsonDiretorio(diretorio){
		for (var i = 0; i < x; i++) {
			$.getJSON("pages/" + diretorio + i, function(data){
				for (var j in data){
					
				}
			});
		}
	}
	
	//FUNÇÃO PARA CARREGAR A COLUNA 2 (direita) DA PÁGINA PRINCIPAL DO SITE
	function carregaColuna2(){
		$(".coluna2").css("height","0px");
		$(".coluna2eventos").empty();
		var html1 = "";
		html1 += "<h3>Pr&oacute;ximos eventos</h3>";
		$.getJSON("pages/eventos.gepes", function(data){
			for (var i in data) {
				if (data[i].tipo == 5){
					html1 += "<p>" + data[i].titulo + " - ";
					if (data[i].dataFim)
						html1 += data[i].dataIni + " at&eacute; " + data[i].dataFim + "</p>";
					else
						html1 += data[i].dataIni + "</p>";
				}
				if (i == 2) break; //MÁXIMO DE 2 REGISTROS
			}
			$(".coluna2eventos").append(html1);
		});
		$(".coluna2paginas").empty();
		var html2 = "";
		html2 += "<h3>Mais acessadas</h3>";
		$.getJSON("pages/noticias.gepes", function(data){
			for (var i in data) {
				if (data[i].tipo == 4){
					html2 += "<p class='noticiaColuna2' title='" + data[i].titulo + "' data-id='" + data[i].id +"'>";
					html2 += data[i].titulo + "</p>";
				}
				if (i == 2) break; //MÁXIMO DE 2 REGISTROS
			}
			$(".coluna2paginas").append(html2);
			$(".noticiaColuna2").click(function(){
				el = $(this);
				$.when(carregaColuna2()).done(function(){
					carregaColuna1("noticias",el.attr("data-id"));
				});
			});
		});
	}
	
	//FUNÇÃO PARA CARREGAR A COLUNA 1 (esquerda) DA PÁGINA PRINCIPAL DO SITE
	function carregaColuna1(pagina,aux){
		$(".coluna1").empty();
		var html = "";
		if (pagina == "giepes"){
			carregaSiteGiepes();
			return;
		} else if (pagina == "gepes"){
			retornaSiteGiepes();
			return;
		}
		$.getJSON("pages/"+pagina+".gepes", function(data){
			for (var i in data) 
				switch(data[i].tipo){
					//TITULOS
					case 1:
						html += "<h1 class='coluna1margin'>" + data[i].texto + "</h1>";
						break;
					//PARAGRAFOS
					case 2:
						if (aux && aux == data[i].aux)
							html += "<p class='coluna1margin'>" + data[i].texto + "</p>";
						else if (!aux)
							html += "<p class='coluna1margin'>" + data[i].texto + "</p>";
						break;
					//ARQUIVOS E LINKS
					case 3:
						html += "<p class='coluna1margin'><a href='" + data[i].link + "' target='_blank'>" + data[i].texto + "</a></p>";
						break;
					//NOTICIAS
					case 4:
						if (!aux){
							html += "<div class='noticia' title='" + data[i].titulo + "' data-id='" + data[i].id +"'>";
							html += "	<div class='tituloNoticia'>" + data[i].titulo + "</div>";
							if (data[i].imagem){
								html += "	<img class='imagemNoticia1' src='uploads/imagens/" + data[i].imagem + "'>";
								html += "	<div class='descNoticia' style='height:64px;'>" + data[i].desc + "</div>";
							} else {
								html += "	<div class='descNoticia'>" + data[i].desc + "</div>";
							}
							html += "	<p class='dataNoticia'>Postado em " + data[i].data + " por " + data[i].usuario + "</p>";
							html += "</div>";
						} else if (aux == data[i].id){
							html = "";
							html += "<div class='coluna1margin'>";
							html += "	<h1 style='color: #009ae1;'>" + data[i].titulo + "</h1>";
							html += "	<p style='font-size:13px;'>Postado em " + data[i].data + ", por " + data[i].usuario + "</p>";
							if (data[i].imagem){
								html += "	<img class='imagemNoticia2' src='uploads/imagens/" + data[i].imagem + "'>";
								html += "	<p style='font-size:14px;'>" + data[i].legenda + "</p>";
							}
							html += data[i].conteudo;
							html += "	<div class='botaoVoltar' data-page='noticias'>VOLTAR</div>";
							html += "</div>";
						}
						break;
					//EVENTOS
					case 5:
						html += "<div class='coluna1margin evento'>";
						html += "	<div class='titulos'>" + data[i].titulo + "</div>";
						if (data[i].dataFim)
							html += "	<p style='font-size:14px;'>" + data[i].local + ", de " + data[i].dataIni + " at&eacute; " + data[i].dataFim + "</p>";
						else 
							html += "<p style='font-size:14px;'>" + data[i].local + ", " + data[i].dataIni + "</p>";
						html += "	<p>" + data[i].desc + "</p>";
						// retirado a pedido da Prof. Bete
						//html += "<p style='font-size:12px;text-align: right;'>Criado em " + data[i].dataCriou + " por " + data[i].usuarioCriou;
						html += "</div>";
						break;
					//GRUPOS NACIONAIS E INTERNACIONAIS
					case 6:
						if (aux == data[i].aux){
								html += "<div class='coluna1margin'>";
								html += "	<h1 style='color: #009ae1;'>" + data[i].titulo + "</h1>";
								if (data[i].imagem){
									html += "	<img class='imagemNoticia2' src='uploads/imagens/" + data[i].imagem + "'>";
									html += "	<p style='font-size:14px;'>" + data[i].legenda + "</p>";
								}
								html += "	<p>" + data[i].desc + "</p>";
								if (data[i].link){
									html += "<a href='" + data[i].link + "' target='_blank'>Acessar " + data[i].textoLink + "</a>";
								}
								html += "</div>";
						}
						break;
					//FOTOS
					case 7:
						html += "<div class='albumGaleria coluna1margin' data-id='" + data[i].id + "'>";
						html += "	<img class='previewGaleria' src='uploads/galeria/" + data[i].nomeAlbum + "/" + data[i].imagemPreview + "'>";
						html += "	<p>" + data[i].titulo + "</p>";
						html += "	<p style='font-size:12px;'>Postado em " + data[i].data + " por " + data[i].usuario + "</p>";
						html += "</div>";
						html += "<div class='foto2' data-id='" + data[i].id + "'>";
						html += "	<div class='tituloNoticia coluna1margin'>" + data[i].titulo + "</div><div class='coluna1margin'>";
						for (var j in data[i].fotos){
							if (data[i].fotos[j].desc){
								html += "<p style='	margin-top:20px;margin-bottom:20px;'><img class='imagemGaleria' src='uploads/galeria/" + data[i].nomeAlbum + "/" + data[i].fotos[j].imagem + "' title='" + data[i].fotos[j].desc + "'/>";
								html += "<p style='margin-top:-15px;'>" + data[i].fotos[j].desc + "</p></p>";
							} else {
								html += "<p style='	margin-top:20px;margin-bottom:45px;'><img class='imagemGaleria' src='uploads/galeria/" + data[i].nomeAlbum + "/" + data[i].fotos[j].imagem + "'/></p>";
							}
						}
						html += "</div></div>";
						break;
					//VIDEOS
					case 8:
						html += "<div class='videoGaleria coluna1margin'>";
						html += "	<div class='tituloNoticia'>" + data[i].titulo + "</div>";
						if (data[i].palestrante){
							html += "	<p><div style='font-weight:bolder;'>Palestrantes:</div>";
							for (var j in data[i].palestrante){
								html += data[i].palestrante[j].texto + "</br>";
							}
							html += "	</p>";
						}
						if (data[i].grupo){
							html += "<p><div style='font-weight:bolder;'>Grupos promotores:</div>";
							for (var j in data[i].grupo){
								html += data[i].grupo[j].texto + "</br>";
							}
							html += "</p>";
						}
						if (data[i].organizador){
							html += "<p><div style='font-weight:bolder;'>Organiza&ccedil;&atilde;o:</div>";
							for (var j in data[i].organizador){
								html += data[i].organizador[j].texto + "</br>";
							}
							html += "</p>";
						}
						html += "	<p><div style='font-weight:bolder;'>Data:</div> " + data[i].data + "</p>";
						html += "	<p>";
						for (var j in data[i].link){
							html += "<div style='font-weight:bolder;'><a href='" + data[i].link[j].link + "' target='_blank'>" + data[i].link[j].texto + "</a></div>"
						}
						html += "	</p>";
						html += "</div>";
						break;
					//TESES
					case 9:
						carregaTeses();
						html = imprimeTeses(nTeses,0,0);
						break;
				}
			html += "<div class='botaoVoltar coluna1margin' style='display:none;' data-page='fotos'>VOLTAR</div>";
			$(".coluna1").append(html);
			
			//ATRIBUIÇÕES NOTÍCIAS
			$(".noticia").click(function(){
				el = $(this);
				$.when(carregaColuna2()).done(function(){
					carregaColuna1("noticias",el.attr("data-id"));
				});
			});
			
			//ATRIBUIÇÕES FOTOS
			$(".foto2").css("display","none");
			$(".albumGaleria").click(function(){
				albumGaleria = $(this).attr("data-id");
				$(".albumGaleria").css("display","none");
				$(".foto2").each(function(){
					if (albumGaleria == $(this).attr("data-id")){
						$(this).css("display","inline");
						$(".botaoVoltar").show();
					}
				});
			});
			
			//ATRIBUIÇÕES TESES
			var ano = new Date().getFullYear();
			while (ano != menorAnoTeses){
				$(".tesesAnoBloco").each(function(){
					if ($(this).attr("data-ano") == ano){
						$(this).show(); //DISPLAY PRIMEIRA TESE
						$(this).children(".tesesAnoItens").show().find("span").html("&#x25B2;");
						$(this).children(".tesesAno").toggleClass("active").find("span").html("&#x25B2;");
						$(this).children(".tesesAnoItens").children(".tesesProf").slideToggle();
						$(this).children(".tesesAnoItens").children(".tesesProf").children(".tesesProfItens").show();
						$(this).children(".tesesAnoItens").children(".tesesProf").children(".tesesProfNome").toggleClass("active");
						teseTrue = 1;
						return false;
					} else {
						teseTrue = 0;
					}
				});
				if (teseTrue) break;
				ano--;
			}
			$(".barraInferiorTesesAno").click(function(){
				ano = $(this).attr("data-ano");
				if ($("#checkAutoClose").is(":checked"))
					$(".tesesAnoBloco:not([data-ano='"+ano+"'])").css("display","none");
				$(".tesesAnoBloco").each(function(){
					if ($(this).attr("data-ano") == ano){
						$(this).slideToggle();
						$(this).children(".tesesAnoItens").show();
						$(this).children(".tesesAno").toggleClass("active").find("span").html("&#x25B2;");
						$(this).children(".tesesAnoItens").children(".tesesProf").slideToggle();
					}
				});
			});
			$("#btnSearchTeses").click(function(){
				pesquisaTeses();
			});
			$("#textSearchTeses").keyup(function(e){
				if (e.keyCode == 13)
					pesquisaTeses();
			});
			$(".tesesAno").click(function(){
				ano = $(this).parent().attr("data-ano");
				prof = $("#selectProf").val();
				if (prof == 0){
					$(this).next(".tesesAnoItens").children(".tesesProf").show();
					$(this).next(".tesesAnoItens").slideToggle();
				} else {
					$(this).next(".tesesAnoItens").children(".tesesProf").hide();
					$(this).next(".tesesAnoItens").children(".tesesProf").each(function(){
						if ($(this).attr("data-id_prof") == prof)
							$(this).show();
					});
					$(this).next(".tesesAnoItens").slideToggle();
				}
				$(this).toggleClass("active");                    
				if ($(this).hasClass("active")) 
					$(this).find("span").html("&#x25B2;")
				else
					$(this).find("span").html("&#x25BC;")
			});
			$(".tesesProfNome").click(function(){
				$(this).next(".tesesProfItens").slideToggle();
				$(this).toggleClass("active");                    
				if ($(this).hasClass("active")) 
					$(this).find("span").html("&#x25B2;")
				else
					$(this).find("span").html("&#x25BC;")
			});
			
			//BOTÃO VOLTAR
			$(".botaoVoltar").click(function(){
				el = $(this);
				$.when(carregaColuna2()).done(function(){
					carregaColuna1(el.attr("data-page"));
				});
			});
			
			//COLOCANDO COR NO BACKGROUND
			coluna1 = $(".coluna1").height();
			coluna2 = $(".coluna2").height();
			//alert("Coluna1: "+coluna1+" Coluna2:"+coluna2);
			if (coluna1 > coluna2)
				$(".coluna2").css("height",coluna1+"px");
			else if (coluna2 > coluna1)
				$(".coluna1").css("height",coluna2+"px");
		});
	}
	
	function carregaSiteGiepes(){
		document.title = "GIEPES";
		$("head").append("<link id='cssGiepes' rel='stylesheet' type='text/css' href='giepes/giepes.css'/>");
		$("#login").css("display","none");
		$(".corpo").empty();
		$(".corpo").load("giepes/index.html",function(){
			carregaMenu("giepes/menu.gepes");
			carregaColuna1("giepes/quemsomos");
		});
	}
	
	function retornaSiteGiepes(){
		document.title = "GEPES";
		$("#cssGiepes").remove();
		$("#login").css("display","inline");
		$(".corpo").empty();
		$(".corpo").append("<img src='uploads/imagens/fe.jpg' style='width:100%;'><div id='cssmenu'></div><div class='coluna1'></div><div class='coluna2'><div class='coluna2eventos'></div><br><div class='coluna2paginas'></div></div>");
		carregaMenu("menu.gepes");
		carregaColuna1("noticias");
	}
	
	var hashes = window.location.href.split("?");
	if (hashes[1] == "giepes")
		carregaSiteGiepes();
	
});