const first = [];

const periodo = (index) => {
  const div = document.createElement('div');
  div.classList.value = 'row mb-3';
  div.dataset.element = 'periodo';
  div.innerHTML = `
  <div class="col input-group">
  <label class="input-group-text" for="inicio-periodo-${index}">Início</label>
  <input type="text" inputmode="numeric" placeholder="00/00/0000" class="form-control" id="inicio-periodo-${index}" oninput="escutaEventoInput(this)" data-element="inicio" required pattern="\d{2}/\d{2}/\d{4}" title="O formato deve corresponder a uma data. Ex.: 01/01/2000">
  </div>
  <div class="col input-group">
  <label class="input-group-text" for="fim-periodo-${index}">Fim</label>
  <input type="text" inputmode="numeric" placeholder="00/00/0000" class="form-control" id="fim-periodo-${index}" oninput="escutaEventoInput(this)" data-element="fim" required pattern="\d{2}/\d{2}/\d{4}" title="O formato deve corresponder a uma data. Ex.: 01/01/2000">
  <button class="btn btn-outline-secondary" type="button" onclick="removerPeriodo(this)" data-toggle="tooltip" data-placement="top" title="Remover"><i class="bi bi-x-lg"></i></button>
  </div>`;
  
  $(`#inicio-periodo-${index}`).mask('00/00/0000');
  $(`#fim-periodo-${index}`).mask('00/00/0000');
  
  first.push(index);
  
  if (first.length === 1) {
    console.log('Versão 1.5.8');
  }
  
  return div;
};

const critica = {
  html: {
    podeUsarFGTS: '<li class="mt-2"><i class="bi bi-calendar2-check"></i><span>Pode usar saldo de contas FGTS em financiamentos habitacionais</span></li>',
    podeAmortizarComFGTS: '<li class="mt-2"><i class="bi bi-receipt"></i><span>Pode amortizar financiamentos habitacionais com o FGTS&nbsp;<sup><a href="" data-link="saiba-mais" class="link-visivel" rel="noreferrer noopener">1</a></sup></span></li>',
    podeTerDescontoMCMV: '<li class="mt-2"><i class="bi bi-percent"></i><span>Pode ter desconto de 0.5% ao ano no juros para Minha Casa Minha Vida</span></li>',
    naoPodeUsarFGTS: '<li class="mt-2"><i class="bi bi-x-square"></i><span>Não pode usar saldo de contas FGTS em financiamentos habitacionais</span></li>',
    naoPodeAmortizarComFGTS: '<li class="mt-2"><i class="bi bi-x-square"></i><span>Não pode amortizar financiamentos habitacionais com o FGTS&nbsp;<sup><a href="" data-link="saiba-mais" class="link-visivel" rel="noreferrer noopener">1</a></sup></span></li>',
    naoPodeTerDescontoMCMV: '<li class="mt-2"><i class="bi bi-x-square"></i><span>Não pode ter desconto no juros para o Minha Casa Minha Vida</span></li>',
  },
};

const htmlBtnSubmit = '<kbd title="Atalho" data-toggle="tooltip" data-placement="top">C</kbd>&nbsp;<span>Calcular</span>';

