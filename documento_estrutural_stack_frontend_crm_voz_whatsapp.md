# Documento Estrutural de Stack Frontend

## CRM Imobiliário Assistido por Voz, WhatsApp, IA e CMS compartilhado

### Objetivo
Definir a stack frontend para o website e app Capacitor do CRM imobiliário assistido por voz, mantendo o CMS existente como fonte compartilhada de dados e implementando o design mobile com cards primeiro e microfone central no tab navigator.

### Stack recomendada
- JavaScript modular com evolução gradual para TypeScript.
- Vite ou build estático para web.
- Capacitor para app mobile usando o mesmo CMS e componentes.
- Componentes imperativos com `next(input)`.
- Stores por domínio: `cmsStore`, `crmStore`, `whatsappStore`, `voiceStore`, `authStore`.
- Socket.IO para eventos WhatsApp em tempo real.
- `fetch` + adapters para CMS, bridge e IA.
- MediaRecorder + Web Speech API/plugin nativo para voz.
- `speechSynthesis` para reprodução de voz no app; arquivo nativo/local para envio de áudio gerado.

### Hierarquia de design
1. Header com título, notificações e avatar.
2. Cards principais: Imóveis, Proprietários, Corretores, Compradores/Locatários.
3. Cards backoffice: Contratos, Comprobatórios, Pessoais.
4. Painel secundário do assistente por voz.
5. Atividades recentes.
6. Bottom tab navigator com microfone central.

### Abas principais
- Início.
- Cadastros.
- Microfone central como ação global.
- Atendimentos.
- Administração.

### Entidades do CRM
- Imóveis.
- Proprietários.
- Corretores.
- Compradores.
- Locatários.
- Leads.
- Documentos: contratos, comprobatórios e pessoais.
- Conversas WhatsApp.
- Atividades e follow-ups.

### WhatsApp
O frontend deve conversar com um Node bridge persistente. O app Capacitor não deve manter a sessão crítica do WhatsApp dentro da WebView. Eventos: `wa:qr`, `wa:status`, `wa:message`, `wa:needs_revalidation`. Endpoints: `/status`, `/send/text`, `/conversations`, `/messages/:phone`.

### Voz
O microfone central captura comandos em qualquer aba. A interpretação deve usar o contexto atual: em Cadastros, filtra imóveis/pessoas; em Admin, busca documentos; em Atendimentos, gera resposta para WhatsApp.

### Critérios de aceite
- Cards aparecem antes do painel de voz.
- Microfone está no centro do tab navigator.
- Website e Capacitor usam o mesmo CMS.
- WhatsApp mostra status, mensagens e envio por contato.
- Admin possui documentos por contratos, comprobatórios e pessoais.
- Voz permite gravação, transcrição e execução contextual.
- Áudio gerado só é enviado quando existir arquivo de áudio real gerado por camada nativa/local.
