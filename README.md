# iMessage Mockup Generator

A modern, fully-featured iOS iMessage conversation mockup tool built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Pixel-perfect iOS 17 iMessage UI** — Dynamic Island, status bar, contact header, message bubbles with tails, read receipts, typing indicators, and the input bar
- **Live preview** — Instantly see changes reflected on the phone frame as you edit
- **Drag to reorder** — Drag messages up/down to rearrange conversation order using @dnd-kit
- **Dark/Light mode** — Full iOS dark and light theme support for the phone preview
- **Message controls per message:**
  - Toggle sent (blue) vs received (gray)
  - Show/hide timestamps with custom label text
  - Show/hide read receipts (sent messages only)
  - Expand per-message options
- **Contact customization:**
  - Contact name
  - Avatar with color palette selector
  - Upload a custom contact photo
- **Status bar customization:**
  - Display time
  - Battery percentage (with low-battery red indicator)
  - Signal bars
  - Wi-Fi toggle
- **Conversation options:**
  - Show/hide read receipts globally
  - Typing indicator toggle (animated dots)
- **Export as PNG** — High-resolution 3× export via html2canvas
- **App dark mode** — The editor UI itself also supports dark mode
- **Disclaimer** — Clear non-misuse disclaimer embedded in the UI and settings panel

## 🚀 Quick Start

### Option A: Open the single HTML file
The `imessage-generator.html` file is fully self-contained — just open it in any modern browser.

### Option B: Run the development server

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

### Build for production

```bash
npm run build
# Output goes to /dist
```

## 🗂️ Project Structure

```
src/
├── components/
│   ├── AppHeader.tsx          # Top bar with export button
│   ├── editor/
│   │   ├── EditorPanel.tsx    # Left panel with tabs
│   │   ├── MessagesPanel.tsx  # Draggable message list
│   │   ├── MessageEditorRow.tsx # Single message editor row
│   │   └── SettingsPanel.tsx  # Contact, status bar, settings
│   └── phone/
│       ├── PhonePreview.tsx   # Full iPhone frame component
│       ├── StatusBar.tsx      # iOS status bar with icons
│       ├── ContactHeader.tsx  # iMessage nav/contact header
│       ├── MessageBubble.tsx  # Message bubble + typing indicator
│       └── MessageInputBar.tsx # Bottom input bar
├── data/
│   └── sampleData.ts          # Initial sample conversation
├── types/
│   └── index.ts               # TypeScript interfaces
├── utils/
│   ├── helpers.ts             # Utility functions
│   └── exportImage.ts         # html2canvas export helper
├── App.tsx                    # Root component
├── main.tsx                   # Entry point
└── index.css                  # Tailwind + custom styles
```

## ⚠️ Disclaimer

This tool is intended for **creative, educational, entertainment, and UI/UX design purposes only**. Generated mockups are clearly fictional. Do not use generated images to misrepresent real communications, deceive others, or for any harmful purpose.

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop
- **html2canvas** for PNG export
- **Lucide React** for icons
- **Vite** for build tooling
