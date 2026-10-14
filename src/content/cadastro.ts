/**
 * Textos das landing pages de cadastro (/cadastro/padres, /cadastro/agencias, /cadastro/formadores, /cadastro/peregrinos).
 * Redação conforme o briefing; qualquer promessa comercial (comissão, gratuidade, exclusividade, preços)
 * depende de aprovação e NÃO deve ser acrescentada aqui sem validação da Via Lumina.
 */

export type Benefit = { icon: 'planning' | 'care' | 'destinations' | 'experience' | 'routes' | 'logistics' | 'support' | 'agency' | 'portfolio' | 'consultant'; title: string; text: string }
export type Step = { n: string; title: string; text: string }
export type FaqItem = { q: string; a: string }

export const PRIEST_PAGE = {
  slug: 'padres',
  path: '/cadastro/padres',
  crumb: 'Padres Parceiros',
  meta: {
    title: 'Seja um Padre Parceiro',
    description:
      'Conheça as possibilidades de parceria com a Via Lumina Viagens para organizar ou acompanhar peregrinações com a sua comunidade. Cadastre seu interesse e converse com nossa equipe.',
  },
  hero: {
    eyebrow: 'Parceria com sacerdotes',
    title: 'Sua missão pode levar a fé ainda mais longe.',
    text: 'A Via Lumina Viagens une espiritualidade, experiência e cuidado para transformar peregrinações em jornadas significativas. Conheça as possibilidades de parceria e descubra como podemos caminhar ao lado da sua comunidade.',
    cta: 'Quero conhecer a parceria',
  },
  about: {
    title: 'Uma peregrinação é também uma oportunidade de evangelizar.',
    paragraphs: [
      'Para muitas pessoas, visitar um Santuário, participar de uma celebração em um lugar sagrado ou percorrer caminhos de fé, representa um momento especial na caminhada espiritual.',
      'A Via Lumina compreende a importância dessa experiência e trabalha para oferecer organização, suporte e cuidado durante cada etapa da jornada.',
      'Nosso propósito é contribuir para que sacerdotes e comunidades possam vivenciar peregrinações com significado, acolhimento e tranquilidade.',
    ],
  },
  benefits: {
    title: 'Experiência e estrutura a serviço de cada peregrinação.',
    items: [
      { icon: 'planning', title: 'Planejamento especializado', text: 'Roteiros organizados com atenção aos deslocamentos, hospedagens, visitas e necessidades do grupo.' },
      { icon: 'care', title: 'Acompanhamento e cuidado', text: 'Estrutura de apoio durante a peregrinação, permitindo uma experiência mais tranquila e organizada.' },
      { icon: 'destinations', title: 'Destinos de espiritualidade', text: 'Peregrinações a Santuários e lugares de relevância religiosa no Brasil e no exterior.' },
      { icon: 'experience', title: 'Experiência no turismo', text: 'A Via Lumina integra um grupo com mais de quatro décadas de trajetória no setor turístico.' },
    ] satisfies Benefit[],
  },
  steps: {
    title: 'O primeiro passo é uma conversa.',
    items: [
      { n: '01', title: 'Conte-nos sobre sua comunidade', text: 'Preencha o cadastro e compartilhe informações sobre sua atuação pastoral e interesse em peregrinações.' },
      { n: '02', title: 'Conheça nossas possibilidades', text: 'A equipe da Via Lumina entra em contato para apresentar destinos, formatos de viagem e possibilidades de organização.' },
      { n: '03', title: 'Planeje uma experiência de fé', text: 'Havendo interesse e condições adequadas, a proposta poderá ser construída de acordo com as características e necessidades do grupo.' },
    ] satisfies Step[],
  },
  form: {
    title: 'Vamos conversar sobre sua próxima peregrinação?',
    description: 'Preencha seus dados para que nossa equipe conheça sua atuação e entre em contato.',
    submit: 'Enviar meu interesse',
    success: {
      title: 'Cadastro recebido',
      text: 'Recebemos seu cadastro. Agradecemos seu interesse em conhecer a Via Lumina Viagens. Nossa equipe poderá entrar em contato pelos canais informados.',
    },
  },
  faq: {
    title: 'Perguntas frequentes',
    items: [
      { q: 'Preciso ter um grupo formado para fazer o cadastro?', a: 'Não. O cadastro também pode ser utilizado para conhecer possibilidades de peregrinação e conversar sobre uma futura organização.' },
      { q: 'É possível conversar sobre destinos específicos?', a: 'Sim. Informe os destinos de interesse para que a equipe possa avaliar as possibilidades disponíveis.' },
      { q: 'O cadastro significa que a parceria está confirmada?', a: 'Não. O cadastro representa uma manifestação de interesse. Qualquer parceria dependerá de avaliação e alinhamento posterior.' },
    ] satisfies FaqItem[],
  },
}

