import * as conteudos from './conteudos.js';
import { SwalAlert, isEmpty, atribuirLinks } from './utilitarios.js';

let calculado = false;
let visualizacao = 0;
const tipoVisualizao = () => (visualizacao === 0 ? 'normal' : 'card');

// Alterando icon de acordo com o tipo de visualização
if (visualizacao === 0) {
  $('[data-action="alternar-visualizacao"] i').attr('class', 'bi bi-card-text');
} else if (visualizacao === 1) {
  $('[data-action="alternar-visualizacao"] i').attr('class', 'bi bi-card-heading');
}

const tempo = {
  meses: 0,
  anos: 0,
  dias: 0,
  push(referencia, valor) {
    switch (referencia.toLowerCase().trim()) {
      case 'meses':
      this.meses += valor;
      break;
      
      case 'anos':
      this.anos += valor;
      break;
      
      case 'dias':
      this.dias += valor;
      break;
      
      default:
      break;
    }
  },
  clear() {
    this.meses = 0;
    this.anos = 0;
    this.dias = 0;
  },
};

const foiCalculado = (condicao) => {
  if (!isEmpty(condicao) && [true, false, 'true', 'false'].includes(condicao)) {
    if ([true, false].includes(condicao)) {
      calculado = condicao;
      if (condicao) return true;
      return false;
    }
    return null;
  }
  return calculado;
};

const verificarValorValido = (elemento) => {
  try {
    const value = elemento.value.replaceAll('/', '');
    const valid_size = value.length === 8;
    
    const valid_inicio = value.substr(4, 4) >= 1970;
    let valid_fim = false;
    try {
      valid_fim = moment(moment().format('YYYY-MM-DD')).diff([value.substr(4, 4), (value.substr(2, 2) - 1), (value.substr(0, 2))], 'days') >= 0;
    } catch (error) {
      valid_fim = false;
    }
    
    // Focando o próximo input se o input atual for o primeiro e estiver certinho
    if ([valid_size, valid_inicio, valid_fim].every((v) => v === true) && elemento.id.split('-')[0] === 'inicio') {
      $(`#fim-periodo-${elemento.id.split('-')[2]}`).focus();
    }
    
    return [valid_size, valid_inicio, valid_fim].every((v) => v === true);
  } catch (error) {
    return false;
  }
};

const formatarDataENG = (dataBRL) => {
  const data_numeros = dataBRL.replace(/\D/g, '');
  if (data_numeros.length === 8) {
    return `${data_numeros.substr(4, 4)}-${data_numeros.substr(2, 2)}-${data_numeros.substr(0, 2)}`;
  }
  return null;
};

const alterarBotao = (classe, HTML) => {
  const botao = document.querySelector('[data-action="calcular"]');
  
  botao.classList.value = classe;
  botao.innerHTML = HTML;
  
  setTimeout(() => {
    botao.classList.value = 'btn btn-primary';
    botao.innerHTML = 'Calcular';
  }, 1000);
};

const removerResultados = (tipo) => {
  $('[data-content="informacao-funcionamento"]').removeClass('none');
  if (tipo === 'card') {
    $('[data-content="demais-informacoes"]').addClass('none');
  } else if (tipo === 'normal') {
    $('[data-content="demais-informacoes"]').addClass('none');
    $('[data-content="card-resultado"]').addClass('none');
  } else {
    $('[data-content="demais-informacoes"]').addClass('none');
    $('[data-content="card-resultado"]').addClass('none');
  }
};

// Criar PDF com os resultados
const criarPDFResultados = (resultados, calculo) => { 
  if (isEmpty(resultados)) {
    SwalAlert('aviso', 'warning', 'Não existem resultados de cálculos para baixar');
  } else {
    // TODO - Add. try/catch para capturar exceptions
    // Criando documento
    let txt = `
    Calculadora de Tempo de Serviço
    Calculado em ${moment().format('DD/MM/YYYY HH:mm:ss')}
    
    Resultado
    - Total de meses: ${calculo.meses ?? '-'}
    - Total de anos: ${calculo.anos ?? '-'}
    
    Períodos
    `;
    
    resultados.toSorted((a, b) => b.meses - a.meses).forEach((resultado, index) => {
      txt += `
      Período ${index + 1}
      - Início: ${resultado.inicio}
      - Fim: ${resultado.fim}
      - Meses: ${resultado.meses}
      `;
    });
    
    // Criando e baixando PDF
    const doc = window.jspdf.jsPDF();
    doc.setFontSize(12);
    doc.text(txt, 10, 10);
    doc.save('Tempo de Serviço.pdf');
  }
};

