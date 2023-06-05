import { isEmpty } from './utilitarios.js';

const periodo = (index) => {
isEmpty(index) ? index = 0 : '';

const div = document.createElement('div');
div.classList.value= 'row mb-3';
div.dataset.element = 'periodo';
div.innerHTML = `
<div class="col input-group">
<label class="input-group-text" for="inicio-periodo-${index}">Início</label>
<input type="date" class="form-control" id="inicio-periodo-${index}" oninput="escutaEventoInput(this)" data-element="inicio" required>
</div>
<div class="col input-group">
<label class="input-group-text" for="fim-periodo-${index}">Fim</label>
<input type="date" class="form-control" id="fim-periodo-${index}" oninput="escutaEventoInput(this)" data-element="fim" required>
<button class="btn btn-outline-secondary" type="button" onclick="removerPeriodo(this)" data-toggle="tooltip" data-placement="top" title="Remover"><i class="bi bi-trash"></i></button>
</div>`;

return div;
};

const critica = (elemento) => {
  html = {
    podeUsarFGTS: `<li class="mt-2"><i class="bi bi-calendar2-check"></i><span>Pode usar saldo de contas FGTS em financiamentos habitacionais</span></li>`,
    podeAmortizarComFGTS: `<li class="mt-2"><i class="bi bi-receipt"></i><span>Pode amortizar financiamentos habitacionais com o FGTS&nbsp;<sup><a href="" class="link-visivel" rel="noreferrer noopener">1</a></sup></span></li>`,
    podeTerDescontoMCMV: `<li class="mt-2"><i class="bi bi-percent"></i><span>Pode ter desconto de 0.5% ao ano no juros para Minha Casa Minha Vida</span></li>`,
    naoPodeUsarFGTS: `<li class="mt-2"><i class="bi bi-x-square"></i><span>Não pode usar saldo de contas FGTS em financiamentos habitacionais</span></li>`,
    naoPodeAmortizarComFGTS: `<li class="mt-2"><i class="bi bi-x-square"></i><span>Não pode amortizar financiamentos habitacionais com o FGTS&nbsp;<sup><a href="" class="link-visivel" rel="noreferrer noopener">1</a></sup></span></li>`,
    naoPodeTerDescontoMCMV: `<li class="mt-2"><i class="bi bi-x-square"></i><span>Não pode ter desconto no juros para o Minha Casa Minha Vida</span></li>`
  },
  texto = {

  }
}

const principal = `<div class="principal"> <header class="mb-5"> <h1>Calculadora</h1> <h1>Tempo de Serviço</h1> </header> <main class="row"> <section class="col"> <div class="card"> <div class="card-header"> <b>Períodos de serviço</b> </div> <div class="card-body"> <form action="" data-element="formulario"> <div data-element="periodos"> <div class="row mb-3" data-element="periodo"> <div class="col input-group"> <label class="input-group-text" for="inicio-periodo-0">Início</label> <input type="date" class="form-control" id="inicio-periodo-0" oninput="escutaEventoInput(this)" data-element="inicio" required> </div> <div class="col input-group"> <label class="input-group-text" for="fim-periodo-0">Fim</label> <input type="date" class="form-control" id="fim-periodo-0" oninput="escutaEventoInput(this)" data-element="fim" required> <button class="btn btn-outline-secondary" type="button" onclick="removerPeriodo(this)" data-toggle="tooltip" data-placement="top" title="Remover"><i class="bi bi-trash"></i></button> </div> </div> </div> <div class="d-flex justify-content-between align-center"> <button type="button" class="btn btn-outline-primary" data-action="adicionar-periodo">Adicionar período</button> <button type="submit" class="btn btn-primary" data-action="calcular">Calcular</button> </div> </form> </div> </div> </section> <section class="col"> <div class="card"> <div class="card-header"> <b>Tempo de serviço</b> </div> <div class="card-body"> <h4 data-content="meses-calculo"></h4> <span class="text-muted" data-content="dados-calculo-detalhado"></span> <div class="alert alert-secondary" data-content="informacao-funcionamento"> O tempo de serviço calculado aparece aqui. </div> <!-- <ul class="mt-4 text-success" data-element="critica-tempo-de-servico"> </ul> <ul class="mt-4 text-error" data-element="critica-tempo-de-servico"> </ul> --> <div class="mt-4 alert alert-primary" style="display: none;"> <b>Saiba mais</b>&nbsp;<a href="" class="link-visivel" data-link="saiba-mais">sobre a utilização do FGTS em financiamentos habitacionais.</a> </div> <div style="display: none;"> <small class="text-muted"><sup>1</sup>&nbsp;A amortização de financiamentos habitacionais pode ser realizada a cada 2 anos, após o imóvel pronto em caso de empreendimento. <a href="" class="link-visivel">Saiba mais clicando aqui.</a></small> </div> </div> </div> </section> </main> </div>`;

const footer = `<footer class="pt-4 mt-5 pt-md-5 border-top"> <div class="row"> <div class="col-12 col-md"> <small class="d-block text-muted">Desenvolvido por</small> <a href="" data-link="github-dev"><h5 class="bold">Gabriel Ribeiro</h5></a><br> <small class="d-block text-muted">&copy; <span data-ano-atual=''>2023</span></small> <small class="d-block mb-3 text-muted">Todos os direitos reservados.</small> </div> <div class="col-6 col-md"> <h5>Recursos</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="calculadora">Calculadora</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="saiba-mais">Saiba mais</a></li> </ul> </div> <div class="col-6 col-md"> <h5>Outros projetos</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="consumindo-api-alura">Consumindo API</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="confirmacao-cca">Confirmação CCA</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="gerador-qr-code">Gerador QR Code</a></li> </ul> </div> <div class="col-6 col-md"> <h5>Sobre</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-dev">Desenvolvedor</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-projeto">GitHub</a></li> </ul> </div> </div> </footer>`;

export const conteudos = {
  periodo,
  principal,
  footer
}