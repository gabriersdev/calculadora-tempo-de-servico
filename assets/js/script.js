"use strict";

import { conteudos } from './modulos/conteudos.js';
import { SwalAlert, isEmpty, tooltips, verificarInputsRecarregamento, atribuirLinks } from './modulos/utilitarios.js';

(() => { 
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
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

        case 'baixar-resultados':
          acao.addEventListener('click', (evento) => {
            evento.preventDefault();
            SwalAlert('aviso', 'error', 'Desculpe, esta função ainda não foi implementada.');
            // data-action="baixar-resultados"
          })
        break;
        
        case 'calcular':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          adicionarPeriodos();
          alterarBotao('btn btn-primary', 'Calculando...')
        })
        break;
        
        default:
        throw new Error('Ação não implementada para o link informado.');
        break;
      }
    })
  }

  function removerPeriodo(target){
    const elemento = target.closest('[data-element="periodo"]');
    elemento.remove();
    $(target).tooltip('dispose');
  }
  window.removerPeriodo = removerPeriodo;
  
  const alterarBotao = (classe, HTML) => {
    const botao = document.querySelector('[data-action="calcular"]');

    botao.classList.value = classe;
    botao.innerHTML = HTML;

    setTimeout(() => {
      botao.classList.value = 'btn btn-primary';
      botao.innerHTML = 'Calcular';
    }, 1000);
  }

  let periodos = new Array();
  
  const tempo = {
    meses: 0, anos: 0, dias: 0, 
    push(referencia, valor){
      switch(referencia.toLowerCase().trim()){
        case 'meses':
        // console.log(this.meses, valor)
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
    const exibir = new Array();
    const recebidos = new Array();
    
    function filtro(anos, meses, dias, inicio, fim, resolve){
      recebidos.push({anos: anos, meses: meses, dias: dias});
      if(meses < 0){
        SwalAlert('aviso', 'error', 'Período inválido!', `A data de encerramento ${fim.format('DD/MM/YYYY')} é anterior a data de ínicio ${inicio.format('DD/MM/YYYY')}. Por favor, corrija e tente novamente.`);
        alterarBotao('btn btn-danger', 'Erro');
        exibir.push(false);
      }else{
        if(dias == 0){
          SwalAlert('aviso', 'error', 'Período inválido!', `A data de encerramento ${fim.format('DD/MM/YYYY')} é igual a data de ínicio ${inicio.format('DD/MM/YYYY')}. Por favor, corrija e tente novamente.`);
          alterarBotao('btn btn-danger', 'Erro');
          exibir.push(false);
        }else if(meses < 1){
          // BUG
          SwalAlert('confirmacao', 'warning', 'Período inferior a 30 dias', `Existe(em) período(s) em que o tempo de serviço é inferior a 30 dias. Tem certeza que deseja considerar este(s) período(s)?`).then(retorno => {
            if(retorno.isConfirmed){
              adicionar();
              // Refatorar
              let soma = 0;
              const periodos_menores = recebidos.filter(e => e.meses < 1);
              periodos_menores.forEach(periodo => {
                soma += periodo.dias;
              })
  
              soma >= 30? tempo.push('meses', Math.floor(soma / 30)) : '';
              mostrarResultados({isConfirmed: true});
            }
          })
        }else{
          adicionar();
          exibir.push(true);
        }
        
        function adicionar(){
          tempo.push('anos', anos);
          tempo.push('meses', meses);
          tempo.push('dias', dias);
        }
      }
  
      resolve();
    }
  
    let percorrer = periodos.reduce((promise, periodo) => {
      const inicio = moment(periodo.inicio);
      const fim = moment(periodo.fim);
      
      const anos = fim.diff(inicio, 'years');
      const meses = fim.diff(inicio, 'months');
      const dias = fim.diff(inicio, 'days');
      
      return promise.then(() => new Promise((resolve) => {
        filtro(anos, meses, dias, inicio, fim, resolve);
      }))
    }, Promise.resolve())
    
    percorrer.then(() => mostrarResultados());
  
    function mostrarResultados(confirmed){
      // Exibir resultados:
      const mod = tempo.meses % (tempo.anos * 12);
      const anos_ou_ano = tempo.anos > 1 ? 'anos' : 'ano';
      const meses_ou_mes = mod > 1 ? 'meses' : 'mês';
      // console.log(tempo.dias);
  
      if(exibir.every(e => e == true)){
        if(tempo.meses > 0){
          alterarBotao('btn btn-success', 'Calculado!');
          exibirResultados(true, `<b>${tempo.meses} ${tempo.meses > 1 ? 'meses' : 'mês'}</b>`, `${tempo.anos > 0 ? tempo.anos + ' ' + anos_ou_ano : ''} ${mod !== 0 && !isNaN(mod) ? 'e ' + mod + ' ' + meses_ou_mes : ''}`);
        }else if(!isEmpty(confirmed)){
          alterarBotao('btn btn-success', 'Calculado!');
          exibirResultados(true, `<b>Período insuficiente</b>`, `A soma dos perídos informados é menor que 1 mês`);
        }
      }else{
        exibirResultados(false, '', '');
      }

      exibirCritica(tempo.meses);
    }
    
  }

  const exibirCritica = (tempo_meses) => {
    const sucesso = document.querySelector('[data-element="critica-tempo-de-servico-sucesso"]');
    const erro = document.querySelector('[data-element="critica-tempo-de-servico-erro"]');
    const saiba_mais = document.querySelector('[data-element="saiba-mais"]');
    const referencia = document.querySelector('[data-element="referencia"]');

    sucesso.classList.remove('none');
    erro.classList.remove('none');
    sucesso.classList.add('text-success');
    erro.classList.add('text-error');
    saiba_mais.classList.remove('none');
    referencia.classList.remove('none');

    sucesso.innerHTML = '';
    erro.innerHTML = '';

    if(tempo_meses >= 36){
      sucesso.innerHTML += conteudos.critica.html.podeUsarFGTS;
      sucesso.innerHTML += conteudos.critica.html.podeTerDescontoMCMV;
    }else{
      erro.innerHTML += conteudos.critica.html.naoPodeUsarFGTS;
      erro.innerHTML += conteudos.critica.html.naoPodeTerDescontoMCMV;
    }

    if(tempo_meses >= 24){
      sucesso.innerHTML += conteudos.critica.html.podeAmortizarComFGTS;
    }else{
      erro.innerHTML += conteudos.critica.html.naoPodeAmortizarComFGTS;
    }

    atribuirLinks();

    if(tempo_meses <= 0){
      sucesso.classList.add('none');
      erro.classList.add('none');
      saiba_mais.classList.add('none');
      referencia.classList.add('none');
    }
  }

  const exibirResultados = (classe_info, meses_info, detalhado_info) => {
    const informacao_funcionamento = document.querySelector('[data-content="informacao-funcionamento"]');
    const meses_calculo = document.querySelector('[data-content="meses-calculo"]');
    const calculo_detalhado = document.querySelector('[data-content="dados-calculo-detalhado"]');
    
    if(classe_info){
      informacao_funcionamento.classList.add('none');
    }else{
      informacao_funcionamento.classList.remove('none');
    }

    meses_calculo.innerHTML = meses_info;
    calculo_detalhado.textContent = detalhado_info;
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
  
  const adicionarPeriodos = async () => {
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

  window.addEventListener("load", function () {
    const body = this.document.querySelector('body');
    body.innerHTML += conteudos.principal;
    body.innerHTML += conteudos.footer;
    const overlay2 = document.querySelector(".overlay-2");
    overlay2.style.display = "none";
    atribuirLinks();
    atribuirAcoes();
    tooltips();
    verificarInputsRecarregamento();
  });
})();