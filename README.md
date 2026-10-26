# ☕ JavaPuff — Cute & Threatening Java Learning Academy

![JavaPuff Mascot](frontend/public/mascots/menacing.jpg)

> **"Learn Java or Face Koffi's Wrath!"**  
> A full-stack, gamified Java learning application featuring cute pastel visuals, 540 rigorous pedagogical questions, interactive syntax rearrangement, case-sensitivity bug spotting, student ranking by marks, and a Duolingo-style passive-aggressive mascot who threatens you to maintain your daily streak!

---

## 🌟 Key Highlights & Features

### 1. 🎓 Comprehensive 3-Tier Java Curriculum
- **3 Difficulty Levels**:
  - 🌱 **Beginner**: Java Foundations, JVM Architecture, Main Method, Primitive Types, Operators, Branching, Loops, and 1D Arrays.
  - ⚡ **Moderate**: Object-Oriented Programming (OOP), Classes, Objects, Constructors, `this`, Access Modifiers, Encapsulation, Inheritance (`extends`), Overriding/Overloading, Polymorphism, Abstract Classes, Interfaces, and Exception Handling (`try-catch-finally`, `throw`/`throws`).
  - 🚀 **Advanced**: Java Collections Framework (`ArrayList`, `LinkedList`, `HashSet`, `TreeSet`, `HashMap`), Generics (`<T>`, wildcards), Lambdas, Streams API (filter, map, collectors), Multithreading, Concurrency Synchronization, File I/O, and JVM Memory Internals (Heap vs Stack, Garbage Collection).
- **12 Sublevels per Level** = **36 Sublevels Total**.
- **15 Questions per Sublevel** = **540 Interactive Questions Total**.

### 2. 🔀 Interactive Question Formats
- **Sentence & Token Sorting / Rearrangement**:
  - Disordered code tokens (e.g. `['void', 'public', 'main(String[] args)', 'static']`).
  - Interactive click-to-place / click-to-remove token slots with real-time Java syntax preview!
- **Case-Sensitivity & Syntax Bug Spotter**:
  - Spot illegal capitalizations (e.g. `Public static void main` — `p` cannot be capitalized because Java keywords are strictly lowercase; `System.Out.println`; `Void`; `Boolean flag = True`).
- **Multiple Choice & Code Output Prediction**:
  - Instant visual feedback, pedagogical explanations, and Koffi's sassy threat commentary on every question!

### 3. 😼 Threatening Daily Learning Mechanic (Duolingo Style)
- **Mascot**: Meet **Koffi ☕**, the cute coffee-cat mascot who holds a glowing semicolon and takes your daily streak very seriously!
- **4 Threat Levels**:
  - **Level 1 (Peaceful Bean)**: Koffi is content and sipping warm latte.
  - **Level 2 (Suspicious Glares)**: Koffi notices you've been inactive for hours.
  - **Level 3 (Semicolon Hostage)**: Koffi has placed your semicolon key under house arrest!
  - **Level 4 (DEFCON JAVA)**: Angry Koffi is standing outside your window holding a `NullPointerException`!
- **Daily Streak Countdown**: Live timer warning you before your streak is destroyed at midnight.
- **Mercy Pleader**: An interactive "Beg For Mercy" button to calm Koffi down for 2 hours.
- **5 Pastel Hearts**: Lose a heart on wrong answers. Refillable via practice mode!

### 4. 🎨 Pastel GUI & Cute Cartoon Visuals
- Styled with soft pastel palettes (lavender `#F0EBFF`, mint `#E6FAF0`, blush pink `#FFE5EC`, buttercup yellow `#FFF9DB`).
- 3D jelly candy buttons with tactile press animations.
- Beautiful cartoon illustrations generated specifically for JavaPuff (`happy.jpg`, `menacing.jpg`, `angry.jpg`).
- Web Audio API synthesized chimes and sound effects (no external MP3 dependencies required).

### 5. 🏆 Student Ratings & Global Leaderboard
- Students are ranked dynamically according to their **Marks**, **XP**, **Streak**, and **Completed Sublevels**.
- **Student Rating Tiers**:
  - 👑 **JVM Overlord** (1,500+ Marks)
  - 💎 **Byte Archmage** (1,000 – 1,499 Marks)
  - ⚡ **Thread Master** (600 – 999 Marks)
  - 🌸 **OOP Artisan** (300 – 599 Marks)
  - 🌱 **Syntax Sprout** (100 – 299 Marks)
  - ☕ **Coffee Bean Baby** (< 100 Marks)

### 6. 🗄️ SQL Database Architecture
- Built with standard SQL and persisted via **SQLite** (`javapuff.sqlite`) using Node.js native `DatabaseSync` (`node:sqlite`).
- SQL Tables:
  - `users` (id, username, email, password_hash, avatar, marks, xp, streak, hearts, threat_level)
  - `levels` (id, title, description, color_theme, order_index)
  - `sublevels` (id, level_id, sublevel_number, title, description, icon, min_marks_to_unlock)
  - `questions` (id, sublevel_id, question_index, question_type, prompt, code_snippet, options_json, correct_answer_json, explanation, threat_hint)
  - `user_progress` (id, user_id, sublevel_id, completed, best_score, stars, attempts)
  - `user_answers` (id, user_id, question_id, user_answer, is_correct)
  - `threat_logs` (id, user_id, threat_level, message, mood)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+, v24 recommended)
- npm

### Installation & Launch
1. Open the project root:
   ```bash
   npm run dev
   ```
   *(This starts both the Express SQLite API backend on port 5000 and the Vite React frontend on port 5173).*

2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Quick Demo Accounts
You can either register a new account with a custom cute avatar, or use the 1-click demo login buttons:
- **Username**: `ByteBarista` | **Password**: `password123` (Rank #1 Champion)
- **Username**: `SyntaxQueen` | **Password**: `password123` (Rank #2 Archmage)
- **Username**: `DukeTheHamster` | **Password**: `password123`

---

## ☕ License
MIT © 2026 JavaPuff Academy.
