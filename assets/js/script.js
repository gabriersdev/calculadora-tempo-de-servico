import * as conteudos from './modulos/conteudos.js';
import {
  tooltips, verificarInputsRecarregamento, atribuirLinks,
} from './modulos/utilitarios.js';
import {
  removerPeriodo,
  alterarBotao,
  adicionarPeriodos,
  escutaEventoInput,
  baixarResultados,
  alternarVisualizacaoTrocaCard,
} from './modulos/funcoes.js';

(() => {
  // Apresentação do Projeto no console
  const dados_do_projeto = {
    'Project name': 'Calculadora de Tempo de Serviço',
    'Developed by': 'Gabriel Ribeiro',
    Version: '2.5.0',
    'Release date': '2023-12-31',
    Hostname: new URL(window.location).hostname,
    Origin: new URL(window.location).origin,
    Status: 'Active',
  };

  const novas_funcionalidades = [
    'Alterando contabilização de períodos com data de ínicio e fim no mesmo mês.',
    'Corrigindo bug de download dos arquivos de tempo de serviço contabilizados.',
  ];

  Object.freeze(novas_funcionalidades);
  Object.freeze(dados_do_projeto);

  // Exibindo dados
  console.groupCollapsed(`${dados_do_projeto['Project name']}, Version ${dados_do_projeto.Version}`);
  console.table(dados_do_projeto);
  console.groupEnd();

  console.groupCollapsed('New features');
  novas_funcionalidades.toSorted((a, b) => a.localeCompare(b)).forEach((feature) => { console.info(`${feature}`); });
  console.groupEnd();
  // Fim da apresentação do projeto

  let resultados = new Array();
  let periodos = new Array();
  const mode = 0;

  document.querySelectorAll('[data-recarrega-pagina]').forEach((botao) => {
    botao.addEventListener('click', () => {
      window.location.reload();
    });
  });

  const atribuirAcoes = () => {
    const acoes = document.querySelectorAll('[data-action]');
    acoes.forEach((acao) => {
      switch (acao.dataset.action.toLowerCase().trim()) {
        case 'adicionar-periodo':
          acao.addEventListener('click', (evento) => {
            evento.preventDefault();
            const { length } = document.querySelectorAll('[data-element="periodo"]');
            document.querySelector('[data-element="periodos"]').appendChild(conteudos.periodo(length));
            $(`#inicio-periodo-${length}`).mask('00/00/0000');
            $(`#fim-periodo-${length}`).mask('00/00/0000');

            setTimeout(() => {
              $(`#inicio-periodo-${length}`).focus();
            }, 500);

            tooltips();
          });
          break;

        case 'baixar-resultados':
          acao.addEventListener('click', (evento) => {
            evento.preventDefault();
            baixarResultados(resultados);
          });
          break;

        case 'calcular':
          acao.addEventListener('click', (evento) => {
            evento.preventDefault();
            periodos = [];
            adicionarPeriodos(periodos).then((retorno) => {
              resultados = retorno;
            });
            alterarBotao('btn btn-primary', 'Calculando...');
          });
          break;

        case 'alternar-visualizacao':
          acao.addEventListener('click', (evento) => {
            evento.preventDefault();
            alternarVisualizacaoTrocaCard();
          });
          break;

        default:
          throw new Error('Ação não implementada para o link informado.');
      }
    });
  };

  window.addEventListener('DOMContentLoaded', () => {
    // Carregar conteúdo na página
    const body = document.querySelector('body');
    body.innerHTML += conteudos.principal;
    body.innerHTML += conteudos.footer;

    // Atribuindo máscaras para os primeiros inputs carregados
    $(document).ready(() => {
      $('#inicio-periodo-0').mask('00/00/0000');
      $('#fim-periodo-0').mask('00/00/0000');
    });

    // Ocultar loading
    $('.overlay').animate({ width: 'toggle' }, 350);

    // Chamando funções
    atribuirLinks();
    atribuirAcoes();
    tooltips();
    verificarInputsRecarregamento();

    // Em modo desenvolvimento (0), os campos são preenchidos e o botão clicado
    if (mode === 0) {
      setTimeout(() => {
        $('#inicio-periodo-0').val('01/01/2000');
        $('#fim-periodo-0').val('01/01/2002');
        $('[data-action="calcular"]').click();
      }, 500);
    }
  });

  // Definindo globalmente as funções
  window.removerPeriodo = removerPeriodo;
  window.escutaEventoInput = escutaEventoInput;
})();
