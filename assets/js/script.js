"use strict";

import { conteudos } from './modulos/conteudos.js';
import { tooltips, verificarInputsRecarregamento, atribuirLinks, isEmpty } from './modulos/utilitarios.js';
import { removerPeriodo, alterarBotao, adicionarPeriodos, escutaEventoInput, baixarResultados } from './modulos/funcoes.js';

let visualizacao = 0;
let calculado = false;

(() => {
  let resultados = new Array();
  let periodos = new Array();
  const mode = 1;
  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  });
  
  const atribuirAcoes = () => {
    const acoes = document.querySelectorAll('[data-action]');
    acoes.forEach(acao => {
      switch(acao.dataset.action.toLowerCase().trim()){
        case 'adicionar-periodo':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          const length = document.querySelectorAll('[data-element="periodo"]').length;
          document.querySelector('[data-element="periodos"]').appendChild(conteudos.periodo(length));
          $(`#inicio-periodo-${length}`).mask('00/00/0000');
          $(`#fim-periodo-${length}`).mask('00/00/0000');
          
          setTimeout(() => {
            $(`#inicio-periodo-${length}`).focus();
          }, 500);
          
          tooltips();
        })
        break;
        
        case 'baixar-resultados':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          baixarResultados(resultados);
        })
        break;
        
        case 'calcular':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          adicionarPeriodos(periodos, resultados).then((retorno) => {
            resultados = retorno;
          });
          alterarBotao('btn btn-primary', 'Calculando...');
        })
        break;
        
        case 'alternar-visualizacao':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          const btn = document.querySelector('[data-action="alternar-visualizacao"]')
          const normal = $('[data-content="demais-informacoes"]');
          const card = $('[data-content="card-resultado"]');

          if(btn.querySelector('i').classList.value == 'bi bi-card-heading'){
            btn.innerHTML = '<i class="bi bi-card-text"></i>';
            visualizacao = 0;
          }else{
            btn.innerHTML = '<i class="bi bi-card-heading"></i>';
            visualizacao = 1;
          }
          
          if(calculado){
            $(normal).toggleClass('none');
            $(card).toggleClass('none');
          }
        })
        break;
        
        default:
        throw new Error('Ação não implementada para o link informado.');
        break;
      }
    })
  }
  
  window.addEventListener("DOMContentLoaded", function () {
    // Carregar conteúdo na página
    const body = this.document.querySelector('body');
    body.innerHTML += conteudos.principal;
    body.innerHTML += conteudos.footer;
    
    // Atribuindo máscaras para os primeiros inputs carregados
    $(document).ready(function(){
      $(`#inicio-periodo-0`).mask('00/00/0000');
      $(`#fim-periodo-0`).mask('00/00/0000');
    });
    
    // Ocultar loading
    $(".overlay").animate({width:'toggle'}, 350);
    
    // Chamando funções
    atribuirLinks();
    atribuirAcoes();
    tooltips();
    verificarInputsRecarregamento();
    
    // Em modo desenvolvimento (0), os campos são preenchidos e o botão clicado
    if(mode == 0){
      setTimeout(() => {
        $('#inicio-periodo-0').val('01/01/2000');
        $('#fim-periodo-0').val('01/01/2002');
        $('[data-action="calcular"]').click();
      }, 500);
    }

    // Alterando icon de acordo com o tipo de visualização
    if(visualizacao == 0){
      $(`[data-action="alternar-visualizacao"] i`).attr("class", "bi bi-card-text")
    }else if(visualizacao == 1){
      $(`[data-action="alternar-visualizacao"] i`).attr("class", "bi bi-card-heading")
    }
  });
  
  // Definindo globalmente as funções
  window.removerPeriodo = removerPeriodo;
  window.escutaEventoInput = escutaEventoInput;
  
})();

export const tipoVisualizao = () => {
  return visualizacao == 0 ? 'normal' : 'card';
}

export const foiCalculado = (condicao) => {
  if(!isEmpty(condicao) && [true, false, "true", "false"].includes(condicao)){
    calculado = [true, false].includes(condicao) ? condicao : condicao == "true" ? condicao : condicao == "false" ? condicao : "";
  }
  return calculado;
}