const exibirResultados = (classe_info, meses_info, detalhado_info) => {
  const informacao_funcionamento = document.querySelector('[data-content="informacao-funcionamento"]');
  const meses_calculo = $('[data-content="meses-calculo"]');
  const calculo_detalhado = $('[data-content="dados-calculo-detalhado"]');
  
  removerResultados();
  
  // Exibindo no console resultados de cálculo
  console.groupCollapsed('#2 Exibição dos resultados que foram calculados');
  console.table({ classe_info, meses_info: meses_info.trim(), detalhado_info: detalhado_info.trim() });
  console.groupEnd();
  
  if (classe_info) {
    if (tipoVisualizao() === 'normal') {
      informacao_funcionamento.classList.add('none');
      $('[data-content="demais-informacoes"]').removeClass('none');
    } else {
      informacao_funcionamento.classList.add('none');
      $('[data-content="demais-informacoes"]').addClass('none');
      $('[data-content="card-resultado"]').removeClass('none');
    }
    
    foiCalculado(true);
    
    $(meses_calculo).html(meses_info);
    $('[data-content="card-resultado"] [data-content="meses-calculo"]').html(meses_info.replaceAll('meses', '').replaceAll('mês', ''));
    $(calculo_detalhado).html(isEmpty(detalhado_info.trim()) ? meses_info : detalhado_info);
  } else {
    removerResultados();
  }
};

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
  
  if (tempo_meses >= 36) {
    sucesso.innerHTML += conteudos.critica.html.podeUsarFGTS;
    sucesso.innerHTML += conteudos.critica.html.podeTerDescontoMCMV;
  } else {
    erro.innerHTML += conteudos.critica.html.naoPodeUsarFGTS;
    erro.innerHTML += conteudos.critica.html.naoPodeTerDescontoMCMV;
  }
  
  if (tempo_meses >= 24) {
    sucesso.innerHTML += conteudos.critica.html.podeAmortizarComFGTS;
  } else {
    erro.innerHTML += conteudos.critica.html.naoPodeAmortizarComFGTS;
  }
  
  atribuirLinks();
  
  if (tempo_meses <= 0) {
    sucesso.classList.add('none');
    erro.classList.add('none');
    saiba_mais.classList.add('none');
    referencia.classList.add('none');
  }
};