export const LEADER_PAGE = {
  slug: 'formadores',
  path: '/cadastro/formadores',
  crumb: 'Formadores de Grupo',
  meta: {
    title: 'Seja um Formador de Grupo',
    description:
      'Você é uma liderança dentro da igreja e tem condições de reunir um grupo de peregrinos? Conheça a Via Lumina Viagens, cadastre seu interesse e converse com nossa equipe.',
  },
  hero: {
    eyebrow: 'Para lideranças da comunidade',
    title: 'Reúna seu grupo e caminhe com a Via Lumina.',
    text: 'Se você é uma pessoa de referência na sua igreja, comunidade ou movimento e sonha em levar pessoas a um lugar sagrado, a Via Lumina Viagens cuida da organização para que você possa se dedicar ao grupo.',
    cta: 'Quero formar um grupo',
  },
  about: {
    title: 'Quem reúne as pessoas também faz a peregrinação acontecer.',
    paragraphs: [
      'Muitas peregrinações nascem da iniciativa de alguém que a comunidade já conhece e em quem confia: uma liderança de pastoral, de movimento, de grupo de oração ou um comunicador que caminha com as pessoas.',
      'Se esse é o seu caso, podemos conversar sobre como reunir um grupo e viver essa jornada com planejamento, acompanhamento e cuidado em cada etapa.',
      'Não é preciso ser padre ou pastor. O que importa é o desejo de conduzir pessoas ao encontro com Deus.',
    ],
  },
  benefits: {
    title: 'Você reúne as pessoas. Nós cuidamos do restante.',
    items: [
      { icon: 'planning', title: 'Planejamento especializado', text: 'Roteiros organizados com atenção aos deslocamentos, hospedagens, visitas e às necessidades do grupo.' },
      { icon: 'support', title: 'Suporte durante a viagem', text: 'Estrutura de apoio e assistência durante toda a peregrinação, conforme cada pacote.' },
      { icon: 'destinations', title: 'Destinos de espiritualidade', text: 'Peregrinações a Santuários e lugares de relevância religiosa no Brasil e no exterior.' },
      { icon: 'experience', title: 'Experiência no turismo', text: 'A Via Lumina integra um grupo com mais de quatro décadas de trajetória no setor turístico.' },
    ] satisfies Benefit[],
  },
  steps: {
    title: 'Do primeiro contato à saída do grupo.',
    items: [
      { n: '01', title: 'Conte-nos sobre você e sua comunidade', text: 'Preencha o cadastro com sua atuação e com o grupo que você imagina reunir.' },
      { n: '02', title: 'Converse com nossa equipe', text: 'A equipe da Via Lumina entra em contato para entender seu objetivo e apresentar destinos e formatos de viagem.' },
      { n: '03', title: 'Construa a peregrinação do seu grupo', text: 'Havendo interesse e condições adequadas, a proposta poderá ser desenhada de acordo com as características do grupo.' },
    ] satisfies Step[],
  },
  form: {
    title: 'Vamos conversar sobre o seu grupo?',
    description: 'Preencha seus dados para que nossa equipe conheça sua atuação e entre em contato. O cadastro é uma manifestação de interesse e não representa parceria confirmada.',
    submit: 'Enviar meu interesse',
    success: {
      title: 'Cadastro recebido',
      text: 'Recebemos seu cadastro. Agradecemos seu interesse em reunir um grupo com a Via Lumina Viagens. Nossa equipe poderá entrar em contato pelos canais informados.',
    },
  },
  faq: {
    title: 'Perguntas frequentes',
    items: [
      { q: 'Preciso ser padre ou pastor para me cadastrar?', a: 'Não. Este cadastro é para lideranças e pessoas de referência na comunidade que têm condições de reunir um grupo de peregrinos.' },
      { q: 'Já preciso ter um grupo formado?', a: 'Não. Você pode se cadastrar para conhecer as possibilidades e conversar sobre como reunir o grupo.' },
      { q: 'O cadastro significa que a parceria está confirmada?', a: 'Não. O cadastro representa uma manifestação de interesse. Qualquer parceria dependerá de avaliação e alinhamento posterior com a equipe.' },
    ] satisfies FaqItem[],
  },
}

