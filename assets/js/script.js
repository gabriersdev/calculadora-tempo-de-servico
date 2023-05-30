"use strict";

import { conteudos } from './modulos/conteudos.js';
import { isEmpty } from './modulos/utilitarios.js';

(() => {
  // hljs.highlightAll();
  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
  function atribuirLinks(){
    const linkElementos = document.querySelectorAll('[data-link]');
    
    linkElementos.forEach(link => {
      switch(link.dataset.link.toLowerCase().trim()){        
        case 'github-dev':
        link.href = 'https://github.com/gabrieszin';
        break;
        
        case 'github-projeto':
        link.href = 'https://github.com/gabrieszin/[nome-repositorio]';
        break;
        
        default:
        // throw new Error('Ação não implementada para o link informado.');
        break;
      }
      
      link.setAttribute('rel', 'noopener noreferrer');
    })
  }
  
  function atribuirAcoes(){
    const acoes = document.querySelectorAll('[data-action]');
    acoes.forEach(acao => {
      switch(acao.dataset.action.toLowerCase().trim()){
        case 'adicionar-periodo':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          document.querySelector('[data-element="periodos"]').innerHTML += conteudos.periodo(document.querySelectorAll('[data-element="periodo"]').length);
        })
        break;
        
        default:
        throw new Error('Ação não implementada para o link informado.');
        break;
      }
    })
  }
  
  window.addEventListener("load", function () {
    const overlay2 = document.querySelector(".overlay-2");
    overlay2.style.display = "none";
    atribuirLinks();
    atribuirAcoes();
  });
})();

const periodos = new Array();

const tempo = {
  meses: 0, anos: 0, dias: 0, 
  push(referencia, valor){
    switch(referencia.toLowerCase().trim()){
      case 'meses':
      this.meses += valor;
      break;
      
      case 'anos':
      this.anos += valor;
      break;
      
      case 'dias':
      this.dias += valor;
      break;
    }
  }
};

const calcularPeriodos = () => {
  periodos.forEach(periodo => {
    const inicio = moment(periodo.inicio);
    const fim = moment(periodo.fim)
    
    const anos = fim.diff(inicio, 'years');
    const meses = fim.diff(inicio, 'months');
    const dias = fim.diff(inicio, 'days');
    
    tempo.push('anos', anos);
    tempo.push('meses', meses);
    tempo.push('dias', dias);
    
    // console.log(meses, anos, dias)
  })
}

const escutaEventoInput = (elemento) => {
  // Verificação de validade da data informada
  const valid_size = elemento.value.replaceAll('-', '').length == 8;
  const valid_inicio = elemento.value.split('-')[0] >= 1970;
  const valid_fim = moment(moment().format('YYYY-MM-DD')).diff([elemento.value.split('-')[0].substr(0, 4), (elemento.value.split('-')[1] - 1), elemento.value.split('-')[2]], 'days') >= 0;
  const valid_regex = elemento.value.match(/^\d{4}-\d{2}-\d{2}$/);
  
  const valid = [valid_size, valid_inicio, valid_fim].every(v => v == true) && !isEmpty(valid_regex);
  
  if(!valid){
    elemento.closest('.col.input-group').classList.add('invalid')
  }else{
    elemento.closest('.col.input-group').classList.contains('invalid') ? elemento.closest('.col.input-group').classList.remove('invalid') : '';
  }
}
window.escutaEventoInput = escutaEventoInput;