const calcularPeriodos = async (periodos) => {
  tempo.clear();
  const exibir = new Array();
  const recebidos = new Array();
  
  async function prepararParaMostrarResultados(confirmed) {
    // Exibir resultados:
    let resultados = null;
    const mod = ((tempo.meses) % 12);
    
    // Ajustando valores de anos e meses para exibição
    if (tempo.anos === 0 && tempo.meses % 12 > 0) {
      // Em períodos inferiores a 1 ano, o valor de anos é somado incorretamente, por isso a correção
      tempo.anos = tempo.meses % 12; 
    } else if (tempo.meses >= 12) {
      // Quando o período de meses for divisível por 12 e não tiver resto
      tempo.anos = Math.floor(tempo.meses / 12);
    }
    
    const anos_ou_ano = tempo.anos > 1 ? 'anos' : 'ano';
    const meses_ou_mes = mod > 1 ? 'meses' : 'mês';
    
    // Exibindo no console os valores das variáveis para formação do resultado
    console.groupCollapsed('#1 Exibição dos valores para resultado');
    console.table({ mod, anos_ou_ano, meses_ou_mes });
    console.groupEnd();
    
    if (exibir.every((e) => e === true)) {
      if (tempo.meses > 0) {
        alterarBotao('btn btn-success', 'Calculado!');
        let detalhado_info = 'xxx';
        
        if (tempo.anos > 0 && tempo.meses % 12 > 0) {
          detalhado_info = `${Math.floor(tempo.meses / 12)} ${anos_ou_ano} e ${tempo.meses % 12} ${meses_ou_mes}`;
        } else if (tempo.anos > 0) {
          detalhado_info = `${Math.floor(tempo.meses / 12)} ${anos_ou_ano}`;
        } else {
          detalhado_info = `${tempo.meses} ${meses_ou_mes}`;
        }
        
        exibirResultados(true, `${tempo.meses} ${tempo.meses > 1 ? 'meses' : 'mês'}`, detalhado_info);
        resultados = JSON.parse(JSON.stringify(periodos));
      } else if (!isEmpty(confirmed)) {
        alterarBotao('btn btn-success', 'Calculado!');
        exibirResultados(true, '<b>Período insuficiente</b>', 'A soma dos perídos informados é menor que 1 mês');
        resultados = JSON.parse(JSON.stringify(periodos));
      } else {
        exibirResultados(false, '', '');
      }
    } else {
      exibirResultados(false, '', '');
    }
    
    exibirCritica(tempo.meses);
    return resultados;
  }
  
  function filtro(anos, meses, dias, inicio, fim, resolve) {
    function adicionar() {
      tempo.push('anos', anos);
      tempo.push('meses', meses);
      tempo.push('dias', dias);
    }
    
    recebidos.push({ anos, meses, dias });
    if (meses < 0) {
      SwalAlert('aviso', 'error', 'Período inválido!', `A data de encerramento ${fim.format('DD/MM/YYYY')} é anterior a data de ínicio ${inicio.format('DD/MM/YYYY')}. Por favor, corrija e tente novamente.`);
      alterarBotao('btn btn-danger', 'Erro');
      exibir.push(false);
    } else if (dias === 0) {
      SwalAlert('aviso', 'error', 'Período inválido!', `A data de encerramento ${fim.format('DD/MM/YYYY')} é igual a data de ínicio ${inicio.format('DD/MM/YYYY')}. Por favor, corrija e tente novamente.`);
      alterarBotao('btn btn-danger', 'Erro');
      exibir.push(false);
    } else if (meses < 1) {
      // BUG
      SwalAlert('confirmacao', 'warning', 'Período inferior a 30 dias', 'Existe(em) período(s) em que o tempo de serviço é inferior a 30 dias. Tem certeza que deseja considerar este(s) período(s)?').then((retorno) => {
        if (retorno.isConfirmed) {
          adicionar();
          // Refatorar
          let soma = 0;
          const periodos_menores = recebidos.filter((e) => e.meses < 1);
          periodos_menores.forEach((periodo) => {
            soma += periodo.dias;
          });
          
          if (soma >= 30) tempo.push('meses', Math.floor(soma / 30));
          prepararParaMostrarResultados({ isConfirmed: true });
        }
      });
    } else {
      adicionar();
      exibir.push(true);
    }
    
    resolve();
  }
  
  const percorrer = periodos.reduce((promise, periodo) => {
    const inicio = moment(formatarDataENG(periodo.inicio));
    const fim = moment(formatarDataENG(periodo.fim));
    
    const anos = fim.diff(inicio, 'years');
    const meses = fim.diff(inicio, 'months');
    // Caso o período inicie e termine no mesmo mês, desconsiderar 1 dia, para que o cálculo não add. tempo de serviço a mais
    const dias = fim.diff(inicio, 'days') === 30 && inicio.get('month') === fim.get('month') ? 29 : fim.diff(inicio, 'days');
    
    return promise.then(() => new Promise((resolve) => {
      filtro(anos, meses, dias, inicio, fim, resolve);
    }));
  }, Promise.resolve());
  
  return percorrer.then(async () => {
    const retorno = await prepararParaMostrarResultados();
    return retorno;
  }).catch((error) => {
    console.log(error);
    console.log(`Um erro ocorreu. Erro: ${error}`);
    return null;
  });
};

const removerPeriodo = (target) => {
  const elemento = target.closest('[data-element="periodo"]');
  elemento.remove();
  $(target).tooltip('dispose');
};

