// Monta um perfil de cliente aleatório. Funciona no navegador e no Node (para a checagem automática).
const NOMES = ['Ana Paula', 'Carlos Eduardo', 'Juliana', 'Marcos', 'Fernanda', 'Roberto', 'Patrícia', 'André', 'Luciana', 'Rafael',
  'Simone', 'Diego', 'Camila', 'Paulo', 'Renata', 'Thiago', 'Cristiane', 'Leandro', 'Vanessa', 'Gilberto', 'Michele', 'Wesley', 'Sandra', 'João Pedro'];

// Cada história é coerente por dentro: quer, deseja, motivação e o que a pessoa já tem.
const HISTORIAS = {
  sofa: [
    ['Um sofá retrátil para a sala', 'Assistir filme com a família sem disputar lugar', 'O sofá atual afundou e a sala vai receber visita no Natal', 'Sofá de 3 lugares com 9 anos, assento afundado'],
    ['Um sofá confortável para descansar', 'Esticar as pernas depois de um dia inteiro em pé', 'Passou a trabalhar em pé e chega em casa com dor nas costas', 'Sofá de 2 lugares herdado da mãe, tecido rasgado'],
    ['Um sofá novo para a casa nova', 'Deixar a sala com cara de casa pronta', 'Acabou de receber as chaves do apartamento', 'Nenhum sofá; hoje usa cadeiras de plástico'],
  ],
  'sofa-cama': [
    ['Um sofá que vire cama', 'Receber os parentes sem ninguém dormir no chão', 'Os pais vêm passar as festas de fim de ano', 'Sofá de 2 lugares e um colchão de solteiro no armário'],
    ['Um sofá-cama para o quarto de hóspedes', 'Usar o cômodo como escritório e quarto ao mesmo tempo', 'Começou a trabalhar de casa', 'Cama de solteiro velha que ocupa o cômodo inteiro'],
  ],
  'guarda-roupa': [
    ['Um guarda-roupa de casal', 'Ter cada roupa no lugar e acabar com a bagunça', 'Casou há pouco e as roupas dos dois não cabem', 'Guarda-roupa de 3 portas, com porta caindo'],
    ['Um guarda-roupa maior', 'Abrir o armário de manhã e achar tudo sem estresse', 'As crianças cresceram e o quarto precisa ser reorganizado', 'Guarda-roupa de 4 portas com 12 anos, com mofo no fundo'],
    ['Um guarda-roupa para o quarto novo', 'Ver o quarto pronto, do jeito que sempre quis', 'Está terminando a reforma da casa', 'Araras e caixas de papelão'],
  ],
  cozinha: [
    ['Uma cozinha completa', 'Cozinhar com tudo à mão e receber a família no domingo', 'Acabou de reformar a cozinha', 'Dois armários soltos, de cores diferentes'],
    ['Armários para a cozinha pequena', 'Tirar as panelas de cima da pia e aproveitar cada canto', 'Mudou para um apartamento menor', 'Fruteira de chão e uma prateleira na parede'],
    ['Trocar o armário da cozinha', 'Ter uma cozinha bonita, que dê orgulho de mostrar', 'O armário antigo inchou por causa de um vazamento', 'Armário de 10 anos com portas soltando'],
  ],
  painel: [
    ['Um painel para a TV nova', 'Deixar a sala organizada, sem fio aparecendo', 'Comprou uma TV maior e o rack antigo não serve mais', 'Rack pequeno, para TV de 42"'],
    ['Um home para a sala', 'Ter uma sala de cinema para ver o jogo com os amigos', 'Vai reunir a turma na final do campeonato', 'TV apoiada em cima de uma cômoda'],
  ],
  jantar: [
    ['Uma mesa de jantar com cadeiras', 'Sentar todo mundo junto na hora da refeição', 'Cansou de comer no sofá com as crianças', 'Mesa de 2 lugares, encostada na parede'],
    ['Um conjunto de jantar maior', 'Receber a família toda na ceia de Natal', 'Este ano vai receber a ceia em casa', 'Mesa de 4 lugares com cadeiras bambas'],
  ],
  buffet: [
    ['Um buffet para a sala de jantar', 'Ter louças à mão e um lugar para montar a mesa de festa', 'Ganhou um jogo de jantar no casamento e não tem onde guardar', 'Caixas com louça embaixo da cama'],
    ['Um móvel para organizar a sala', 'Deixar a sala mais bonita e sem nada espalhado', 'Vai receber a família nas festas de fim de ano', 'Mesa de canto pequena e sem portas'],
  ],
  comoda: [
    ['Uma cômoda para o quarto', 'Ter o quarto arrumado sem gastar espaço', 'O bebê vai nascer e o quarto precisa de mais gavetas', 'Duas caixas organizadoras e uma mesa de cabeceira'],
    ['Uma cômoda com gavetas grandes', 'Acabar com a pilha de roupa em cima da cadeira', 'A filha adolescente vai ganhar quarto próprio', 'Cômoda de 3 gavetas, com trilho quebrado'],
  ],
};

