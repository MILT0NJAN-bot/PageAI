# SiteBuilder AI — MVP

SaaS No-Code de generación de sitios web asistido por IA.  
Stack: **Next.js 14 · Node.js/Express · OpenAI · PostgreSQL · Prisma · TypeScript · Tailwind CSS**

---

## Estructura del proyecto

```
saas-nocode-mvp/
├── apps/
│   ├── web/          → Frontend Next.js (App Router)
│   └── api/          → Backend Express + Prisma
└── packages/
    └── shared/       → Tipos TypeScript compartidos
```

## Requisitos previos

- Node.js 20+
- pnpm 8+  (`npm install -g pnpm`)
- MySQL 8+ (o MariaDB 10.5+) corriendo localmente

---

## Setup inicial

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Variables de entorno

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

Edita `apps/api/.env`:
```env
OPENAI_API_KEY=sk-tu-clave-aqui
DATABASE_URL=mysql://usuario:password@localhost:3306/saas_nocode
FRONTEND_URL=http://localhost:3000
```

Edita `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Base de datos

```bash
# Genera el cliente Prisma
pnpm --filter api db:generate

# Crea las tablas
pnpm --filter api db:migrate

# (Opcional) Carga datos de prueba
pnpm --filter api db:seed
```

### 4. Correr en desarrollo

```bash
# Ambos servicios al mismo tiempo
pnpm dev

# O por separado:
pnpm --filter web dev   # Puerto 3000
pnpm --filter api dev   # Puerto 3001
```

---

## Flujo del usuario

1. **`/`** → Landing page
2. **`/onboarding`** → Formulario: nombre + sector + funcionalidades
3. **`POST /api/generate-layout`** → Backend llama a OpenAI y genera el layout
4. **`/editor/[id]`** → Editor en vivo: edición inline, cambio de colores, reordenamiento

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/generate-layout` | Genera layout con IA |
| GET | `/api/projects/:id` | Obtiene un proyecto |
| PUT | `/api/projects/:id` | Actualiza proyecto (auto-save) |
| DELETE | `/api/projects/:id` | Elimina proyecto |
| GET | `/api/projects` | Lista proyectos (paginado) |

---

## Módulos del sistema

| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| Tipos compartidos | `packages/shared/types/blocks.ts` | Contrato de datos completo |
| Onboarding | `apps/web/src/components/onboarding/OnboardingForm.tsx` | Formulario de 3 pasos |
| Bloque Hero | `apps/web/src/components/blocks/HeroBlock.tsx` | Sección principal |
| Bloque Services | `apps/web/src/components/blocks/ServicesBlock.tsx` | Grid de servicios |
| Bloque Gallery | `apps/web/src/components/blocks/GalleryBlock.tsx` | Galería de imágenes |
| Bloque Contact | `apps/web/src/components/blocks/ContactBlock.tsx` | Formulario de contacto |
| Estado del editor | `apps/web/src/hooks/useEditorState.ts` | useReducer global |
| Editor en vivo | `apps/web/src/components/editor/LiveEditor.tsx` | Componente principal |
| Sidebar | `apps/web/src/components/editor/EditorSidebar.tsx` | Controles de colores |
| Renderer | `apps/web/src/components/editor/BlockRenderer.tsx` | Registry de bloques |
| IA Service | `apps/api/src/services/ai.service.ts` | Integración OpenAI |
| Ruta generación | `apps/api/src/routes/generate.ts` | POST /api/generate-layout |
| Ruta proyectos | `apps/api/src/routes/projects.ts` | CRUD proyectos |

---

## Añadir un nuevo bloque

1. Define su interfaz en `packages/shared/types/blocks.ts`
2. Agrega el tipo a la unión `Block`
3. Crea el componente en `apps/web/src/components/blocks/NuevoBloque.tsx`
4. Regístralo en `apps/web/src/components/editor/BlockRenderer.tsx`
5. Agrega su prompt en `apps/api/src/services/ai.service.ts`

---

## Tecnologías

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express 4, Prisma ORM, PostgreSQL
- **IA**: OpenAI GPT-4o-mini (JSON mode)
- **Monorepo**: pnpm workspaces
