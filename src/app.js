// src/app.js

// caminhos
const bgSrc = '/assets/carteirinha.png';

const inputSection  = document.getElementById('input-section');
const cardSection   = document.getElementById('card-section');
const matInput      = document.getElementById('mat-input');
const fetchBtn      = document.getElementById('fetch-btn');
const downloadBtn   = document.getElementById('download-btn');
const canvas        = document.getElementById('card-canvas');
const ctx           = canvas.getContext('2d');

// preload background
let bgLoaded = false;
const bgImage = new Image();
bgImage.onload = () => {
  bgLoaded = true;
};
bgImage.onerror = () => console.error('Não carregou background');
bgImage.src = bgSrc;

// Busca e mostra a carteirinha
fetchBtn.addEventListener('click', async () => {
  const matricula = matInput.value.replace(/\D/g, '');
  if (!matricula) return alert('Informe uma matrícula válida.');

  try {
    // pega dados
    const res = await fetch(`/api/student/${matricula}`);
    if (!res.ok) {
      alert('Matrícula não encontrada');
      return;
    }
    const { nome, curso, cpf, photo_url } = await res.json();

    // esconde input / mostra cartão
    inputSection.style.display = 'none';
    cardSection.style.display  = 'flex';

    // ajusta canvas ao tamanho do template
    canvas.width  = bgImage.width;
    canvas.height = bgImage.height;

    // desenha background
    ctx.drawImage(bgImage, 0, 0);

    // foto centralizada e 2× maior (300×300)
    const w = 300, h = 400;
    const x = (canvas.width - w)/2;
    const y = 210;

    // clipping rounded
    const r = 20;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.clip();

    // desenha foto
    const photo = new Image();
    photo.onload = () => {
      ctx.drawImage(photo, x, y, w, h);
      ctx.restore();

      // textos
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';

      ctx.font = '48px sans-serif';
      ctx.fillText(nome, canvas.width/2, y + h + 120);

      ctx.font = '38px sans-serif';
      ctx.fillText(curso, canvas.width/2, y + h + 170);

      ctx.font = '28px sans-serif';
      ctx.fillText(`Matrícula: ${cpf}`, canvas.width/2, y + h + 250);

      ctx.font = '18px sans-serif';
      ctx.fillText(`Válido até 10/06/2025`, canvas.width/2, y + h + 300);

      downloadBtn.style.display = 'block';
    };
    photo.onerror = () => console.error('Não carregou foto:', photo_url);
    photo.src = photo_url.startsWith('/')
      ? photo_url
      : `/assets/${photo_url}`;

  } catch (err) {
    console.error(err);
    alert('Erro ao consultar servidor.');
  }
});

// Baixa PNG
downloadBtn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.download = 'carteirinha.png';
  a.href     = canvas.toDataURL('image/png');
  a.click();
});
