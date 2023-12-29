"use strict";

import { conteudos } from './modulos/conteudos.js';
import { SwalAlert, isEmpty, tooltips, verificarInputsRecarregamento, atribuirLinks } from './modulos/utilitarios.js';

(() => { 
  let resultados = new Array();
  let visualizacao = 1;
  let calculado = false;
  const mode = 1;
  
  if(mode == 0){
    setTimeout(() => {
      $('#inicio-periodo-0').val('01/01/2000')
      $('#fim-periodo-0').val('01/01/2002')
      $('[data-action="calcular"]').click()
    }, 500)
  }
  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
  const tipoVisualizao = () => {
    return visualizacao == 0 ? 'normal' : 'card';
  }
  
  function atribuirAcoes(){
    const acoes = document.querySelectorAll('[data-action]');
    acoes.forEach(acao => {
      switch(acao.dataset.action.toLowerCase().trim()){
        case 'adicionar-periodo':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          const length = document.querySelectorAll('[data-element="periodo"]').length;
          document.querySelector('[data-element="periodos"]').appendChild(conteudos.periodo(length));
          $(`#inicio-periodo-${length}`).mask('00/00/0000')
          $(`#fim-periodo-${length}`).mask('00/00/0000')
          
          setTimeout(() => {
            $(`#inicio-periodo-${length}`).focus()
          }, 500)
          
          tooltips();
        })
        break;
        
        case 'baixar-resultados':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          // SwalAlert('aviso', 'error', 'Desculpe, esta função ainda não foi implementada.');
          baixarResultados();
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
        
        case 'alternar-visualizacao':
        acao.addEventListener('click', (evento) => {
          evento.preventDefault();
          const btn = document.querySelector('[data-action="alternar-visualizacao"]')
          const normal = $('[data-content="demais-informacoes"]')
          const card = $('[data-content="card-resultado"]')
          
          // console.log(btn.querySelector('i'))

          if(btn.querySelector('i').classList.value == 'bi bi-card-heading'){
            btn.innerHTML = '<i class="bi bi-card-text"></i>';
            visualizacao = 0;
            // console.log('aqui');
          }else{
            btn.innerHTML = '<i class="bi bi-card-heading"></i>';
            visualizacao = 1;
            // console.log('aqui');
          }
          
          if(calculado){
            $(normal).toggleClass('none')
            $(card).toggleClass('none')
          }

          // console.log(visualizacao)
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
    // resultados = new Array();
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
          // console.log(periodos)
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
      const inicio = moment(formatarDataENG(periodo.inicio));
      const fim = moment(formatarDataENG(periodo.fim));
      
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
      const mod = ((tempo.meses ) % 12);
      const anos_ou_ano = tempo.anos > 1 ? 'anos' : 'ano';
      const meses_ou_mes = mod > 1 ? 'meses' : 'mês';
      // console.log(tempo.dias);
      // console.log(mod)

      if(exibir.every(e => e == true)){
        if(tempo.meses > 0){
          alterarBotao('btn btn-success', 'Calculado!');
          exibirResultados(true, `${tempo.meses} ${tempo.meses > 1 ? 'meses' : 'mês'}`, `${tempo.anos > 0 ? Math.floor(tempo.meses / 12) + ' ' + anos_ou_ano : ''} ${Math.floor(tempo.meses / 12) !== 0 && mod > 0 && !isNaN(mod) ? 'e ' + mod + ' ' + meses_ou_mes : ''}`);
          // console.log(resultados);
          resultados = JSON.parse(JSON.stringify(periodos));
        }else if(!isEmpty(confirmed)){
          alterarBotao('btn btn-success', 'Calculado!');
          exibirResultados(true, `<b>Período insuficiente</b>`, `A soma dos perídos informados é menor que 1 mês`);
          resultados = JSON.parse(JSON.stringify(periodos));
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
    const meses_calculo = $('[data-content="meses-calculo"]');
    const calculo_detalhado = $('[data-content="dados-calculo-detalhado"]');

    removerResultados();
    
    if(classe_info){
      if(tipoVisualizao() == 'normal'){
        informacao_funcionamento.classList.add('none');
        $('[data-content="demais-informacoes"]').removeClass('none')
      }else{
        informacao_funcionamento.classList.add('none');
        $('[data-content="demais-informacoes"]').addClass('none')
        $('[data-content="card-resultado"]').removeClass('none')
      }
      
      calculado = true;
      
      $(meses_calculo).html(meses_info);
      $('[data-content="card-resultado"] [data-content="meses-calculo"]').html(meses_info.replaceAll('meses', '').replaceAll('mês', ''));
      $(calculo_detalhado).html(isEmpty(detalhado_info.trim()) ? meses_info : detalhado_info);
    }else{
      removerResultados();
    }
  }
  
  const removerResultados = (visualizacao) => {
    $('[data-content="informacao-funcionamento"]').removeClass('none')
    if(visualizacao == 'card'){
      $('[data-content="demais-informacoes"]').addClass('none')
    }else if(visualizacao == 'normal'){
      $('[data-content="card-resultado"]').addClass('none')
    }else{
      $('[data-content="demais-informacoes"]').addClass('none')
      $('[data-content="card-resultado"]').addClass('none')
    }
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
    try{
      const value = elemento.value.replaceAll('/', '');
      const valid_size = value.length == 8;
      
      const valid_inicio = value.substr(4, 4) >= 1970;
      let valid_fim = false;
      try{
        valid_fim = moment(moment().format('YYYY-MM-DD')).diff([value.substr(4, 4), (value.substr(2, 2) - 1), (value.substr(0, 2))], 'days') >= 0;
      }catch(error){
        valid_fim = false;
      }
      
      // Focando o próximo input se o input atual for o primeiro e estiver certinho
      if([valid_size, valid_inicio, valid_fim].every(v => v == true) && elemento.id.split('-')[0] === 'inicio'){
        $(`#fim-periodo-${elemento.id.split('-')[2]}`).focus();
      }

      return [valid_size, valid_inicio, valid_fim].every(v => v == true);
    }catch(error){
      return false;
    }
  }
  
  const formatarDataENG = (dataBRL) => {
    const data_numeros = dataBRL.replace(/\D/g, '');
    if(data_numeros.length == 8){
      return `${data_numeros.substr(4, 4)}-${data_numeros.substr(2, 2)}-${data_numeros.substr(0, 2)}`
    }else{
      return null;
    }
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
          const i = moment(formatarDataENG(inicio.value));
          const f = moment(formatarDataENG(fim.value));
          
          let periodoJaExiste = false
          periodos.forEach(periodo => { 
            if(periodo.inicio == inicio.value && periodo.fim == fim.value){
              periodoJaExiste = true
            }
          });
          
          if(periodoJaExiste){
            SwalAlert('aviso', 'error', 'Existem períodos com a mesma data de início e a mesma data de saída!');
            ok.push('false');
          }else{
            try{
              fim.closest('.col.input-group').classList.contains('invalid') ? elemento.closest('.col.input-group').classList.remove('invalid') : '';
              periodos.push({inicio: inicio.value, fim: fim.value, meses: moment([f.get('year'), f.get('month'), f.get('date')]).diff([i.get('year'), i.get('month'), i.get('date')], 'months')});
              ok.push('true');
            }catch(error){
              
            }
          }
          
        }else{
          fim.closest('.col.input-group').classList.add('invalid');
          ok.push('false');
        }
      }else{
        ok.push('false');
        inicio.closest('.col.input-group').classList.add('invalid');
      }
    })
    
    ok.every(e => e == 'true') ? calcularPeriodos() : removerResultados();
  }
  
  window.addEventListener("load", function () {
    const body = this.document.querySelector('body');
    body.innerHTML += conteudos.principal;
    
    $(document).ready(function(){
      $(`#inicio-periodo-0`).mask('00/00/0000');
      $(`#fim-periodo-0`).mask('00/00/0000');
    });
    
    body.innerHTML += conteudos.footer;
    const overlay2 = document.querySelector(".overlay-2");
    overlay2.style.display = "none";
    atribuirLinks();
    atribuirAcoes();
    tooltips();
    verificarInputsRecarregamento();
  });
  
  function baixarResultados(){
    if(isEmpty(resultados)){
      SwalAlert('aviso', 'warning', 'Não existem resultados de cálculos para baixar');
    }else{
      if(tipoVisualizao() == 'normal'){
        try{
          const saida = new Array();
          resultados.forEach((resultado, index) => {
            saida.push(`PERÍODO ${index + 1}\nINÍCIO: ${formatar(resultado.inicio)}\nFIM: ${formatar(resultado.fim)}\nMESES: ${resultado.meses}`);
          })
          let blob = new Blob([saida.join('\n\n')], {type: "text/plain;charset=utf-8"});
          saveAs(blob, `Tempo de Serviço.txt`);
        }catch(erro){
          console.log(erro);
        }
      }else{
        const card = document.querySelector('[data-content="card-resultado"]')
        $(card).css({'border-radius': 0, 'height': '600px'})
        $(card.querySelector('.barra')).css({'display': 'flex'})
        html2canvas(card).then(canvas => {
          const img = canvas;
          const download_capture = document.querySelector('body').appendChild(document.createElement('a'))
          download_capture.setAttribute('download', 'Tempo de Serviço.png')
          download_capture.href = img.toDataURL('image/png').replace("image/png", "image/octet-stream");
          download_capture.click();
        });
        $(card).css({'border-radius': '10px', 'height': 'auto'})
        $(card.querySelector('.barra')).css({'display': 'none'})
      }
    }
    
    function formatar(data){
      return `${data}`;
    }
  }

  window.removerPeriodo = removerPeriodo;
  window.escutaEventoInput = escutaEventoInput;

})();