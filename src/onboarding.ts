export interface TourStep {
  target: string;
  fallbackTarget?: string;
  title: string;
  text: string;
}
const tourCatalog = {
  patients: [
    {
      target: '[data-tour="navigation-toggle"]',
      title: "Seu consultório, por aqui",
      text: "Use o botão de menu para abrir ou recolher a lateral. Pacientes fica em Consultório; seu nome abre Acesso e Perfil profissional, e a engrenagem abre Configurações.",
    },
    {
      target: ".page-heading .primary",
      title: "Comece pelo paciente",
      text: "Clique em Novo paciente para criar um cadastro. Neste teste, use somente dados fictícios.",
    },
    {
      target: ".list-tools",
      title: "Encontre um cadastro",
      text: "Pesquise por número do paciente, nome, CPF ou telefone. Os botões Ativos e Arquivados alternam as listas. Abra um cadastro para acompanhar as prescrições.",
    },
  ],
  "patient-new": [
    {
      target: '[data-tour="identity"] h2',
      title: "Identifique o paciente",
      text: "Preencha nome, data de nascimento e selecione Feminino ou Masculino. Os demais campos são opcionais, inclusive CPF e responsável. Ao salvar, o sistema gera o número de controle do paciente.",
    },
    {
      target: '[data-tour="tags"] h2',
      title: "Organize com tags",
      text: "Use tags para organizar o acompanhamento. Você pode criar uma tag aqui e associá-la ao paciente.",
    },
    {
      target: ".form-actions",
      title: "Salve o cadastro",
      text: "Salvar cadastro confirma os dados. Depois de salvar, você poderá criar a primeira prescrição. Voltar à lista não substitui este salvamento.",
    },
  ],
  patient: [
    {
      target: '[data-tour="identity"] h2',
      title: "Revise os dados",
      text: "Consulte ou ajuste identificação e contato. Use Salvar cadastro para confirmar as alterações.",
    },
    {
      target: ".form-actions",
      title: "Mantenha o histórico",
      text: "Arquivar retira o paciente da lista de ativos e preserva o histórico. Um cadastro arquivado precisa ser restaurado para iniciar novos registros.",
    },
    {
      target: '[data-tour="history"] h2',
      title: "Acompanhe as prescrições",
      text: "Aqui ficam as prescrições do paciente. Rascunhos podem ser editados; uma prescrição finalizada é consultada ou recebe uma nova versão. Para começar, use Nova prescrição.",
    },
  ],
  profile: [
    {
      target: ".form-section h2",
      title: "Sua identificação profissional",
      text: "Preencha os dados profissionais, incluindo CRN e contato. Eles ficam nesta instalação do consultório.",
    },
    {
      target: 'input[type="file"]',
      title: "Personalize quando quiser",
      text: "Logotipo e assinatura são opcionais. Você pode selecionar imagens PNG ou JPEG do computador.",
    },
    {
      target: "form > .primary",
      title: "Confirme as alterações",
      text: "Clique em Salvar perfil para guardar os dados preenchidos.",
    },
  ],
  prescription: [
    {
      target: '[data-tour="plan"] h2',
      title: "Defina o plano",
      text: "Registre o objetivo e as orientações para este paciente.",
    },
    {
      target: '[data-tour="energy"] h2',
      title: "Calcule e aplique as metas",
      text: "Escolha o protocolo e preencha os dados necessários. Calcular e aplicar metas atualiza as metas do rascunho; revise o resultado antes de prosseguir.",
    },
    {
      target: '[data-tour="meals"] h2',
      title: "Monte as refeições",
      text: "Adicione refeições e alimentos. A busca TBCA está disponível dentro de cada refeição; confira quantidade, origem e composição dos itens.",
    },
    {
      target: ".form-actions",
      title: "Guarde e revise o rascunho",
      text: "Salvar rascunho guarda a prescrição. A finalização fica no histórico do paciente: volte ao cadastro quando o plano estiver revisado.",
    },
  ],
  audit: [
    {
      target: ".page-heading",
      title: "Consulte as ações",
      text: "Esta tela mostra metadados das ações realizadas no aplicativo. A consulta inicial cobre os últimos 30 dias.",
    },
    {
      target: ".filter-grid",
      title: "Refine a consulta",
      text: "Combine período, usuário, ação, entidade e resultado. Aplique os filtros para atualizar a lista.",
    },
    {
      target: ".table-wrap, .empty",
      title: "Entenda cada registro",
      text: "Quando houver registros, abra o detalhe de um evento. A auditoria é somente de consulta; não permite editar ou apagar eventos.",
    },
  ],
  backup: [
    {
      target: '[data-tour="backup"] h2',
      title: "Confira sua última cópia",
      text: "Veja a data da última cópia válida e os avisos. O aplicativo também tenta criar um backup no primeiro uso de cada dia.",
    },
    {
      target: '[data-tour="backup"] button',
      title: "Crie uma cópia manual",
      text: "Criar backup permite escolher onde guardar uma cópia recuperável. Guarde também a senha de recuperação definida na preparação da instalação.",
    },
    {
      target: '[data-tour="restore"] h2',
      title: "Restaure somente quando precisar",
      text: "Selecione um backup e informe sua senha de recuperação. Restaurar substitui os cadastros atuais após validação e cópia de segurança. Este tutorial não inicia a restauração.",
    },
  ],
  access: [
    {
      target: ".form-section h2",
      title: "Cuide do seu acesso",
      text: "Para trocar sua senha, informe a atual e uma nova com pelo menos seis caracteres.",
    },
    {
      target: ".form-section .primary",
      title: "Entre com a nova senha",
      text: "Salvar e entrar novamente encerra a sessão para você entrar com a senha nova. Se for administrador, a redefinição do acesso da nutricionista aparece abaixo.",
    },
    {
      target: '[data-tour="logout"]',
      fallbackTarget: '[data-tour="navigation-toggle"]',
      title: "Bloqueie ao sair",
      text: "Abra o menu, se estiver recolhido, e use o ícone Sair da conta quando terminar o trabalho ou deixar o computador.",
    },
  ],
} satisfies Record<string, TourStep[]>;
export type TourId = keyof typeof tourCatalog;
export const tours: Record<TourId, TourStep[]> = tourCatalog;
export function shouldShowTour(id: TourId, seen: string[]) {
  return !seen.includes(id);
}
export function positionTour(
  target: { left: number; top: number; right: number; bottom: number } | null,
  viewport: { width: number; height: number },
  card: { width: number; height: number },
) {
  const margin = 16;
  const maxLeft = Math.max(margin, viewport.width - card.width - margin);
  const maxTop = Math.max(margin, viewport.height - card.height - margin);
  const left = Math.min(maxLeft, Math.max(margin, target?.left ?? maxLeft));
  const below = (target?.bottom ?? margin) + 12;
  const above = (target?.top ?? margin) - card.height - 12;
  const top = below <= maxTop ? below : above >= margin ? above : maxTop;
  return { left, top: Math.min(maxTop, Math.max(margin, top)) };
}