const adicionarPeriodos = async (periodos) => {
  const ok = new Array();
  document.querySelectorAll('[data-element="periodo"]').forEach((periodo_element) => {
    const inicio = periodo_element.querySelector('[data-element="inicio"]');
    const fim = periodo_element.querySelector('[data-element="fim"]');
    
    if (verificarValorValido(inicio)) {
      if (inicio.closest('.col.input-group').classList.contains('invalid')) elemento.closest('.col.input-group').classList.remove('invalid');
      if (verificarValorValido(fim)) {
        const i = moment(formatarDataENG(inicio.value));
        const f = moment(formatarDataENG(fim.value));
        
        let periodoJaExiste = false;
        periodos.forEach((periodo) => {
          if (periodo.inicio === inicio.value && periodo.fim === fim.value) {
            periodoJaExiste = true;
          }
        });
        
        if (periodoJaExiste) {
          SwalAlert('aviso', 'error', 'Existem períodos com a mesma data de início e a mesma data de saída!');
          ok.push('false');
        } else {
          try {
            if (fim.closest('.col.input-group').classList.contains('invalid')) elemento.closest('.col.input-group').classList.remove('invalid');
            periodos.push({ inicio: inicio.value, fim: fim.value, meses: moment([f.get('year'), f.get('month'), f.get('date')]).diff([i.get('year'), i.get('month'), i.get('date')], 'months') });
            ok.push('true');
          } catch (error) {
            //
          }
        }
      } else {
        fim.closest('.col.input-group').classList.add('invalid');
        ok.push('false');
      }
    } else {
      ok.push('false');
      inicio.closest('.col.input-group').classList.add('invalid');
    }
  });
  
  if (ok.every((e) => e === 'true')) {
    return calcularPeriodos(periodos).then((retorno) => retorno);
  }
  removerResultados();
  return [];
};

const escutaEventoInput = (elemento) => {
  // Verificação de validade da data informada
  const valid = verificarValorValido(elemento);
  
  if (!valid) {
    elemento.closest('.col.input-group').classList.add('invalid');
  } else if (elemento.closest('.col.input-group').classList.contains('invalid')) {
    elemento.closest('.col.input-group').classList.remove('invalid');
  }
};

const baixarResultados = (resultados, calculo) => {
  function formatar(data) {
    return `${data}`;
  }
  
  if (isEmpty(resultados)) {
    SwalAlert('aviso', 'warning', 'Não existem resultados de cálculos para baixar');
  } else if (tipoVisualizao() === 'normal') {
    try {
      const mode = 0;
      if (mode) {
        // Resultado em TXT
        const saida = new Array();
        resultados.forEach((resultado, index) => {
          saida.push(`PERÍODO ${index + 1}\nINÍCIO: ${formatar(resultado.inicio)}\nFIM: ${formatar(resultado.fim)}\nMESES: ${resultado.meses}`);
        });
        const blob = new Blob([saida.join('\n\n')], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'Tempo de Serviço.txt');
      } else {
        // Resultado em PDF
        criarPDFResultados(resultados, calculo);
      }
    } catch (erro) {
      console.log(erro);
    }
  } else {
    const card = document.querySelector('[data-content="card-resultado"]');
    $(card).css({ 'border-radius': 0, height: '600px' });
    $(card.querySelector('.barra')).css({ display: 'flex' });
    html2canvas(card).then((canvas) => {
      const img = canvas;
      const download_capture = document.querySelector('body').appendChild(document.createElement('a'));
      download_capture.setAttribute('download', 'Tempo de Serviço.png');
      download_capture.href = img.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      download_capture.click();
    });
    $(card).css({ 'border-radius': '10px', height: 'auto' });
    $(card.querySelector('.barra')).css({ display: 'none' });
  }
};

const alternarVisualizacaoTrocaCard = () => {
  const btn = document.querySelector('[data-action="alternar-visualizacao"]');
  const normal = $('[data-content="demais-informacoes"]');
  const card = $('[data-content="card-resultado"]');
  
  if (btn.querySelector('i').classList.value === 'bi bi-card-heading') {
    btn.innerHTML = '<i class="bi bi-card-text"></i>';
    visualizacao = 0;
  } else {
    btn.innerHTML = '<i class="bi bi-card-heading"></i>';
    visualizacao = 1;
  }
  
  if (calculado) {
    $(normal).toggleClass('none');
    $(card).toggleClass('none');
  }
};

const acionarFuncaoBaixarResultados = (resultados) => {
  baixarResultados(resultados, { meses: tempo.meses, anos: tempo.anos });
};

export {
  removerPeriodo,
  alterarBotao,
  adicionarPeriodos,
  calcularPeriodos,
  exibirCritica,
  exibirResultados,
  removerResultados,
  escutaEventoInput,
  verificarValorValido,
  formatarDataENG,
  alternarVisualizacaoTrocaCard,
  acionarFuncaoBaixarResultados,
};
