# 🎡 Cert Trivia Wheel — AWS Community Day Sri Lanka

A polished, production-ready booth game for the **AWS Community Day Sri Lanka** event.

**Spin → Answer → Learn → Reward → Try Again**

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗 Build & Preview

```bash
npm run build    # Production build → dist/
npm run preview  # Serve the production build locally
```

---

## 🎮 Game Flow

1. A participant approaches the booth.
2. Press **SPIN THE WHEEL** to randomly select a category.
3. A question appears — participant picks an answer.
4. **Correct:** they earn a 🏷️ Sticker and their streak increases.
5. **Wrong:** the correct answer + explanation are shown; streak resets.
6. After **3 correct answers in a row**, they unlock a 🎁 Bigger Prize.

---

## 📁 Project Structure

```
src/
├── components/         UI components
│   ├── TriviaWheel.jsx       SVG spinning wheel
│   ├── QuestionCard.jsx      Question + answers
│   ├── ResultCard.jsx        Correct / wrong result
│   ├── BigPrizeCelebration.jsx  3-in-a-row celebration
│   ├── VolunteerPanel.jsx    Booth stats & controls
│   └── ...
├── data/
│   └── questions.js    147 AWS Cloud Practitioner questions
├── hooks/
│   ├── useTriviaGame.js   Game state machine
│   └── useSound.js        Web Audio API sound synthesis
├── utils/
│   ├── wheelUtils.js       Wheel angle / rotation math
│   ├── questionUtils.js    Question selection + shuffling
│   └── statsUtils.js       localStorage persistence
├── App.jsx
├── main.jsx
└── index.css           Complete design system
```

---

## ✏️ Customisation

### Adding questions

Open `src/data/questions.js` and add an object to the `questions` array:

```js
{
  id: 69,                          // unique integer
  category: 'compute',             // see CATEGORIES ids below
  question: 'Your question here?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 1,                // 0-indexed
  explanation: 'Why this is correct...',
  difficulty: 'Easy',              // Easy | Medium | Challenge
}
```

**Category ids:** `fundamentals` · `compute` · `storage` · `security` · `networking` · `billing` · `monitoring` · `random`

### Changing categories / wheel segments

Edit the `CATEGORIES` array at the top of `src/data/questions.js`. Each entry has:

```js
{ id, name, shortName, icon, color, darkColor }
```

Keep exactly **8 entries** to match the wheel's 8 segments.

### Replacing sound files

Drop audio files into `public/sounds/`. The `useSound` hook currently uses Web Audio API synthesis. To use real files, update `src/hooks/useSound.js` to load `new Audio('/sounds/correct.mp3')` etc.

### Changing prize text

Edit the prize messages directly in:
- `src/components/ResultCard.jsx` — sticker badge text
- `src/components/BigPrizeCelebration.jsx` — big prize screen text

### Resetting statistics

- From the **⚙ Volunteer** panel → "Reset Booth Statistics"
- Or programmatically: `localStorage.removeItem('cert_trivia_booth_stats')`

---

## ⌨️ Volunteer Controls

Click **⚙** in the header to open the volunteer panel.

| Control | Action |
|---|---|
| Reset Current Player | Clears streak & question, keeps booth stats |
| Reset Booth Statistics | Wipes all cumulative booth data (requires confirmation) |
| Toggle Sound | Enables / disables all synthesised sounds |
| Toggle Fullscreen | Enters / exits browser fullscreen |

---

## 🌐 Deployment

Any static host works (Vercel, Netlify, S3 + CloudFront, GitHub Pages):

```bash
npm run build
# Upload the dist/ folder
```

For GitHub Pages, set `base` in `vite.config.js`:
```js
export default { base: '/your-repo-name/' }
```

---

## 📋 Technology Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Framer Motion | Animations |
| canvas-confetti | Big-prize celebration |
| Web Audio API | Synthesised game sounds |

No backend. No database. No API keys. Runs fully offline after initial load.

---

## ⚠️ Disclaimer

This is an independent community booth game.  
It is **not** an official AWS product, certification exam, or exam simulator.
