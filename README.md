# Sistema de Saúde - Gestão Multiprofissional

Um aplicativo profissional completo para equipes multidisciplinares de saúde, incluindo fisioterapeutas, médicos, psicólogos, enfermeiros e estudantes da área da saúde.

## 🏥 Funcionalidades

### 1. **Prontuário e Evoluções dos Pacientes**
- Áreas exclusivas por profissão (fisioterapia, medicina, psicologia, enfermagem, etc.)
- Evoluções separadas por profissão, mas vinculadas ao mesmo paciente
- Acompanhamento multiprofissional integrado

### 2. **Modelos de Avaliação e Documentos**
- Biblioteca central com documentos clínicos pré-definidos
- Modelos específicos por profissão:
  - **Medicina**: Anamnese, Exame Físico, Prescrições, Atestados
  - **Fisioterapia**: Avaliação Funcional, Plano de Tratamento, Evoluções
  - **Psicologia**: Anamnese Psicológica, Avaliações, Relatórios
  - **Enfermagem**: Histórico, Evoluções, Prescrições, Controle de Sinais Vitais

### 3. **Armazenamento de Documentos**
- Área segura para cada paciente
- Organização por categorias profissionais
- Suporte a PDF, Word e imagens digitalizadas

### 4. **Controle de Acesso e Perfis**
- Login individual para cada profissional
- Acesso restrito à área de cada profissão
- Perfil de administrador com acesso total
- Níveis: Profissional, Estudante, Administrador

### 5. **Busca e Organização**
- Busca rápida por pacientes, evoluções ou documentos
- Filtros por profissão, data e nome
- Interface intuitiva e responsiva

## 🚀 Configuração

### Pré-requisitos
- Conta no Supabase
- Node.js 18+ instalado

### 1. Configurar Banco de Dados
1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá para o SQL Editor
3. Execute o script `database-setup.sql` (disponível na raiz do projeto)

### 2. Configurar Variáveis de Ambiente
O sistema detectará automaticamente quando você conectar sua conta Supabase. Você pode:

**Opção A - Integração Automática (Recomendado):**
- Vá em Configurações do Projeto → Integrações → Conectar Supabase
- O sistema configurará automaticamente as variáveis necessárias

**Opção B - Configuração Manual:**
Se aparecer um banner laranja, clique em "Configurar" para adicionar:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública do Supabase

### 3. Executar o Projeto
```bash
npm install
npm run dev
```

## 👥 Tipos de Usuário

### **Profissional**
- Acesso à sua área específica de evolução
- Pode cadastrar e editar pacientes
- Visualiza evoluções de todas as profissões
- Registra evoluções apenas da sua profissão

### **Estudante**
- Acesso similar ao profissional
- Ideal para estágios e práticas supervisionadas

### **Administrador**
- Acesso total a todos os dados
- Gerencia usuários e permissões
- Visualiza relatórios completos

## 🔒 Segurança

- **Autenticação**: Sistema seguro via Supabase Auth
- **RLS (Row Level Security)**: Políticas de acesso granular
- **Criptografia**: Dados protegidos em trânsito e em repouso
- **Auditoria**: Logs de todas as ações realizadas

## 📱 Interface

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Tema Profissional**: Interface limpa e organizada
- **Navegação Intuitiva**: Fácil uso por equipes multidisciplinares
- **Acessibilidade**: Seguindo padrões de usabilidade

## 🏗️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Armazenamento**: Supabase Storage

## 📋 Estrutura do Banco

### Tabelas Principais:
- `profiles`: Perfis dos usuários
- `patients`: Dados dos pacientes
- `evolutions`: Evoluções multiprofissionais
- `documents`: Documentos e arquivos
- `document_templates`: Modelos de documentos

## 🎯 Casos de Uso

### Clínica Multidisciplinar
- Equipe com médicos, fisioterapeutas, psicólogos
- Prontuário único com evoluções separadas
- Comunicação integrada entre profissionais

### Hospital
- Múltiplas especialidades
- Controle de acesso por setor
- Relatórios administrativos

### Centro de Reabilitação
- Acompanhamento longitudinal
- Planos de tratamento integrados
- Documentação completa

### Ensino e Estágio
- Supervisão de estudantes
- Casos clínicos para aprendizado
- Controle acadêmico

## 📞 Suporte

Para dúvidas ou suporte técnico, consulte a documentação do Supabase ou entre em contato com o administrador do sistema.

---

**Sistema desenvolvido para profissionais da saúde, por profissionais da saúde.** 🏥