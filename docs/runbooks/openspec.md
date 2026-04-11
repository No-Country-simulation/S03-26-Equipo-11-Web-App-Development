# OpenSpec - Quick Reference Guide

> Workflow SDD (Specification-Driven Development)

## Prerequisites
- **Node.js 20.19.0+** installed

---

## Workflow

```
┌─────────┐    ┌───────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐
│ Install │ →  │ Initialize│ →  │ Propose  │ →  │  Apply  │ →  │ Archive  │
└─────────┘    └───────────┘    └──────────┘    └─────────┘    └──────────┘
```

---

## Commands

| Step | Command | Description |
|------|---------|-------------|
| **Install** | `npm install -g @fission-ai/openspec@latest` | Install globally |
| **Init** | `openspec init` | Initialize in project folder, select AI assistant |
| **Propose** | `/opsx:propose "description"` | Create change folder with specs + tasks |
| **Propose (step-by-step)** | `/opsx:new` → `/opsx:continue` | Incremental proposal |
| **Apply** | `/opsx:apply` | Execute tasks, write code |
| **Verify** | `/opsx:verify` | Quality check before archiving |
| **Archive** | `/opsx:archive` | Move to history, update main specs |

---

## Syntax Variations by AI Tool

| Tool | Prefix | Example |
|------|--------|---------|
| Claude Code | `/opsx:` | `/opsx:propose "feature"` |
| Cursor / Windsurf | `/opsx-` | `/opsx-propose "feature"` |

---

## Quick Start

```bash
# 1. Install
npm install -g @fission-ai/openspec@latest

# 2. Navigate to project & init
cd my-project
openspec init

# 3. Start workflow
/opsx:propose "new feature description"
/opsx:apply
/opsx:verify
/opsx:archive

# 4. Next cycle
/opsx:propose "next improvement"
```

---

## Generated Structure

Each proposal creates a `change/` folder with:
- `purpose.md` - What & why
- `specs.md` - Technical specifications
- `design.md` - Technical design
- `tasks.md` - Implementation checklist
