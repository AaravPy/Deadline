# DEADLINE

### **60 SECONDS. ONE YARD. NO SECOND CHANCES.**

A fast-paced first-person 3D survival shooter built for the browser with **Three.js**.

> Survive the full minute. Fight the horde. Earn kills. Unlock weapons. Don't miss.

---

## 🎮 Game

**Deadline** drops you into a compact 3D arena with one objective:

# SURVIVE FOR 60 SECONDS.

Zombies will constantly close in on your position. Move, aim, shoot, reload, sprint, and manage your health while trying to survive the entire countdown.

Every kill helps you progress toward better weapons.

---

## ✨ Features

- 🔫 First-person 3D shooting
- 🧟 Zombie enemies with pursuit and crowd separation
- ⏱️ 60-second survival objective
- 💥 Four unlockable weapons
- 🏃 Sprinting and movement
- 🖱️ Mouse look and pointer lock
- 🎯 Kill-based weapon progression
- 💾 Persistent progress using browser Local Storage
- 🔊 Procedurally generated sound using Web Audio API
- ⏸️ Pause menu and armory
- ❤️ Health and ammunition systems
- 🏆 Results screen after each run
- 📱 Responsive menus and HUD
- ⚡ No build system or npm installation required

---

## 🔄 Gameplay Loop

```text
        ┌─────────────┐
        │  START RUN  │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │ ENTER YARD  │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │ FIGHT HORDE │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │ KILLS/DAMAGE│
        └──────┬──────┘
               ↓
     ┌────────────────────┐
     │ EARN KILLS +       │
     │ SURVIVE            │
     └─────────┬──────────┘
               ↓
        ┌─────────────┐
        │   ARMORY    │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │   UPGRADE   │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │ 60 SECONDS  │
        └──────┬──────┘
               ↓
        ┌─────────────┐
        │    WIN      │
        └─────────────┘