const OUTRAS_OBJECOES = {
  sofa: ['Será que passa no elevador?', 'Tenho medo de o tecido soltar pelo com o tempo.'],
  'sofa-cama': ['Sofá-cama costuma ser desconfortável.', 'Será que passa na porta do quarto?'],
  'guarda-roupa': ['Quem monta? Não quero dor de cabeça.', 'Preciso conferir se cabe na parede.'],
  cozinha: ['A cor pode não combinar com o piso.', 'Quero ter certeza de que aguenta o peso das panelas.'],
  painel: ['Tenho medo de não aguentar o peso da TV.', 'Minha parede é de gesso, será que dá?'],
  jantar: ['As cadeiras parecem difíceis de limpar.', 'Preciso medir se a mesa cabe na sala.'],
  buffet: ['Não sei se combina com a minha mesa.', 'Preciso medir a parede antes.'],
  comoda: ['As gavetas parecem frágeis.', 'Preciso ver se cabe ao lado da cama.'],
};
const OBJECOES_GERAIS = ['Vou pensar e depois eu volto.', 'Preciso conversar em casa antes.', 'A entrega chega antes do Natal?'];

const CENARIOS = [
  { id: 'c1', nome: 'Concorrente mais caro' },
  { id: 'c2', nome: 'Concorrente mais barato' },
  { id: 'c3', nome: 'Sipolatti mais barata à vista e mais cara no parcelado' },
  { id: 'c4', nome: 'Sipolatti mais cara, com produto melhor' },
];

const final9 = v => Math.max(Math.round(v / 10) * 10 - 1, 9);
const limita = (v, min, max) => Math.min(Math.max(v, min), max);
const reais = v => 'R$ ' + (Number.isInteger(v)
  ? v.toLocaleString('pt-BR')
  : v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const redondo = v => Math.round(v / 50) * 50;

function criarSorteador(alea = Math.random) {
  const embaralha = l => {
    const a = l.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(alea() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  // Sacolas: só repete cenário, móvel ou nome depois de passar por todos.
  const sacola = lista => {
    let s = [], ultimo;
    return filtro => {
      if (!s.some(x => !filtro || filtro(x))) s = embaralha(lista);
      let i = s.findIndex(x => x !== ultimo && (!filtro || filtro(x)));
      if (i < 0) i = s.findIndex(x => !filtro || filtro(x));
      return ultimo = s.splice(i, 1)[0];
    };
  };
  const cenario = sacola(CENARIOS), nome = sacola(NOMES), historia = {};
  const proximoMovel = sacola(MOVEIS);
  const um = l => l[Math.floor(alea() * l.length)];

  return function criarPerfil() {
    const c = cenario();
    const m = proximoMovel(x => c.id !== 'c4' || x.melhor);
    historia[m.tipo] = historia[m.tipo] || sacola(HISTORIAS[m.tipo]);
    const [quer, deseja, motivacao, temHoje] = historia[m.tipo]();
    const base = m.preco;
    const pagaPix = alea() < 0.45;
    let sip, sim, orcamento, pagamento, objecaoPreco;

    if (c.id === 'c3') {
      const vista = final9(base * 0.93), total = base * 1.08, simV = final9(base);
      sip = { avista: vista, parcelas: 12, parcela: total / 12 };
      sim = { avista: simV, parcelas: 10, parcela: simV / 10 };
      orcamento = redondo(base);
      pagamento = pagaPix ? 'Pix, à vista' : 'Cartão de crédito, parcelado';
      objecaoPreco = pagaPix
        ? 'Se eu parcelar, lá sai mais barato. Por que aqui é diferente?'
        : 'No cartão, o concorrente fica mais em conta.';
    } else {
      const simV = c.id === 'c1' ? final9(limita(m.preco_sim, base * 1.08, base * 1.25))
        : c.id === 'c2' ? final9(limita(m.preco_sim, base * 0.75, base * 0.92))
        : final9(limita(m.preco_sim, base * 0.7, base * 0.9));
      sip = { avista: m.pix, parcelas: 10, parcela: base / 10 };
      sim = { avista: simV, parcelas: 10, parcela: simV / 10 };
      orcamento = redondo(c.id === 'c1' ? m.pix * 0.97 : simV * 1.03);
      pagamento = pagaPix ? 'Pix, à vista' : 'Cartão de crédito em até 10x';
      objecaoPreco = {
        c1: 'Passou um pouco do que planejei gastar.',
        c2: 'Vi mais barato no concorrente. Você cobre?',
        c4: 'Lá tem um parecido por menos. Por que eu pagaria mais?',
      }[c.id];
    }

    const nf = alea();
    const pesquisou = nf < 0.5 ? 'Sim, foi à loja do concorrente e viu o móvel'
      : nf < 0.8 ? 'Sim, olhou no site do concorrente'
      : 'Não. Só viu o preço em um anúncio do concorrente';

    return {
      cenario: c.nome,
      nome: nome(), quer, deseja, motivacao, pesquisou, temHoje,
      movel: m.nome, imagem: m.imagem,
      precoSipolatti: `${reais(sip.avista)} à vista ou ${sip.parcelas}x de ${reais(sip.parcela)}`,
      precoConcorrente: `${reais(sim.avista)} à vista ou ${sim.parcelas}x de ${reais(sim.parcela)}`,
      produtoConcorrente: m.sim_nome,
      orcamento: `Até ${reais(orcamento)}`,
      pagamento,
      objecoes: [objecaoPreco, um(alea() < 0.5 ? OUTRAS_OBJECOES[m.tipo] : OBJECOES_GERAIS)],
      diferencial: m.melhor || null,
      aMaisPorMes: m.melhor && (c.id === 'c2' || c.id === 'c4')
        ? `Parcela em 10x: ${reais(sip.parcela - sim.parcela)} a mais por mês que o concorrente` : null,
      numeros: { sip, sim, base, orcamento, cenario: c.id, tipo: m.tipo },
    };
  };
}

if (typeof module !== 'undefined') module.exports = { criarSorteador, CENARIOS, HISTORIAS, OUTRAS_OBJECOES };
