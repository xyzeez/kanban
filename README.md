<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-light.svg" />
    <img alt="Kanban Board Logo" src="./assets/logo-light.svg" width="300" />
  </picture>
  <p align="center">
    A modern task management application built with React, TypeScript, and Tanstack Query
  </p>

  <!-- Project Links -->
  <p align="center">
    <br />
    <a href="https://kanban-web.netlify.app" target="_blank">View Demo</a>
    ·
    <a href="https://github.com/xyzeez/kanban-web/issues/new?template=bug_report.md" target="_blank">Report Bug</a>
    ·
    <a href="https://github.com/xyzeez/kanban-web/issues/new?template=feature_request.md" target="_blank">Request Feature</a>
  </p>

  <!-- Project Screenshot -->
  <div align="center">
    <img src="./assets/screenshot.png" alt="Kanban Board Screenshot" width="100%" />
  </div>
</div>

## 📋 Table of Contents

- [About](#about)
- [Built With](#built-with)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## 🎯 About

This is a task management tool that helps teams organize and track their work efficiently. Built with modern web technologies, it provides a smooth and intuitive user interface for managing tasks and workflows.

## 🛠 Built With

- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)
- ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

## ✨ Features

- Drag and drop task management
- Real-time updates
- Responsive design
- Custom board creation
- User authentication
- Dark/Light mode support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A running instance of the Kanban backend server

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd kanban-web
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🔑 Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
```

## 🚀 Deployment

The application can be deployed to any static hosting service. Build the project using:

```bash
npm run build
```

The built files will be in the `dist` directory.
