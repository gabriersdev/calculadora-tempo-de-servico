const isEmpty = (valor) => {
  if(typeof valor == 'string'){
    return valor == undefined || valor == null || valor.length <= 0;
  }else if(Array.isArray(valor)){
    return valor.length <= 0;
  }else if(typeof valor == 'object'){
    return Object.keys(valor).length <= 0;
  }else{
    return valor == undefined || valor == null
  }
}

const capitalize = (valor) => {
  return valor.charAt(0).toUpperCase() + valor.substr(1, valor.length);
}

const atualizarDatas = () => {
  const dataAtual = new Date();
  document.querySelectorAll("[data-ano-atual]").forEach(area => {
    area.textContent = `${dataAtual.getFullYear()}`;
  })
} 

const controleFechamentoModal = () => {
  const modais = document.querySelectorAll('.modal');
  modais.forEach(modal => {
    const btnFecha = modal.querySelector('[data-modal-fecha]');
    btnFecha.addEventListener('click', () => {
      $('#' + modal.id).modal('hide');
    })
  })
}

function sanitizarString(string){
  if(typeof string == 'string'){
    const substituir = [
      {
        original: '-',
        subst: ''
      },
      {
        original: '(',
        subst: ''
      },
      {
        original: ')',
        subst: ''
      },
      {
        original: ' ',
        subst: ''
      },
    ]

    substituir.forEach(substituicao => {
      string = string.replace(substituicao.original, substituicao.subst)
    })

    return string.trim();
  }else{
    console.log('O tipo do parâmetro passado não é uma string.');
    return null;
  }
}

function tooltips(){
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

function popovers(){
  $(document).ready(function(){
    $('[data-bs-toggle="popover"]').popover();  
  });
}

async function SwalAlert(tipo, icon, title, text, mensagem){
  tipo = tipo.toLowerCase().trim();
  if(tipo == 'confirmacao'){
    const dialog = await Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      focusCancel: true
    })

    return new Promise((resolve, reject) => {
      resolve({isConfirmed: dialog.isConfirmed})
    })
  }

  else if(tipo == 'aviso'){
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    })
  }

  else if(tipo == 'error'){
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      footer: mensagem
    }) 
  }
}

function resizeTextArea(textarea){
  // Créditos https://www.instagram.com/reel/CrdgXF3AECg/
  const initialHeight = parseInt(getComputedStyle(textarea).getPropertyValue('height'));
  textarea.addEventListener('input', () => {
    textarea.style.height = `${initialHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    const newHeight = textarea.scrollHeight - initialHeight;
    textarea.style.height = `${newHeight < scrollHeight ? scrollHeight : newHeight}px`;
  });
}

const verificarInputsRecarregamento = () => {
  window.onbeforeunload = async (evento) => {
    evento.preventDefault();
    await document.querySelectorAll('[data-element="input"]').forEach(elemento => {
      if(!isEmpty(elemento.value)){
        return 'Tem certeza que deseja sair?';
      }
    })
  }
}

export{
  isEmpty,
  capitalize,
  atualizarDatas,
  controleFechamentoModal,
  sanitizarString,
  tooltips,
  popovers,
  SwalAlert,
  resizeTextArea,
  verificarInputsRecarregamento
}