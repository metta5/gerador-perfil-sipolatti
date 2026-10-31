const criarPerfil = criarSorteador();
const AVISO = `Treino: preços adaptados a partir de valores coletados em ${COLETA} nos sites da Sipolatti e do concorrente. Não use com clientes.`;
const el = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let atual = null;

el('aviso').textContent = AVISO;

function campos(p) {
  return [
    ['O que quer', p.quer],
    ['O que deseja', p.deseja],
    ['Motivação', p.motivacao],
    ['Pesquisou na concorrência?', p.pesquisou],
    ['Produto que já tem', p.temHoje],
    ['Orçamento', p.orcamento],
    ['Forma de pagamento', p.pagamento],
  ];
}

function desenhar(p) {
  const linhas = campos(p).map(([a, b]) => `<dt>${a}</dt><dd>${esc(b)}</dd>`).join('');
  el('perfil').innerHTML = `
    <div class="faixa"><small>Cliente</small><strong>${esc(p.nome)}</strong></div>
    <div class="corpo">
      <div class="foto"><img src="${p.imagem}" alt="${esc(p.movel)}"><p>${esc(p.movel)}</p></div>
      <dl>${linhas}<dt>Objeções</dt><dd><ul>${p.objecoes.map(o => `<li>${esc(o)}</li>`).join('')}</ul></dd></dl>
    </div>
    <div class="precos">
      <div class="preco sip"><span>Preço na Sipolatti</span><strong>${esc(p.precoSipolatti)}</strong></div>
      <div class="preco"><span>Preço no concorrente</span><strong>${esc(p.precoConcorrente)}</strong><small>${esc(p.produtoConcorrente)}</small></div>
    </div>
    ${p.diferencial ? `<div class="melhor"><strong>Em que a Sipolatti é melhor</strong><br>${esc(p.diferencial)}${p.aMaisPorMes ? `<br>${esc(p.aMaisPorMes)}` : ''}</div>` : ''}
    <p class="cenario"><strong>Cenário:</strong> ${esc(p.cenario)}.</p>`;
  el('perfil').hidden = false;
  el('baixar').hidden = false;
}

el('criar').addEventListener('click', () => {
  atual = criarPerfil();
  desenhar(atual);
  el('baixar').textContent = 'Baixar em PDF';
  el('perfil').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

function imagemParaPdf(src, largura = 720) {
  return new Promise((ok, erro) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = largura;
      c.height = Math.round(largura * img.naturalHeight / img.naturalWidth) || largura;
      const g = c.getContext('2d');
      g.fillStyle = '#fff';
      g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      ok({ url: c.toDataURL('image/jpeg', .85), proporcao: c.height / c.width });
    };
    img.onerror = erro;
    img.src = src;
  });
}

async function baixarPdf(p) {
  const { jsPDF } = window.jspdf;
  const d = new jsPDF({ unit: 'mm', format: 'a4' });
  const M = 15, L = 180;
  const AZUL = [0, 71, 141], LARANJA = [242, 106, 27], TEXTO = [20, 35, 59], APOIO = [86, 101, 121];

  const [foto, logoS, logoM] = await Promise.all([
    imagemParaPdf(p.imagem), imagemParaPdf('assets/logo-sipolatti.png', 480), imagemParaPdf('assets/logo-metta.png', 360),
  ]);
  d.setFillColor(255, 255, 255).rect(0, 0, 210, 297, 'F');
  d.addImage(logoS.url, 'JPEG', M, 10, 13 / logoS.proporcao, 13);
  d.addImage(logoM.url, 'JPEG', 195 - 9 / logoM.proporcao, 12, 9 / logoM.proporcao, 9);
  d.setFillColor(...LARANJA).rect(0, 26, 210, 1.2, 'F');

  d.setFillColor(...AZUL).roundedRect(M, 32, L, 19, 2, 2, 'F');
  d.setTextColor(255, 198, 41).setFont('helvetica', 'bold').setFontSize(10).text('Perfil de cliente', M + 5, 39);
  d.setTextColor(255, 255, 255).setFontSize(18).text(p.nome, M + 5, 47);

  const y0 = 57, lado = 62;
  d.setDrawColor(217, 226, 238).roundedRect(M, y0, lado, lado, 2, 2);
  const a = lado - 4, h = a * Math.min(foto.proporcao, 1), w = h / foto.proporcao;
  d.addImage(foto.url, 'JPEG', M + (lado - w) / 2, y0 + (lado - h) / 2, w, h);
  d.setTextColor(...AZUL).setFont('helvetica', 'bold').setFontSize(10);
  d.text(d.splitTextToSize(p.movel, lado), M, y0 + lado + 5);

  let y = y0 + 3;
  const X = M + lado + 7, W = L - lado - 7;
  const bloco = (rotulo, linhas) => {
    d.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...APOIO).text(rotulo, X, y);
    y += 4.2;
    d.setFont('helvetica', 'normal').setFontSize(10.5).setTextColor(...TEXTO);
    linhas.forEach(t => d.splitTextToSize(t, W).forEach(l => { d.text(l, X, y); y += 4.8; }));
    y += 2.2;
  };
  campos(p).forEach(([r, v]) => bloco(r, [v]));
  bloco('Objeções', p.objecoes.map(o => '- ' + o));

  y = Math.max(y, y0 + lado + 14) + 2;
  const caixa = (x, rotulo, texto, extra, cor) => {
    d.setDrawColor(...cor).setLineWidth(.4).roundedRect(x, y, 87, 25, 2, 2);
    d.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...APOIO).text(rotulo, x + 4, y + 6);
    d.setFontSize(10.5).setTextColor(...TEXTO).text(d.splitTextToSize(texto, 79), x + 4, y + 11.5);
    if (extra) d.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...APOIO).text(extra, x + 4, y + 22);
  };
  caixa(M, 'Preço na Sipolatti', p.precoSipolatti, '', LARANJA);
  caixa(M + 93, 'Preço no concorrente', p.precoConcorrente, p.produtoConcorrente, [217, 226, 238]);
  y += 31;

  if (p.diferencial) {
    d.setFont('helvetica', 'normal').setFontSize(10);
    const linhas = d.splitTextToSize(p.diferencial, L - 8)
      .concat(p.aMaisPorMes ? d.splitTextToSize(p.aMaisPorMes, L - 8) : []);
    const altura = 12 + linhas.length * 4.5;
    d.setDrawColor(...LARANJA).roundedRect(M, y - 3, L, altura, 2, 2);
    d.setFont('helvetica', 'bold').setTextColor(...TEXTO).text('Em que a Sipolatti é melhor', M + 4, y + 3);
    d.setFont('helvetica', 'normal');
    linhas.forEach((l, i) => d.text(l, M + 4, y + 8 + i * 4.5));
    y += altura + 3;
  }

  const notaC = `Cenário: ${p.cenario}.`;
  d.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...TEXTO);
  d.text(d.splitTextToSize(notaC, L), M, y);

  d.setFontSize(8.5).setTextColor(...APOIO).text(d.splitTextToSize(AVISO, L), M, 283);

  const arq = p.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').toLowerCase();
  d.save(`perfil-cliente-${arq}.pdf`);
}

el('baixar').addEventListener('click', async () => {
  const b = el('baixar');
  b.disabled = true;
  b.textContent = 'Gerando...';
  try {
    await baixarPdf(atual);
    b.textContent = 'Baixar em PDF';
  } catch (e) {
    console.error(e);
    b.textContent = 'Não baixou. Tente de novo.';
  }
  b.disabled = false;
});
