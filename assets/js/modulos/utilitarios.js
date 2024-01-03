const isEmpty = (valor) => {
  if (typeof valor === 'string') {
    return valor === undefined || valor === null || valor.length <= 0;
  } if (Array.isArray(valor)) {
    return valor.length <= 0;
  } if (typeof valor === 'object') {
    return Object.keys(valor).length <= 0;
  }
    return valor === undefined || valor === null;
};

const capitalize = (valor) => valor.charAt(0).toUpperCase() + valor.substr(1, valor.length);

const atualizarDatas = () => {
  const dataAtual = new Date();
  document.querySelectorAll('[data-ano-atual]').forEach((area) => {
    area.textContent = `${dataAtual.getFullYear()}`;
  });
}; 

function sanitizarString(string) {
  let string_replace = '';

  if (typeof string === 'string') {
    const substituir = [
      {
        original: '-',
        subst: '',
      },
      {
        original: '(',
        subst: '',
      },
      {
        original: ')',
        subst: '',
      },
      {
        original: ' ',
        subst: '',
      },
    ];

    substituir.forEach((substituicao) => {
      string_replace = string.replace(substituicao.original, substituicao.subst);
    });

    return string_replace.trim();
  } 
    console.log('O tipo do parâmetro passado não é uma string.');
    return null;
}

function tooltips() {
  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
}

function popovers() {
  $(document).ready(() => {
    $('[data-bs-toggle="popover"]').popover();  
  });
}

async function SwalAlert(tipo, icon, title, text, mensagem) {
  const tipoLC = tipo.toLowerCase().trim();
  if (tipoLC === 'confirmacao') {
    const dialog = await Swal.fire({
      icon,
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      focusCancel: true,
    });

    return new Promise((resolve) => {
      resolve({ isConfirmed: dialog.isConfirmed });
    });
  }

  if (tipoLC === 'aviso') {
    Swal.fire({
      icon,
      title,
      text,
    });
  } else if (tipoLC === 'error') {
    Swal.fire({
      icon,
      title,
      text,
      footer: mensagem,
    }); 
  }
}

const verificarInputsRecarregamento = () => {
  // window.onbeforeunload = async (evento) => {
  //   evento.preventDefault();
  //   await document.querySelectorAll('[data-element="input"]').forEach(elemento => {
  //     if(!isEmpty(elemento.value)){
  //       return 'Tem certeza que deseja sair?';
  //     }
  //   })
  // }
};

function atribuirLinks() {
  const linkElementos = document.querySelectorAll('[data-link]');
  
  linkElementos.forEach((link) => {
    switch (link.dataset.link.toLowerCase().trim()) {        
      case 'github-dev':
      link.href = 'https://github.com/gabrieszin';
      break;
      
      case 'github-projeto':
      link.href = 'https://github.com/gabrieszin/calculadora-tempo-de-servico';
      break;

      case 'calculadora':
      link.href = './index.html';
      break;

      case 'saiba-mais':
      link.href = 'https://www.fgts.gov.br/Pages/sou-trabalhador/amortizacao_liquidacao.aspx';
      break;

      case 'saiba-mais-uso':
      link.href = 'https://www.caixa.gov.br/voce/habitacao/Paginas/utilizacao-fgts.aspx';
      break;

      case 'consumindo-api-alura':
      link.href = 'https://gabrieszin.github.io/my-courses-alura/';
      break;

      case 'cca':
      link.href = 'https://gabrieszin.github.io/cca/';
      break;

      case 'gerador-qr-code':
      link.href = 'https://gabrieszin.github.io/qr-code-generator/';
      break;
      
      default:
      // throw new Error('Ação não implementada para o link informado.');
      break;
    }
    
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

export {
  isEmpty,
  capitalize,
  atualizarDatas,
  sanitizarString,
  tooltips,
  popovers,
  SwalAlert,
  verificarInputsRecarregamento,
  atribuirLinks,
};
