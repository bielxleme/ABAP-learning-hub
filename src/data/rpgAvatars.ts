import { RpgRace } from '../types';

export interface RpgClassInfo {
  level: number;
  title: string;
  skillName: string;
  attackType: 'melee' | 'magic' | 'ranged';
  spellAnimationName: string;
  description: string;
}

export interface RpgRaceMeta {
  id: RpgRace;
  name: string;
  genderedName: {
    masculino: string;
    feminino: string;
  };
  iconEmoji: string;
  themeColor: string;
  accentColor: string;
  description: string;
  lore: string;
  classesByLevel: Record<number, RpgClassInfo>;
}

export const RPG_RACES: Record<RpgRace, RpgRaceMeta> = {
  orc: {
    id: 'orc',
    name: 'Orc',
    genderedName: {
      masculino: 'Orc Berserker',
      feminino: 'Orc Guerreira',
    },
    iconEmoji: '🧌',
    themeColor: '#15803d',
    accentColor: '#4ade80',
    description: 'Resistente a qualquer erro de sintaxe. Esmaga bugs com força bruta e determinação inabalável!',
    lore: 'Nascido nas forjas profundas da infraestrutura SAP, este guerreiro nunca desiste até o SY-SUBRC ser 0.',
    classesByLevel: {
      1: {
        level: 1,
        title: 'Orc Aprendiz da SE38',
        skillName: 'Golpe do Ponto Final (.)',
        attackType: 'melee',
        spellAnimationName: 'slam',
        description: 'Desfere uma pancada com seu clava rústica, cravando pontos finais em todas as sentenças.',
      },
      2: {
        level: 2,
        title: 'Orc Guardião da SE11',
        skillName: 'Impacto de Tabela Primária',
        attackType: 'melee',
        spellAnimationName: 'ground_smash',
        description: 'Bate no chão abrindo fendas que forçam chaves primárias na MARA e KNA1.',
      },
      3: {
        level: 3,
        title: 'Orc Quebrador de Loops',
        skillName: 'Fúria da Tabela Interna',
        attackType: 'melee',
        spellAnimationName: 'whirlwind',
        description: 'Gira seu machado gigante triturando qualquer LOOP desordenado sem BINARY SEARCH.',
      },
      4: {
        level: 4,
        title: 'Orc Paladino Transacional',
        skillName: 'Martelo do COMMIT WORK',
        attackType: 'melee',
        spellAnimationName: 'hammer_quake',
        description: 'Um golpe titânico que confirma gravações no banco com a força de dez BAPIs.',
      },
      5: {
        level: 5,
        title: 'Orc Campeão S/4HANA',
        skillName: 'Esmagamento Clean ABAP',
        attackType: 'melee',
        spellAnimationName: 'mega_smash',
        description: 'Executa um salto colossal aniquilando códigos legados obsoletos em um raio de 100 metros.',
      },
      6: {
        level: 6,
        title: 'Orc Comandante de Spool',
        skillName: 'Ruptura de Impressão Rápida',
        attackType: 'melee',
        spellAnimationName: 'shockwave',
        description: 'Libera uma onda de choque que desobstrui todas as ordens de spool travadas na SP01.',
      },
      7: {
        level: 7,
        title: 'Lorde Warlord ABAP OO',
        skillName: 'Cataclismo CX_ROOT',
        attackType: 'melee',
        spellAnimationName: 'meteor_strike',
        description: 'Convoca meteoros de classes abstratas que pulverizam referências nulas e bugs corporativos.',
      },
    },
  },
  mago: {
    id: 'mago',
    name: 'Mago(a)',
    genderedName: {
      masculino: 'Mago Arcano',
      feminino: 'Maga Arcana',
    },
    iconEmoji: '🧙‍♀️',
    themeColor: '#7c3aed',
    accentColor: '#c084fc',
    description: 'Canaliza fórmulas mágicas e construtores de expressão do Clean ABAP 7.40+ com sabedoria ancestral.',
    lore: 'Estuda os manuscritos sagrados do NetWeaver e domina os segredos ocultos da memória e dos Field-Symbols.',
    classesByLevel: {
      1: {
        level: 1,
        title: 'Iniciada Arcana',
        skillName: 'Centelha de Variável Elementar',
        attackType: 'magic',
        spellAnimationName: 'magic_missile',
        description: 'Dispara raios celestes azuis que iluminam tipos elementares e parâmetros.',
      },
      2: {
        level: 2,
        title: 'Feiticeira do Dicionário',
        skillName: 'Chama de Query Open SQL',
        attackType: 'magic',
        spellAnimationName: 'fireball',
        description: 'Conjura uma esfera ígnea com SELECT SINGLE direto no ponto fraco do adversário.',
      },
      3: {
        level: 3,
        title: 'Alquimista de Memória',
        skillName: 'Rajada de Field-Symbols',
        attackType: 'magic',
        spellAnimationName: 'arcane_beam',
        description: 'Canaliza um feixe contínuo de energia roxa manipulando ponteiros de memória sem cópia de dados.',
      },
      4: {
        level: 4,
        title: 'Maga das BAPIs Celestes',
        skillName: 'Relâmpago da RFC Assíncrona',
        attackType: 'magic',
        spellAnimationName: 'lightning_storm',
        description: 'Invoca tempestades elétricas que sincronizam transações complexas em milissegundos.',
      },
      5: {
        level: 5,
        title: 'Grã-Maga do S/4HANA',
        skillName: 'Vórtice VALUE #( ) & CDS',
        attackType: 'magic',
        spellAnimationName: 'cosmic_nova',
        description: 'Abre um buraco de minhoca cósmico condensando tabelas inteiras em uma única expressão.',
      },
      6: {
        level: 6,
        title: 'Encantadora de Textos SE63',
        skillName: 'Runas de Impressão OTF',
        attackType: 'magic',
        spellAnimationName: 'astral_flare',
        description: 'Desenha runas arcanas no ar que traduzem e renderizam formulários instantaneamente.',
      },
      7: {
        level: 7,
        title: 'Arquimaga Suprema ABAP OO',
        skillName: 'Singularidade Polimórfica',
        attackType: 'magic',
        spellAnimationName: 'supernova',
        description: 'Invoca a sabedoria de todas as interfaces cósmicas desintegrando o chefão em poeira estelar.',
      },
    },
  },
  guerreiro: {
    id: 'guerreiro',
    name: 'Guerreiro(a)',
    genderedName: {
      masculino: 'Cavaleiro da SE38',
      feminino: 'Guerreira da SE38',
    },
    iconEmoji: '⚔️',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    description: 'Armado com a espada do Clean Code e o escudo da estabilidade em produção. Nunca vacila diante de um dump.',
    lore: 'Treinado na ordem dos guardiões de PRD, sua lâmina é rápida como um índice primário.',
    classesByLevel: {
      1: {
        level: 1,
        title: 'Recruta de Código',
        skillName: 'Corte Rápido REPORT',
        attackType: 'melee',
        spellAnimationName: 'blade_slash',
        description: 'Um golpe preciso com a espada que remove comentários redundantes e formata a sintaxe.',
      },
      2: {
        level: 2,
        title: 'Guardião de Banco',
        skillName: 'Estocada de Índice Primário',
        attackType: 'melee',
        spellAnimationName: 'pierce_thrust',
        description: 'Perfura armaduras pesadas atingindo o registro exato com a precisão de um SELECT SINGLE.',
      },
      3: {
        level: 3,
        title: 'Cavaleiro das Tabelas',
        skillName: 'Corte Binário (Binary Search)',
        attackType: 'melee',
        spellAnimationName: 'dual_slash',
        description: 'Dupla estocada que divide as chances do inimigo pela metade a cada movimento.',
      },
      4: {
        level: 4,
        title: 'Paladino das Funções SE37',
        skillName: 'Escudo do BAPIRET2',
        attackType: 'melee',
        spellAnimationName: 'shield_bash',
        description: 'Bloqueia todos os ataques com seu escudo blindado e rebate uma rajada de mensagens limpas.',
      },
      5: {
        level: 5,
        title: 'Mestre Espadachim S/4HANA',
        skillName: 'Lâmina Inline @DATA',
        attackType: 'melee',
        spellAnimationName: 'light_slash',
        description: 'Uma sequência estonteante de cortes brilhantes que corta qualquer dependência obsoleta.',
      },
      6: {
        level: 6,
        title: 'Protetor dos Documentos',
        skillName: 'Golpe Smart Form Fatal',
        attackType: 'melee',
        spellAnimationName: 'radiant_blade',
        description: 'Canaliza energia pura na espada, quebrando nós de controle corrompidos com precisão cirúrgica.',
      },
      7: {
        level: 7,
        title: 'Soberano das Classes ABAP OO',
        skillName: 'Julgamento da Interface Suprema',
        attackType: 'melee',
        spellAnimationName: 'divine_strike',
        description: 'Ergue sua espada para os céus trazendo um raio de luz dourada que consagra a vitória.',
      },
    },
  },
  elfo: {
    id: 'elfo',
    name: 'Elfo(a)',
    genderedName: {
      masculino: 'Elfo Arcanista',
      feminino: 'Elfa Arcanista',
    },
    iconEmoji: '🧝‍♀️',
    themeColor: '#059669',
    accentColor: '#34d399',
    description: 'Ágil, sábia e conectada às árvores do Dicionário de Dados. Executa manipulações em memória com graça incomparável.',
    lore: 'Vinda dos reinos ancestrais do SAP Kernel, ela enxerga os fluxos de tabelas internas como rios cristalinos.',
    classesByLevel: {
      1: {
        level: 1,
        title: 'Elfa Aprendiz da Floresta',
        skillName: 'Dança das Variáveis',
        attackType: 'magic',
        spellAnimationName: 'leaf_gust',
        description: 'Conjura ventos suaves carregados de folhas que organizam o código com leveza.',
      },
      2: {
        level: 2,
        title: 'Patrulheira do Dicionário',
        skillName: 'Flecha de Elemento de Dados',
        attackType: 'ranged',
        spellAnimationName: 'emerald_arrow',
        description: 'Dispara um tiro certeiro guiado pela chave primária que atinge o coração da tabela.',
      },
      3: {
        level: 3,
        title: 'Alquimista Élfica de ITABs',
        skillName: 'Canção do SORT Ordenado',
        attackType: 'magic',
        spellAnimationName: 'nature_surge',
        description: 'Entoa melodias ancestrais que reorganizam milhares de registros em frações de segundo.',
      },
      4: {
        level: 4,
        title: 'Guardiã das Conexões RFC',
        skillName: 'Vinhas da Integração BAPI',
        attackType: 'magic',
        spellAnimationName: 'root_entangle',
        description: 'Brotam vinhas místicas do chão aprisionando o monstro enquanto o processo é comitado.',
      },
      5: {
        level: 5,
        title: 'Mestra Esmeralda S/4HANA',
        skillName: 'Prisma Clean Code',
        attackType: 'magic',
        spellAnimationName: 'aurora_borealis',
        description: 'Cria uma aurora boreal cintilante de construtores modernos que ofusca as trevas do código espaguete.',
      },
      6: {
        level: 6,
        title: 'Sacerdotisa da Tradução SE63',
        skillName: 'Encanto Poliglota',
        attackType: 'magic',
        spellAnimationName: 'prism_burst',
        description: 'Libera partículas prismáticas de luz que adaptam a mensagem para todos os idiomas do mundo.',
      },
      7: {
        level: 7,
        title: 'Alta Arcanista ABAP OO',
        skillName: 'Ascensão da Herança Divina',
        attackType: 'magic',
        spellAnimationName: 'celestial_wrath',
        description: 'Flutua em espirais de luz esmeralda disparando esferas estelares que purificam o sistema.',
      },
    },
  },
  arqueiro: {
    id: 'arqueiro',
    name: 'Arqueiro(a)',
    genderedName: {
      masculino: 'Arqueiro Sniper',
      feminino: 'Arqueira Sniper',
    },
    iconEmoji: '🏹',
    themeColor: '#d97706',
    accentColor: '#fbbf24',
    description: 'Mira telescópica capaz de atingir o registro exato em bases de bilhões de linhas com um único tiro.',
    lore: 'Nunca desperdiça munição e nunca faz um SELECT * desnecessário. Cada disparo tem propósito e alvo fixo.',
    classesByLevel: {
      1: {
        level: 1,
        title: 'Atirador de Fundamentos',
        skillName: 'Disparo de Parâmetro',
        attackType: 'ranged',
        spellAnimationName: 'arrow_shot',
        description: 'Dispara uma flecha certeira no alvo sem desvio.',
      },
      2: {
        level: 2,
        title: 'Sniper Open SQL',
        skillName: 'Tiro Perfurante de Cláusula WHERE',
        attackType: 'ranged',
        spellAnimationName: 'piercing_arrow',
        description: 'Uma flecha veloz que atravessa escudos e atinge diretamente a linha solicitada.',
      },
      3: {
        level: 3,
        title: 'Caçador de Tabelas',
        skillName: 'Chuva de Flechas HASHED',
        attackType: 'ranged',
        spellAnimationName: 'arrow_rain',
        description: 'Lança dezenas de flechas para o céu que caem como tempestade com busca em tempo O(1).',
      },
      4: {
        level: 4,
        title: 'Sentinela Transacional',
        skillName: 'Flecha Trovejante de BAPI',
        attackType: 'ranged',
        spellAnimationName: 'thunder_shot',
        description: 'Combina eletricidade e aço em uma flecha pesada que atordoa o chefão instantaneamente.',
      },
      5: {
        level: 5,
        title: 'Franco-Atirador S/4HANA',
        skillName: 'Disparo Laser @DATA Inline',
        attackType: 'ranged',
        spellAnimationName: 'laser_beam',
        description: 'Um feixe luminoso contínuo disparado do arco que dissolve armaduras antigas.',
      },
      6: {
        level: 6,
        title: 'Guardião de Drivers Spool',
        skillName: 'Voleio de Impressão Rápida',
        attackType: 'ranged',
        spellAnimationName: 'rapid_fire',
        description: 'Sequência veloz de 10 tiros simultâneos desimpedindo a fila de impressão.',
      },
      7: {
        level: 7,
        title: 'Lorde Sniper ABAP OO',
        skillName: 'Flecha do Fim dos DUMPs',
        attackType: 'ranged',
        spellAnimationName: 'god_arrow',
        description: 'Uma flecha colossal de pura luz solar que perfura o cosmos e liquida o chefão de uma só vez.',
      },
    },
  },
  espirito: {
    id: 'espirito',
    name: 'Espírito',
    genderedName: {
      masculino: 'Espírito do Kernel',
      feminino: 'Entidade Cósmica',
    },
    iconEmoji: '✨',
    themeColor: '#06b6d4',
    accentColor: '#67e8f9',
    description: 'Uma manifestação viva de energia pura do SAP Kernel. Imune a erros físicos e dotada de luz transcendental.',
    lore: 'Dizem que este espírito vaga pelos buffers de memória desde o lendário SAP R/3, protegendo os desenvolvedores.',
    classesByLevel: {
      1: {
        level: 1,
        title: 'Chama Etérea',
        skillName: 'Pulso de Memória Limpa',
        attackType: 'magic',
        spellAnimationName: 'spirit_orb',
        description: 'Expande uma onda suave de calor azul que limpa pequenos bugs de sintaxe.',
      },
      2: {
        level: 2,
        title: 'Orbe do Dicionário',
        skillName: 'Resplendor da SE11',
        attackType: 'magic',
        spellAnimationName: 'radiant_burst',
        description: 'Emite um clarão estelar que revela todas as tabelas ocultas.',
      },
      3: {
        level: 3,
        title: 'Entidade de Fluxo',
        skillName: 'Dança das Partículas Hashed',
        attackType: 'magic',
        spellAnimationName: 'cosmic_spiral',
        description: 'Cria um turbilhão cósmico de pontos de luz que manipulam matrizes de memória com graça.',
      },
      4: {
        level: 4,
        title: 'Espírito Transacional',
        skillName: 'Bênção do Commit Estelar',
        attackType: 'magic',
        spellAnimationName: 'holy_aura',
        description: 'Envolve o campo de batalha em um domo sagrado garantindo consistência atômica.',
      },
      5: {
        level: 5,
        title: 'Avatar S/4HANA Cósmico',
        skillName: 'Explosão de Supernova Clean ABAP',
        attackType: 'magic',
        spellAnimationName: 'supernova_burst',
        description: 'Libera a energia estelar de uma estrela que nasce, varrendo todo o código obsoleto do universo.',
      },
      6: {
        level: 6,
        title: 'Guardião dos Símbolos Celestes',
        skillName: 'Prisma das Mil Línguas',
        attackType: 'magic',
        spellAnimationName: 'rainbow_blast',
        description: 'Dispara um raio com as cores do arco-íris transcrevendo formulários para todos os planetas.',
      },
      7: {
        level: 7,
        title: 'Divindade Suprema ABAP OO',
        skillName: 'Colapso Dimensional de Bugs',
        attackType: 'magic',
        spellAnimationName: 'singularity_beam',
        description: 'Abre um portal para o coração da criação SAP banindo o chefão para uma dimensão vazia.',
      },
    },
  },
};

export const ALL_RPG_RACES: RpgRace[] = ['orc', 'mago', 'guerreiro', 'elfo', 'arqueiro', 'espirito'];

export function getRandomRpgRace(): RpgRace {
  const idx = Math.floor(Math.random() * ALL_RPG_RACES.length);
  return ALL_RPG_RACES[idx];
}

export function getRpgClassForLevel(race: RpgRace, level: number): RpgClassInfo {
  const meta = RPG_RACES[race] || RPG_RACES.mago;
  const clampedLevel = Math.max(1, Math.min(7, level));
  return meta.classesByLevel[clampedLevel] || meta.classesByLevel[1];
}
