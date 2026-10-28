# DentNexo — Atlas Odontológico 3D Interativo

Plataforma educacional e clínica avançada de visualização anatômica tridimensional para odontologia, integrando modelos anatômicos de alta fidelidade, notação FDI/ISO 3950, histologia dental, acidentes anatômicos de superfície, patologias clínicas e síntese de voz (TTS).

---

## 🚀 Funcionalidades Principais

- **Visualização 3D de Alta Fidelidade (Three.js / React Three Fiber)**:
  - Crânio, mandíbula e maxila com micro-porosidade e relevo tátil de osso cortical.
  - Músculos da mastigação e da mímica facial com textura de feixes e fascículos estriados.
  - Modelos individuais de dentes permanentes (11 a 48) e decíduos (51 a 85).
  - Sistemas neurovascular (nervos trigêmeos, artérias maxilares e plexo venoso).
  - Iluminação anatômica de estúdio com sombras nítidas e recorte (*dual rim-lights*).

- **Odontograma Interativo FDI (ISO 3950)**:
  - Alternância instantânea entre Dentição Permanente (32 dentes) e Decídua (20 dentes).
  - Seleção didática com isolamento ou destaque visual da estrutura ativa.

- **Exploração Anatômica de Superfície & Acidentes Anatômicos**:
  - Inspeção detalhada de cúspides, fossas, sulcos de desenvolvimento e cristas marginais com marcadores 3D interativos.
  - Seleção por faces (Oclusal, Vestibular, Lingual/Palatina, Mesial, Distal).

- **Histologia & Variações Clínicas**:
  - Modos de visualização externa, corte sagital histológico, translúcido/raio-X e isolamento de câmara pulpar/canais radiculares.
  - Simulações de posicionamento de terceiros molares (siso erupionado, mesioangular, horizontal, incluso) e alinhamento dental (apinhamento anterior e diastema).

- **Síntese de Voz (TTS)**:
  - Narração didática dos conceitos anatômicos e importância clínica com Kokoro TTS de baixa latência e execução contínua em memória.

- **Estudo Clínico & Questionários 3D**:
  - Quiz interativo contextualizado com navegação 3D guiada para reforço de aprendizado.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Vite
- **Renderização Tridimensional**: Three.js, React Three Fiber, React Three Drei
- **Interface & Componentes**: Material UI (MUI v6), Emotion, Lucide Icons
- **Gerenciamento de Estado**: Zustand
- **Backend / TTS**: Python 3.12, Kokoro TTS, SoundFile, Torch

---

## 📦 Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/iancalegari/DentNexo.git
cd DentNexo
```

### 2. Instalar dependências e iniciar o Frontend
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

### 3. (Opcional) Iniciar o servidor de voz Kokoro TTS
```bash
python server_kokoro.py
```
O servidor responderá em `http://127.0.0.1:5005/synthesize`.

---

## 📄 Licença e Referências

- Base anatômica e nomenclaturas em conformidade com a *Terminologia Anatomica* (FCAT / IFAA).
- Sistema de numeração dental conforme a norma internacional ISO 3950 / Federação Dentária Internacional (FDI).
