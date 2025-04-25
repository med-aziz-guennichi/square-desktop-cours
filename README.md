# Studiffy Cours Desktop

![Project Banner](https://via.placeholder.com/1200x400?text=Studiffy+Cours+Desktop+Application)

A professional-grade desktop application for educational content management and course creation, leveraging modern web technologies with native desktop capabilities through Tauri.

## 📌 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Building](#-building)
- [Tech Stack](#-tech-stack)
- [License](#-license)

## 🌟 Features
- **Cross-Platform Desktop Runtime**  
  Built with Tauri for native performance across Windows, macOS, and Linux
- **Rich Content Creation**  
  BlockNote-powered editor with Markdown support and real-time collaboration
- **Enterprise-Grade State Management**  
  Zustand stores with TanStack Query for server-state synchronization
- **Professional UI Kit**  
  25+ Radix UI primitives with Framer Motion animations
- **Type-Safe Ecosystem**  
  Full TypeScript integration with Zod validation schemas
- **CI/CD Ready**  
  Pre-configured ESLint, Prettier, and Husky Git hooks

## ⚙️ Prerequisites
- Node.js 18+
- Bun.js 1.0+ (for development)
- Rust 1.70+ (Tauri dependency)
- System dependencies for Tauri:
  ```bash
  winget install -e --id Microsoft.VisualStudio.CppBuildTools
  ```
## 🛠️ Installation
1. Clone the repository:
  ```bash
   git clone https://github.com/med-aziz-guennichi/studiffy-cours.git
   ```

2. Install dependencies:
  ```bash
   bun install
   ```
## 🚀 Development
1. Start the development server:
   ```bash
   bun run tauri dev
   ```
2. Format codebase:
   ```bash
   bun run lint
   ```
## 📦 Building
1. Production build for current platform:
   ```bash
   bun run tauri build
   ```
2. Platform-specific builds:
   ```bash
   bun run tauri build --target <platform>
   ```
## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Tauri, BlockNote, Zustand, TanStack Query, Radix UI, Framer Motion
- **Backend**: Node.js, Express, Zod
- **CI/CD**: GitHub Actions

## Support
If you have any questions or need assistance, please open an issue on GitHub.
