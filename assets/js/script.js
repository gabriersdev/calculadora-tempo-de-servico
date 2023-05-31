"use strict";

import { conteudos } from './modulos/conteudos.js';
import { SwalAlert, isEmpty, tooltips } from './modulos/utilitarios.js';

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
          document.querySelector('[data-element="periodos"]').appendChild(conteudos.periodo(document.querySelectorAll('[data-element="periodo"]').length));
          tooltips();
        })
        break;

        case 'calcular':
          acao.addEventListener('click', (evento) => {
            evento.preventDefault();
            adicionarPeriodos();
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
    tooltips();
  });
})();

function removerPeriodo(target){
  const elemento = target.closest('[data-element="periodo"]');
  elemento.remove();
  $(target).tooltip('dispose');
}
window.removerPeriodo = removerPeriodo;

let periodos = new Array();

const tempo = {
  meses: 0, anos: 0, dias: 0, 
  push(referencia, valor){
    switch(referencia.toLowerCase().trim()){
      case 'meses':
      console.log(this.meses, valor)
      this.meses += valor;
      break;
      
      case 'anos':
      this.anos += valor;
      break;
      
      case 'dias':
      this.dias += valor;
      break;
    }
  },
  clear(){
    this.meses = 0;
    this.anos = 0;
    this.dias = 0;
  }
};

const calcularPeriodos = () => {
  tempo.clear();

  periodos.forEach(periodo => {
    const inicio = moment(periodo.inicio);
    const fim = moment(periodo.fim);

    const anos = fim.diff(inicio, 'years');
    const meses = fim.diff(inicio, 'months');
    const dias = fim.diff(inicio, 'days');
    
    if(meses < 0){
      SwalAlert('aviso', 'error', 'Período inválido!', `A data de encerramento ${fim.format('DD/MM/YYYY')} é anterior a data de ínicio ${inicio.format('DD/MM/YYYY')}. Gentileza corrigir.`);
    }else{
      if(meses = 0){
        //Tratamento
      }else{

      }
      tempo.push('anos', anos);
      tempo.push('meses', meses);
      tempo.push('dias', dias);
    }
  })

  // Exibir resultados:
  document.querySelector('[data-content="meses-calculo"]').textContent = `${tempo.meses} meses`;
  document.querySelector('[data-content="dados-calculo-detalhado"]').textContent = `${tempo.anos} anos (${tempo.meses} meses)`
}

const escutaEventoInput = (elemento) => {
  // Verificação de validade da data informada
  const valid = verificarValorValido(elemento);
  
  if(!valid){
    elemento.closest('.col.input-group').classList.add('invalid');
  }else{
    elemento.closest('.col.input-group').classList.contains('invalid') ? elemento.closest('.col.input-group').classList.remove('invalid') : '';
  }
}

const verificarValorValido = (elemento) => {
  const valid_size = elemento.value.replaceAll('-', '').length == 8;
  const valid_inicio = elemento.value.split('-')[0] >= 1970;
  const valid_fim = moment(moment().format('YYYY-MM-DD')).diff([elemento.value.split('-')[0].substr(0, 4), (elemento.value.split('-')[1] - 1), elemento.value.split('-')[2]], 'days') >= 0;
  const valid_regex = elemento.value.match(/^\d{4}-\d{2}-\d{2}$/);
  
  // console.log([valid_size, valid_inicio, valid_fim].every(v => v == true) && !isEmpty(valid_regex));
  return [valid_size, valid_inicio, valid_fim].every(v => v == true) && !isEmpty(valid_regex);
}

const adicionarPeriodos = () => {
  periodos = new Array();
  const ok = new Array();
  document.querySelectorAll('[data-element="periodo"]').forEach(periodo => {
    const inicio = periodo.querySelector('[data-element="inicio"]');
    const fim = periodo.querySelector('[data-element="fim"]');
    
    if(verificarValorValido(inicio)){
      inicio.closest('.col.input-group').classList.contains('invalid') ? elemento.closest('.col.input-group').classList.remove('invalid') : '';
      if(verificarValorValido(fim)){
        fim.closest('.col.input-group').classList.contains('invalid') ? elemento.closest('.col.input-group').classList.remove('invalid') : '';
        periodos.push({inicio: inicio.value, fim: fim.value});
        ok.push('true');
      }else{
        fim.closest('.col.input-group').classList.add('invalid');
        ok.push('false');
      }
    }else{
      ok.push('false');
      inicio.closest('.col.input-group').classList.add('invalid');
    }
  })

  ok.every(e => e == 'true') ? calcularPeriodos() : '';
}

window.escutaEventoInput = escutaEventoInput;