const principal = `<div class="principal"> <header class="mb-5"> <h1>Calculadora</h1> <h1>Tempo de Serviço</h1> </header> <main class="row"> <section class="col"> <div class="card"> <div class="card-header"> <b>Períodos de serviço</b> </div> <div class="card-body"> <div class="alert alert-warning mb-3"><b>Atenção:</b> A calculadora não ignora vínculos simultâneos. </div> <form action="" data-element="formulario"> <div data-element="periodos"> <div class="row mb-3" data-element="periodo"> <div class="col input-group"><label class="input-group-text" for="inicio-periodo-0">Início</label><input type="text" inputmode="numeric" placeholder="00/00/0000" class="form-control" id="inicio-periodo-0" oninput="escutaEventoInput(this)" data-element="inicio" required pattern="\d{2}/\d{2}/\d{4}" title="O formato deve corresponder a uma data. Ex.: 01/01/2000" autofocus></div><div class="col input-group"><label class="input-group-text" for="fim-periodo-0">Fim</label><input type="text" inputmode="numeric" placeholder="00/00/0000" class="form-control" id="fim-periodo-0" oninput="escutaEventoInput(this)" data-element="fim" required pattern="\d{2}/\d{2}/\d{4}" title="O formato deve corresponder a uma data. Ex.: 01/01/2000"><button class="btn btn-outline-secondary" type="button" onclick="removerPeriodo(this)" data-toggle="tooltip" data-placement="top" title="Remover"><i class="bi bi-x-lg"></i></button></div> </div> </div> <div class="d-flex justify-content-between align-center"><button type="button" class="btn btn-light" data-action="adicionar-periodo" accesskey="A"><kbd title="Atalho" data-toggle="tooltip" data-placement="top">A</kbd>&nbsp;<span>Adicionar período</span></button><button type="submit" class="btn btn-primary" data-action="calcular" accesskey="C">${htmlBtnSubmit}</button></div></form></div></div></section><section class="col"><div class="card"> <div class="card-header d-flex justify-content-between align-items-center"> <b>Tempo de serviço</b> <div><button class="btn btn-light" data-toggle="tooltip" data-placement="top" data-action="baixar-resultados" title="Baixar resultado"><i class="bi bi-file-earmark-arrow-down"></i></button>&nbsp;<button class="btn btn-light" data-toggle="tooltip" data-placement="top" data-action="alternar-visualizacao" title="Alternar visualização"><i class="bi bi-card-text"></i></button></div></div><div class="card-body"> <div class="alert alert-secondary" data-content="informacao-funcionamento"> O tempo de serviço calculado aparece aqui. </div><div data-content="demais-informacoes"><h4><b data-content="meses-calculo"></b></h4><span class="text-muted" data-content="dados-calculo-detalhado"></span><ul class="mt-4 none" data-element="critica-tempo-de-servico-erro"> </ul><ul class="mt-4 none" data-element="critica-tempo-de-servico-sucesso"></ul><div class="mt-4 alert alert-primary none" data-element="saiba-mais"> <b>Saiba mais</b>&nbsp;<a href="" class="link-visivel" data-link="saiba-mais-uso">sobre a utilização do FGTS em financiamentos habitacionais.</a></div> <div class="none mt-4" data-element="referencia"><small class="text-muted"><sup>1</sup>&nbsp;A amortização de financiamentos habitacionais pode ser realizada a cada 2 anos, após o imóvel pronto em caso de empreendimento.&nbsp;<a href="" data-link="saiba-mais" class="link-visivel">Saiba mais clicando aqui.</a></small></div></div><div class="card-tempo-de-servico none" data-content="card-resultado"><div class="tempo"><h3 class="tempo-titulo" data-content="meses-calculo"></h3><h3 class="tempo-descricao">meses trabalhados</h3></div><div class="descricao"><span class="descricao-titulo-secundario">O tempo de serviço calculado é de <br></span><h3 class="descricao-titulo" data-content="dados-calculo-detalhado"></h3></div><div class="barra"><div class="content"><h6>gabriersdev.github.io/</h6><h6 style=\'font-weight: bold\'>calculadora-tempo-de-servico</h6></div><div class="image"><div class="img"></div></div></div></div></div></div></section></main></div>`;

const footer = '<footer class="pt-4 mt-5 pt-md-5 border-top"><div class="row"><div class="col-12 col-md"><small class="d-block text-muted">Desenvolvido por</small><a href="" data-link="github-dev"><h5 class="bold">Gabriel Ribeiro</h5></a><br><span class="d-block text-muted">&copy;<span data-ano-atual>2023</span>&nbsp;<span class="text-black-50" data-element="informacoes-adicionais"></span></span> <span class="d-block mb-3 text-muted">Todos os direitos reservados.</span></div><div class="col-6 col-md"><h5>Recursos</h5><br><ul class="list-unstyled text-small"><li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="calculadora">Calculadora</a></li><li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="saiba-mais">Saiba mais</a></li></ul></div><div class="col-6 col-md"><h5>Outros projetos</h5><br><ul class="list-unstyled text-small"><li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="calculadora-tempo-servico">Calculadora Tempo de Serviço</a></li><li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="cca">Projeto CCA</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="capa-de-dossies">Projeto Capa de Dossiês</a></li></ul></div><div class="col-6 col-md"><h5>Sobre</h5><br><ul class="list-unstyled text-small"><li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-dev">Desenvolvedor</a></li><li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-projeto">GitHub</a></li></ul></div><a class="link-acesso none" data-link="github-projeto"><div><i class="bi bi-arrow-up-right-square-fill"></i><p>Acesse&nbsp;<b>github.com/gabriersdev/calculadora-tempo-de-servico</b></p></div></a></div></footer>';

const periodos_teste = [
  [
    {
      inicio: '07/04/2020',
      fim: '08/06/2020',
    }, {
      inicio: '18/12/2019',
      fim: '23/01/2020',
    },
    {
      inicio: '20/08/2020',
      fim: '03/03/2021',
    },
    {
      inicio: '08/03/2021',
      fim: '17/05/2021',
    },
    {
      inicio: '22/06/2021',
      fim: '15/02/2022',
    },
    {
      inicio: '02/06/2022',
      fim: '09/04/2023',
    },
    {
      inicio: '24/03/2023',
      fim: '16/01/2024',
    },
    {
      inicio: '14/07/2011',
      fim: '30/09/2011',
    },
  ],
  [
    {
      inicio: '09/11/2020',
      fim: '01/03/2021',
    }, {
      inicio: '25/01/2020',
      fim: '25/03/2020',
    },
    {
      inicio: '22/08/2017',
      fim: '22/03/2018',
    },
    {
      inicio: '03/03/2021',
      fim: '31/05/2021',
    },
    {
      inicio: '27/06/2022',
      fim: '04/03/2023',
    },
    {
      inicio: '09/05/2023',
      fim: '03/02/2024',
    },
  ],
];

export {
  periodo,
  principal,
  htmlBtnSubmit,
  footer,
  critica,
  periodos_teste,
};
