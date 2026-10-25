# MeuApp

Implementação React Native / Expo SDK 58 dos cinco designs do Figma.

## Executar

- npm install
- npm start (prévia nativa)
- npm run web (navegador)

## Telas

- / — Jornada
- /objetivos — Objetivos
- /objetivo — Detalhamento do objetivo
- /conquistas — Conquistas
- /dashboard — Dashboard de Evolução

As telas usam Expo Router, Inter e os SVGs originais locais em assets/figma. Os dados visuais iniciais correspondem aos exemplos do Figma, inclusive as datas históricas. Criações, edições e ações são guardadas localmente por AsyncStorage. Não há servidor ou autenticação; métricas e histórico usam os dados demonstrativos dos designs.

## Organização

src/app contém as rotas; src/DesignScreen.tsx compõe as telas nativas e as ações; src/state.tsx guarda alterações; src/theme.ts converte as propriedades visuais em estilos React Native; src/design contém a descrição estruturada de cada tela, sem screenshots.

## Verificação

npm run typecheck
npm run lint
npx expo export --platform web
