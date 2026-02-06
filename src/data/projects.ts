import coverRegistroClasses from '../assets/images/registro-classes.png';
import coverAppRastreioVeicular from '../assets/images/registro-classes.png';

// Section = one heading + one or more content blocks (paragraphs / lists)
export type ProjectSection = { heading: string; content: string[] };

export type Project = {
  slug: string;
  title: string;
  shortDescription: string; // For card: from Fast Lane / right column intro
  coverImage?: string; // Optional; placeholder if missing
  /** Role(s), e.g. UX design, UI design, UX Research, QA */
  role?: string;
  /** Platform(s), e.g. iOS and Android */
  platform?: string;
  /** Design tools used, e.g. Figma, Balsamiq, paper */
  designTools?: string;
  fastLane: ProjectSection[]; // Right column only
  slowLane: ProjectSection[]; // Left column only
};

// Helper functions
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}

const projects: Project[] = [
  {
    slug: 'registro-de-classes',
    title: 'Registro de Classes',
    role: 'Product Designer, QA',
    platform: 'iOS and Android',
    designTools: 'Figma, Balsamiq',
    shortDescription:
      'Sistema híbrido (físico + digital) para organizar atividades, presença e evidências de classes progressivas no Clube de Desbravadores Pioneiros do Paraná.',
    coverImage: coverRegistroClasses,
    fastLane: [
      {
        heading: 'CONTEXTO',
        content: [
          'Projeto desenvolvido em 2023 com o Clube de Desbravadores Pioneiros do Paraná, uma organização educacional que trabalha com crianças e adolescentes de 10 a 15 anos por meio de classes progressivas.',
          'Ao longo do ano, os instrutores precisam aplicar atividades, acompanhar o progresso dos alunos e, ao final, comprovar tudo ao órgão regional para que os desbravadores possam ser investidos.',
          'Para isso, eles precisam manter: Presença, Atividades realizadas, Evidências (principalmente fotos), Organização por desbravador e por data.',
        ],
      },
      {
        heading: 'PROBLEMA',
        content: [
          'Os instrutores tinham dificuldade em manter controle e rastreabilidade do que era feito durante o ano, o que gerava dificuldades no momento da prestação de contas.',
          'Cada um usava um sistema próprio (papel, fotos no celular, Google Drive, site, app e cartilha), o que resultava em: Falta de um registro único e confiável, Informações espalhadas e divergentes, Perda de evidências, Muito retrabalho no final do ano.',
          'Esse cenário afetava tanto instrutores experientes quanto novatos, causando insegurança, perda de tempo e risco de falhas na validação oficial.',
        ],
      },
      {
        heading: 'MEU PAPEL',
        content: ['Product Designer, UX/UI Designer, Ux researcher'],
      },
      {
        heading: 'DESCOBERTA',
        content: [
          'Como não existiam dados estruturados sobre o processo atual, conduzi entrevistas qualitativas com 5 instrutores que atuaram no ano anterior e 1 coordenador de classe.',
          'Os objetivos eram: Entender como eles organizavam suas classes, Identificar dores e improvisos, Mapear como faziam a comprovação no final do ano.',
          'Durante as conversas, ficou claro que cada instrutor tinha criado seu próprio "sistema", mas nenhum deles era realmente confiável ou escalável.',
        ],
      },
      {
        heading: 'PERSONAS',
        content: [
          'A partir dos padrões de comportamento identificados, construí duas personas que representavam extremos relevantes do problema: Marcos — instrutor experiente, organizado, mas sobrecarregado pelo volume de informações; Cinthia — instrutora novata, insegura quanto às regras e dependente de fontes oficiais.',
        ],
      },
      {
        heading: 'JORNADA',
        content: [
          'Com base nas entrevistas, mapeei toda a jornada no Miro, analisando: O que cada persona fazia, O que pensava, Onde sentia frustração, Onde existiam oportunidades de melhoria.',
          'Isso evidenciou claramente em quais momentos a organização quebrava — especialmente no pós-aula e no fim do ano.',
        ],
      },
      {
        heading: 'INSIGHTS',
        content: [
          'A síntese da pesquisa mostrou que: Não existia uma fonte única confiável, A organização era manual e frágil, As evidências ficavam espalhadas, O maior estresse acontecia no fechamento do ano.',
          'Além disso: Instrutores novatos buscavam segurança, Instrutores experientes buscavam agilidade e controle.',
        ],
      },
      {
        heading: 'IDEAÇÃO',
        content: [
          'Com os insights em mãos, apresentei os achados à diretoria do clube e ao desenvolvedor do projeto.',
          'Considerando: Orçamento zero, Um único desenvolvedor, Internet instável, Preferência por papel.',
          'Optamos por um MVP híbrido, criando: Um produto físico para o uso em campo, Um sistema digital para registro e rastreabilidade.',
        ],
      },
      {
        heading: 'SOLUÇÃO',
        content: [
          'O guia físico foi criado para organizar o dia a dia da aula. Trazendo uma visão rápida de progresso dos alunos e eliminando divergências entre fontes.',
          'O sistema digital para garantir que nada se perdesse ao longo do ano.',
        ],
      },
      {
        heading: 'PROTOTIPAÇÃO E TESTES',
        content: [
          'O sistema digital foi prototipado no Figma e testado com 3 instrutores, que conseguiram: Registrar atividades, Anexar evidências, Navegar entre datas e desbravadores.',
          'Isso validou o fluxo antes da implementação.',
        ],
      },
      {
        heading: 'RESULTADOS',
        content: [
          'O guia físico já está em uso e trouxe: Melhor organização, Menos retrabalho, Mais confiança no cumprimento dos requisitos.',
          'Os testes do sistema digital confirmaram que o fluxo proposto funciona no contexto real dos instrutores.',
        ],
      },
      {
        heading: 'APRENDIZADOS',
        content: [
          'Este projeto reforçou que: Contexto importa mais que tecnologia, MVP bem definido gera impacto real, Soluções híbridas podem ser mais eficazes, Trabalhar próximo do desenvolvimento evita retrabalho.',
        ],
      },
    ],
    slowLane: [
      {
        heading: 'CONTEXTO',
        content: [
          'O projeto foi desenvolvido em 2023 junto ao Clube de Desbravadores Pioneiros do Paraná, uma organização educacional que atua com crianças e adolescentes de 10 a 15 anos por meio de atividades estruturadas chamadas classes progressivas.',
          'Cada classe possui uma lista oficial de requisitos definidos pela associação. Ao longo do ano, os instrutores precisam aplicar essas atividades, acompanhar o progresso de cada criança e, ao final do ano, comprovar tudo ao órgão regional para que os alunos possam ser oficialmente investidos.',
          'Na prática, isso significa que os instrutores precisam manter: Registro de presença, Registro de atividades realizadas, Evidências (principalmente fotos), Organização por desbravador e por data.',
        ],
      },
      {
        heading: 'PROBLEMA',
        content: [
          'Foi identificado que os instrutores tinham grande dificuldade em manter o controle e a rastreabilidade das atividades ao longo do ano, o que gerava dificuldades significativas no momento da prestação de contas.',
          'Cada instrutor havia criado sua própria forma de organização, combinando: Anotações em papel, Fotos no celular, Pastas no Google Drive, Informações do site, do aplicativo e da cartilha oficial.',
          'As principais dores eram: Falta de um sistema único para registrar atividades, presença e evidências, Dependência de anotações em papel, fotos soltas e serviços de nuvem pouco organizados, Divergência entre as informações do site, do aplicativo e das cartilhas oficiais, Retrabalho intenso no final do ano para reunir tudo o que havia sido feito.',
          'Esse cenário afetava tanto instrutores experientes quanto novatos, gerando insegurança, perda de tempo e risco de não conseguir comprovar corretamente o cumprimento das classes.',
        ],
      },
      {
        heading: 'MEU PAPEL',
        content: [
          'Atuei como a única Product Designer do time, sendo responsável por: Planejar e conduzir a pesquisa, Sintetizar os insights, Definir a estratégia de solução, Criar os artefatos físicos e digitais, Prototipar, testar e iterar.',
          'O time contou também com um desenvolvedor front-end voluntário.',
        ],
      },
      {
        heading: 'DESCOBERTA',
        content: [
          'No início do projeto, mapeei os principais perfis envolvidos no processo: Usuários primários — Instrutores de classe, Regionais (responsáveis pela validação final), Stakeholders — Diretoria do Clube de Desbravadores, Coordenadores de classe, Desbravadores.',
          'Esse mapeamento foi essencial para entender que o produto precisava atender não apenas quem executa as atividades, mas também quem audita e valida o processo no final do ano.',
        ],
      },
      {
        heading: 'ENTREVISTAS DE PROFUNDIDADE',
        content: [
          'Como não existiam dados estruturados sobre o processo atual, conduzi entrevistas qualitativas para entender como os instrutores realmente trabalhavam.',
          'Objetivos da pesquisa: Entender como os instrutores organizavam suas classes no ano anterior, Identificar dores, improvisos e riscos no processo, Mapear como era feita a documentação e a comprovação das atividades.',
          'Perfil de recrutamento: 5 instrutores responsáveis por classes do ano anterior, sendo 3 experientes e 2 novatos, 1 coordenador de classe.',
          'Tópicos abordados: Como escolhiam a fonte oficial dos requisitos (cartilha, app ou site), Como registravam presença, atividades e progresso dos desbravadores, Como lidavam com fotos e evidências, Como funcionava a entrega final ao regional, Nível de familiaridade com ferramentas digitais e internet durante as reuniões.',
          'Essas entrevistas trouxeram à tona um padrão claro: Cada instrutor havia criado seu próprio sistema improvisado, nenhum realmente confiável e escalável.',
        ],
      },
      {
        heading: 'PERSONAS',
        content: [
          'A partir dos padrões de comportamento identificados, construí duas personas que representavam extremos relevantes do problema: Marcos — instrutor experiente, organizado, mas sobrecarregado pelo volume de informações; Cinthia — instrutora novata, insegura quanto às regras e dependente de fontes oficiais.',
          'Essas personas foram utilizadas como referência contínua durante todo o processo de design para validar decisões e priorizações.',
        ],
      },
      {
        heading: 'JORNADA DO USUÁRIO',
        content: [
          'Com base nas entrevistas, mapeei a jornada completa de cada persona, desde o planejamento das aulas até a entrega da documentação ao regional.',
          'Utilizei o Miro para estruturar: Ações, Pensamentos, Emoções, Pontos de fricção, Oportunidades de melhoria.',
          'As jornadas de Marcos (azul) e Cinthia (rosa) permitiram visualizar claramente onde: O esforço era maior, Os erros aconteciam, A insegurança surgia.',
          'A partir desse mapa, ficaram evidentes oportunidades para: Reduzir retrabalho, Aumentar previsibilidade, Melhorar a rastreabilidade das informações.',
        ],
      },
      {
        heading: 'INSIGHTS',
        content: [
          'A síntese da pesquisa revelou alguns padrões críticos: Os instrutores não confiavam em uma única fonte oficial de requisitos (site, app ou cartilha), A maior parte da organização acontecia de forma manual e fragmentada, Fotos e evidências ficavam espalhadas em celulares, WhatsApp e nuvem, O maior pico de estresse acontecia no final do ano, quando tudo precisava ser comprovado.',
          'Além disso, ficou claro que: Instrutores novatos buscavam segurança e orientação, Instrutores experientes buscavam velocidade e controle.',
          'Esses dois perfis tinham necessidades diferentes, mas compartilhavam o mesmo risco: não conseguir comprovar corretamente o que foi feito.',
        ],
      },
      {
        heading: 'IDEAÇÃO',
        content: [
          'Com os insights em mãos, apresentei os achados à diretoria do clube e ao desenvolvedor do projeto.',
          'O processo de ideação considerou três restrições fundamentais: Orçamento zero, Equipe técnica limitada (um desenvolvedor voluntário), Contexto de uso com internet instável e preferência por papel.',
          'A partir disso, decidimos trabalhar com um MVP híbrido, composto por: Um artefato físico de baixo custo e alta adoção, Um sistema digital simples, focado em registro e rastreabilidade.',
          'Essa abordagem permitiria: Gerar valor imediato, Reduzir risco de adoção, Evoluir o produto digital de forma incremental.',
        ],
      },
      {
        heading: 'SOLUÇÃO',
        content: [
          'PRODUTO FÍSICO — GUIA DE CLASSE: O guia de classe foi desenhado para ser a fonte primária de organização durante as aulas. Principais características: Registro de dois desbravadores por folha, Visualização clara dos requisitos concluídos e pendentes, Uso das cores oficiais da Associação dos Desbravadores, Estrutura compatível com impressão em A4 e uso em pastas.',
          'Esse artefato: Dá segurança para instrutores novatos, eliminando divergências entre fontes, Dá visão rápida de progresso para instrutores experientes, Funciona sem depender de internet ou tecnologia.',
          'PRODUTO DIGITAL — SISTEMA DE REGISTRO: O produto digital foi pensado como o complemento pós-aula. Seu foco é: Centralizar fotos, datas, atividades e presença, Organizar automaticamente as informações por classe e desbravador, Gerar uma base confiável para prestação de contas ao regional.',
          'O fluxo foi desenhado para funcionar principalmente em mobile, considerando o uso em campo pelos instrutores.',
        ],
      },
      {
        heading: 'WIREFRAMES',
        content: [
          'Antes de partir para alta fidelidade, alinhei as possibilidades técnicas com o desenvolvedor. Com isso: Listei as funcionalidades de cada tela, Priorizei apenas o que era viável para o MVP, Desenhei wireframes manuais para acelerar iteração.',
          'Essa etapa evitou desperdício de tempo em soluções que não poderiam ser implementadas.',
        ],
      },
      {
        heading: 'PROTOTIPAÇÃO E TESTES',
        content: [
          'O protótipo navegável foi desenvolvido no Figma, seguindo: As cores oficiais de cada classe, A lógica validada nos wireframes.',
          'Com o protótipo, conduzi testes de usabilidade com 3 instrutores, que validaram: Clareza do fluxo de registro, Facilidade de anexar evidências, Entendimento da progressão das classes.',
          'Os testes resultaram em ajustes de navegação e hierarquia de informação antes do início do desenvolvimento.',
        ],
      },
      {
        heading: 'RESULTADOS',
        content: [
          'Embora o sistema digital ainda esteja em desenvolvimento, o produto físico (guia de classe) já foi implementado e passou a ser utilizado pelos instrutores.',
          'A partir da observação em campo e dos feedbacks recebidos, foi possível identificar impactos claros: Redução significativa das reclamações relacionadas à organização das classes, Maior clareza visual sobre o progresso de cada desbravador ao longo do ano, Menos retrabalho na escolha de atividades, já que os requisitos pendentes ficam evidentes, Maior segurança dos instrutores em relação ao cumprimento dos requisitos oficiais.',
          'Além disso, os testes de usabilidade do produto digital com três usuários validaram: A facilidade de registrar atividades e anexar evidências, A clareza na visualização por data e por desbravador, A adequação do fluxo ao contexto real de uso durante e após as reuniões.',
          'Os testes permitiram ajustes antes da implementação, reduzindo o risco de retrabalho técnico e aumentando a confiança do time no MVP definido.',
        ],
      },
      {
        heading: 'APRENDIZADOS',
        content: [
          'Este projeto consolidou princípios que hoje guiam minha atuação como Product Designer: Design precisa se adaptar ao contexto, não o contrário, especialmente em ambientes com baixa infraestrutura, MVP bem definido gera impacto real mais rápido do que soluções complexas e difíceis de adotar, Soluções híbridas (físico + digital) podem ser mais eficazes do que produtos exclusivamente digitais, Envolver desenvolvimento desde o início reduz desperdício, aumenta viabilidade e acelera entrega.',
          'Esse projeto reforçou minha capacidade de conectar pesquisa, decisão de produto e execução de design para resolver problemas reais, mesmo em cenários de alta restrição.',
        ],
      },
    ],
  },
  {
    slug: 'app-rastreio-veicular',
    title: 'Aplicativo de Rastreio Veicular',
    shortDescription:
      'Reestruturação completa da arquitetura de informação e da experiência mobile de um sistema de rastreamento e gestão de frotas durante a migração para Flutter.',
    coverImage: coverAppRastreioVeicular,
    role: 'Product Designer, UX Researcher, QA',
    platform: 'iOS and Android',
    designTools: 'Figma, Balsamiq',
    fastLane: [
      {
        heading: 'CONTEXTO',
        content: [
          'Projeto desenvolvido para um sistema mobile de rastreamento e gestão de frotas utilizado por empresas para monitorar veículos, enviar comandos e acompanhar operações em tempo real.',
          'O produto principal da empresa era um software desktop robusto, enquanto os aplicativos móveis funcionavam como uma extensão operacional.',
          'Com o tempo, os apps cresceram de forma reativa, acumulando funcionalidades sem uma visão clara de arquitetura.',
        ],
      },
      {
        heading: 'PROBLEMA',
        content: [
          'Android e iOS evoluíram de formas diferentes, acumulando regras conflitantes, navegação inconsistente e múltiplos caminhos para as mesmas ações.',
          'A migração para Flutter deixou claro que não era possível apenas recriar telas sem reorganizar o sistema.',
          'Qualquer erro de UX impactaria diretamente operações reais dos clientes.',
        ],
      },
      {
        heading: 'MEU PAPEL',
        content: [
          'Atuei como única Product Designer, responsável por pesquisa, arquitetura de informação, fluxos, prototipação e validação.',
          'Trabalhei em parceria com um Product Manager e dois desenvolvedores, apresentando decisões diretamente ao cliente.',
        ],
      },
      {
        heading: 'PESQUISA',
        content: [
          'Combinei desk research com avaliações da App Store e Play Store e entrevistas de profundidade com usuários de empresas de diferentes portes.',
          'Os dados mostraram que o problema não era falta de funcionalidades, mas excesso de complexidade mal organizada.',
        ],
      },
      {
        heading: 'ARQUITETURA',
        content: [
          'Criei sitemaps completos de Android e iOS para tornar a complexidade visível.',
          'A partir disso, desenvolvi um novo sitemap unificado, organizado por objetivos do usuário.',
        ],
      },
      {
        heading: 'SOLUÇÃO',
        content: [
          'Redução de profundidade de navegação, eliminação de redundâncias e criação de padrões reutilizáveis.',
          'Nova base de UX preparada para crescimento contínuo.',
        ],
      },
      {
        heading: 'RESULTADOS',
        content: [
          'Redução de aproximadamente 32% no número total de telas.',
          'Redução da profundidade média de navegação de 5 para 3 níveis.',
          'Unificação dos fluxos entre Android e iOS.',
        ],
      },
    ],
    slowLane: [
      {
        heading: 'CONTEXTO DO PRODUTO',
        content: [
          'O projeto foi desenvolvido para um sistema mobile de rastreamento e gestão de frotas, utilizado por empresas para monitorar veículos, enviar comandos e analisar dados operacionais em tempo real.',
          'O produto principal era um software desktop estável, enquanto os aplicativos móveis funcionavam como extensão operacional.',
          'Ao longo dos anos, os apps cresceram de forma reativa, recebendo funcionalidades conforme pedidos de clientes, sem uma visão clara de arquitetura.',
        ],
      },
      {
        heading: 'PROBLEMA DE PRODUTO',
        content: [
          'Android e iOS possuíam estruturas de navegação diferentes, regras inconsistentes e múltiplos caminhos para as mesmas ações.',
          'O mobile passou a concentrar lógica própria, porém fragmentada e difícil de manter.',
          'A migração para Flutter evidenciou que o sistema precisava ser reorganizado sem quebrar o que já funcionava.',
        ],
      },
      {
        heading: 'MEU PAPEL NO TIME',
        content: [
          'Atuei como única Product Designer, responsável por toda a estratégia de UX: pesquisa, arquitetura de informação, definição de fluxos, prototipação e validação.',
          'Trabalhei em conjunto com um Product Manager e dois desenvolvedores, apresentando mapas e decisões diretamente ao cliente.',
        ],
      },
      {
        heading: 'ENTENDENDO O LEGADO',
        content: [
          'Criei dois sitemaps completos, um para Android e outro para iOS, mapeando todas as telas, caminhos e dependências.',
          'Quando analisados lado a lado, ficou claro que o mesmo produto possuía duas arquiteturas diferentes.',
          'Esses mapas revelaram fluxos duplicados, telas redundantes, regras conflitantes e pontos de alta carga cognitiva.',
        ],
      },
      {
        heading: 'PESQUISA COM USUÁRIOS',
        content: [
          'Combinei desk research com avaliações da App Store e Play Store e entrevistas de profundidade com usuários.',
          'Foram entrevistados usuários de empresas de grande porte, com uso intenso do sistema, e de menor porte, com uso mais leve.',
          'Os feedbacks foram agrupados em temas como mapas, comandos, relatórios, jornada do motorista, permissões e desempenho.',
        ],
      },
      {
        heading: 'SÍNTESE E PRIORIZAÇÃO',
        content: [
          'Os problemas foram organizados por frequência, impacto operacional e risco para o negócio.',
          'O MVP focou nos fluxos críticos: localizar veículos, enviar comandos, acessar relatórios e navegar no mapa.',
          'Funcionalidades periféricas foram mapeadas, mas ficaram fora do escopo inicial.',
        ],
      },
      {
        heading: 'NOVA ARQUITETURA DE INFORMAÇÃO',
        content: [
          'Desenhei um novo sitemap unificado, estruturado por objetivos do usuário, e não pela herança do legado.',
          'A nova arquitetura reduziu profundidade de navegação, eliminou redundâncias e criou padrões reutilizáveis.',
          'Essa estrutura foi validada com o cliente antes do início do design visual.',
        ],
      },
      {
        heading: 'PROTOTIPAÇÃO',
        content: [
          'Os fluxos foram inicialmente trabalhados em wireframes de baixa fidelidade no Balsamiq.',
          'Essa etapa permitiu validar regras, exceções e navegação sem que decisões visuais mascarassem problemas estruturais.',
          'Com os fluxos aprovados, o projeto seguiu para prototipação em alta fidelidade no Figma.',
        ],
      },
      {
        heading: 'DESIGN DA INTERFACE',
        content: [
          'Sem um design system formal, analisei o software desktop, o site institucional e a identidade da marca.',
          'Criei uma base visual consistente que respeitava o legado, mas organizava a interface de forma mais clara e hierárquica.',
          'O foco foi reduzir ruído cognitivo em um sistema com alta densidade de dados.',
        ],
      },
      {
        heading: 'RESULTADOS',
        content: [
          'Redução de aproximadamente 32% no número total de telas.',
          'Redução da profundidade média de navegação de 5 para 3 níveis nos fluxos principais.',
          'Eliminação de fluxos duplicados entre Android e iOS.',
          'Criação de uma base de UX preparada para crescimento contínuo.',
        ],
      },
      {
        heading: 'APRENDIZADOS',
        content: [
          'Arquitetura da informação é uma decisão de produto, não apenas organização de telas.',
          'Pedidos isolados de usuários precisam ser traduzidos em soluções sistêmicas.',
          'Escalabilidade começa no design: quando a base é sólida, o produto pode crescer sem voltar ao caos.',
        ],
      },
    ],
  },
];

export default projects;