export const AGENCY_PAGE = {
  slug: 'agencias',
  path: '/cadastro/agencias',
  crumb: 'Agências Parceiras',
  meta: {
    title: 'Seja uma Agência Parceira',
    description:
      'Conheça a Via Lumina Viagens, operadora especializada em peregrinações e experiências de fé, e descubra oportunidades de colaboração para a sua agência.',
  },
  hero: {
    eyebrow: 'Parceria com agências',
    title: 'Amplie as possibilidades da sua agência com o turismo religioso.',
    text: 'Conheça a Via Lumina Viagens e descubra oportunidades de colaboração com uma operadora especializada em peregrinações e experiências de fé.',
    cta: 'Quero ser uma agência parceira',
  },
  about: {
    title: 'Conecte seus clientes a experiências que vão além dos destinos.',
    paragraphs: [
      'O turismo religioso reúne viajantes que procuram espiritualidade, cultura, história e experiências significativas.',
      'A Via Lumina Viagens desenvolve peregrinações com foco na organização, no acompanhamento e no cuidado em cada etapa.',
      'Ao conhecer nossa proposta, sua agência poderá avaliar oportunidades para ampliar seu portfólio e atender clientes interessados nesse segmento.',
    ],
  },
  benefits: {
    title: 'Especialização para desenvolver experiências de fé.',
    items: [
      { icon: 'routes', title: 'Roteiros de turismo religioso', text: 'Viagens para destinos de reconhecida importância espiritual, no Brasil e no exterior.' },
      { icon: 'logistics', title: 'Planejamento e logística', text: 'Organização de serviços turísticos, deslocamentos e experiências programadas.' },
      { icon: 'support', title: 'Atendimento e suporte', text: 'Estrutura de acompanhamento e assistência durante as peregrinações, conforme cada pacote.' },
      { icon: 'experience', title: 'Experiência no setor turístico', text: 'Conhecimento construído ao longo de mais de quatro décadas de atuação do grupo.' },
    ] satisfies Benefit[],
  },
  audience: {
    title: 'Sua agência também pode explorar o universo das peregrinações.',
    items: [
      { icon: 'agency', title: 'Agências que já trabalham com turismo religioso', text: 'Para empresas interessadas em conhecer novos roteiros e possibilidades de colaboração.' },
      { icon: 'portfolio', title: 'Agências que desejam ampliar seu portfólio', text: 'Para negócios que identificam oportunidades em viagens de fé e destinos religiosos.' },
      { icon: 'consultant', title: 'Consultores e profissionais do turismo', text: 'Para profissionais que desejam apresentar sua atuação e avaliar possibilidades de relacionamento comercial.' },
    ] satisfies Benefit[],
  },
  steps: {
    title: 'Simples para iniciar, estratégico para crescer.',
    items: [
      { n: '01', title: 'Cadastre sua agência', text: 'Compartilhe os dados da empresa e do responsável comercial.' },
      { n: '02', title: 'Apresente seu perfil', text: 'Informe a área de atuação, experiência e interesse no segmento.' },
      { n: '03', title: 'Converse com nossa equipe', text: 'A Via Lumina poderá entrar em contato para conhecer a empresa e discutir eventuais possibilidades comerciais.' },
    ] satisfies Step[],
  },
  form: {
    title: 'Vamos explorar novas oportunidades juntos?',
    description: 'Cadastre sua agência para que nossa equipe comercial conheça sua atuação. O cadastro é uma manifestação de interesse e não representa credenciamento.',
    submit: 'Cadastrar minha agência',
    success: {
      title: 'Cadastro recebido',
      text: 'Cadastro recebido. Obrigado pelo interesse em conhecer as oportunidades de parceria com a Via Lumina Viagens. Nossa equipe poderá entrar em contato para dar continuidade à conversa.',
    },
  },
  faq: {
    title: 'Perguntas frequentes',
    items: [
      { q: 'Minha agência precisa atuar exclusivamente com turismo religioso?', a: 'Não. O cadastro também é destinado a empresas que desejam conhecer o segmento.' },
      { q: 'As condições comerciais são iguais para todas as agências?', a: 'As condições de eventual parceria deverão ser apresentadas e confirmadas pela equipe comercial.' },
      { q: 'O cadastro garante credenciamento?', a: 'Não. A aprovação de uma parceria está sujeita à análise e aos critérios comerciais da Via Lumina.' },
    ] satisfies FaqItem[],
  },
}

export const PILGRIM_PAGE = {
  slug: 'peregrinos',
  path: '/cadastro/peregrinos',
  crumb: 'Cadastre-se',
  meta: {
    title: 'Faça Parte da Via Lumina',
    description:
      'Cadastre-se para conhecer as peregrinações da Via Lumina Viagens, descobrir destinos sagrados e receber informações sobre experiências que unem fé, cultura e espiritualidade.',
  },
  hero: {
    eyebrow: 'Faça parte da Via Lumina',
    title: 'Sua próxima jornada de fé pode começar aqui.',
    text: 'Cadastre-se como cliente e entre para a nossa base de peregrinos: conheça as peregrinações da Via Lumina Viagens, descubra destinos sagrados e receba informações sobre experiências de fé, cultura e espiritualidade.',
    cta: 'Quero me cadastrar como cliente',
  },
  about: {
    title: 'Existem destinos que marcam a memória. Outros também tocam a alma.',
    paragraphs: [
      'Uma peregrinação pode ser a oportunidade de conhecer lugares que fazem parte da história da fé, vivenciar momentos de oração e compartilhar experiências com pessoas que caminham com o mesmo propósito.',
      'A Via Lumina Viagens desenvolve roteiros para tornar essas jornadas especiais, com planejamento, acompanhamento e atenção aos detalhes.',
    ],
  },
  destinations: {
    title: 'Caminhos de fé pelo Brasil e pelo mundo.',
    items: [
      { title: 'Aparecida e destinos religiosos do Brasil', text: 'Conheça lugares de devoção, história e espiritualidade em roteiros cuidadosamente organizados.', image: '/assets/destinos/aparecida-agosto-2027/hero.webp', alt: 'Santuário Nacional de Aparecida, no interior de São Paulo', href: '/destinos?regiao=brasil' },
      { title: 'Portugal, França e Espanha', text: 'Descubra Santuários e cidades ligados à tradição cristã europeia.', image: '/assets/destinos/portugal-e-franca/galeria-01-santuario-de-fatima.webp', alt: 'Vista aérea do Santuário de Fátima, em Portugal', href: '/destinos?regiao=europa' },
      { title: 'Itália e Vaticano', text: 'Explore lugares marcantes da história da Igreja e da espiritualidade cristã.', image: '/assets/destinos/portugal-italia-vaticano/hero.webp', alt: 'Basílica de São Pedro e a cidade do Vaticano', href: '/destinos?regiao=europa' },
      { title: 'México e Guadalupe', text: 'Conheça uma das mais importantes expressões da devoção mariana nas Américas.', image: '/assets/destinos/mexico-guadalupe-cancun-2027/hero.webp', alt: 'Basílica de Nossa Senhora de Guadalupe, na Cidade do México, ao entardecer', href: '/destinos?regiao=america-do-norte' },
      { title: 'Egito e Terra Santa', text: 'Uma oportunidade de conhecer cenários relacionados à história bíblica e à tradição cristã, conforme a disponibilidade de roteiros.', image: '/assets/destinos/egito-terra-santa/hero.webp', alt: 'Mosteiro construído na encosta de uma montanha no deserto da Terra Santa', href: '/destinos?regiao=oriente-medio-africa' },
    ],
  },
  care: {
    title: 'Cuidado em cada etapa da sua peregrinação.',
    // Benefícios já divulgados em /quem-somos e na homepage (SAFETY). Não acrescentar garantias novas.
    items: ['planejamento', 'guia', 'suporte', 'hospedagem', 'logistica', 'experiencia'] as const,
  },
  form: {
    title: 'Quer receber informações sobre nossas próximas peregrinações?',
    description:
      'Este é o cadastro de clientes da Via Lumina: ao preencher, você entra para a nossa base de peregrinos e passa a receber roteiros e informações de acordo com seus interesses. Seus dados só são usados com a sua ciência e autorização, e você confirma isso antes de enviar.',
    submit: 'Cadastrar-me como cliente',
    success: {
      title: 'Cadastro realizado com sucesso!',
      text: 'Cadastro realizado com sucesso! Agradecemos seu interesse na Via Lumina Viagens. Você poderá receber informações sobre peregrinações de acordo com suas preferências e autorizações.',
    },
  },
  community: {
    title: 'Acompanhe de perto: entre para a comunidade Via Lumina.',
    text: 'Depois do cadastro, convidamos você a participar da nossa comunidade no WhatsApp. É lá que compartilhamos novidades, saídas e avisos das peregrinações e que nossa equipe fica mais perto de você.',
    cta: 'Entrar na comunidade',
  },
  finalCta: {
    title: 'Os caminhos mais especiais começam com uma decisão.',
    text: 'Explore nossos roteiros e descubra possibilidades de viver uma jornada de fé, descoberta e espiritualidade.',
    cta: 'Explorar todos os destinos',
  },
}

/** Hub /cadastro: porta de entrada para quem chega sem saber qual cadastro escolher. */
export const HUB = {
  path: '/cadastro',
  crumb: 'Cadastro',
  meta: {
    title: 'Cadastre-se e Parcerias',
    description: 'Cadastre-se na Via Lumina Viagens como peregrino, padre, formador de grupo ou agência parceira e receba contato da nossa equipe.',
  },
  title: 'Cadastre-se e conheça as parcerias',
  text: 'Escolha o cadastro que melhor representa você. Cada um leva a uma página com informações e um formulário próprio.',
}
