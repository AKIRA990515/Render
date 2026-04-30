# RoFitness - Sistema de Gimnasio

## 1. Contexto General

RoFitness es una aplicación full-stack para la gestión de un gimnasio. Incluye una landing page comercial con formulario de contacto vía WhatsApp, páginas de autenticación (login/registro), un chat grupal en tiempo real, y un panel de administración para gestionar usuarios del sistema.

El usuario admin puede crear instructores y miembros; cualquier visitante puede contactarnos, registrarse como usuario del sistema, o chatear con otros usuarios.

---

## 2. Especificaciones Funcionales

### Landing Page (Público)
- Hero con carrusel de imágenes (6 slides)
- Beneficios, Precios, Resultados, Testimonios
- Formulario de contacto: nombre, email, mensaje → envía por WhatsApp Web API
- Mapa de ubicación e información de contacto

### Páginas de Autenticación
- **Login:** email + password
- **Registro:** nombre completo + email + password + confirmación
- Feedback visual de éxito al registrar

### Chat Grupal (Usuarios autenticados)
- Mensajería en tiempo real vía WebSocket (Socket.io)
- Historial de últimos 50 mensajes
- Mensajes propios a la izquierda, otros a la derecha
- Fecha junto al nombre del remitente
- Indicador de conexión/desconexión

### Panel de Administración (solo rol `admin`)
- **Dashboard:** estadísticas de usuarios (total, admins, instructores, miembros)
- **Gestión de Usuarios:** CRUD completo (crear/editar/eliminar/listar usuarios con paginación)
- Enlace a página principal del sitio

### Sistema de Temas
- Toggle light/dark mode
- Persistencia en localStorage
- Paleta verde fitness profesional
- Botón toggle en Navbar y AdminLayout

### Autenticación
- Login con email/password
- Registro de usuarios (name, email, password)
- Tokens JWT: access (15min) + refresh (7 días)
- Logout que limpia el refresh token hash en BD
- Refresh automático en el cliente

---

## 3. Especificaciones Técnicas

### Backend (`gimnasio-app/`)

| Aspecto | Detalle |
|---------|--------|
| Framework | NestJS 11 |
| ORM | TypeORM |
| BD | PostgreSQL 15 (Docker) |
| Auth | JWT (Passport.js) |
| WebSocket | Socket.io + @nestjs/websockets |
| Validación | class-validator |
| Puerto | `3000` |

**Arquitectura de módulos:**
- `AuthModule` — login, register, refresh, logout + SeederService
- `UsersModule` — CRUD de usuarios con roles
- `ChatModule` — WebSocket gateway + REST API historial

**Modelos TypeORM:**
```
User {
  id: UUID (PK, auto)
  name: varchar(100)
  email: varchar(150, unique)
  password: varchar(255, bcrypt)
  role: enum [admin|instructor|member]
  refreshTokenHash: varchar(255, nullable)
  createdAt, updatedAt: Date
}

Message {
  id: UUID (PK, auto)
  userId: UUID (FK → User)
  userName: varchar(100)
  content: text (max 500)
  createdAt: Date
}
```

**Endpoints API:**

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Login |
| POST | `/auth/register` | No | Registro |
| POST | `/auth/refresh` | No | Refresh token |
| POST | `/auth/logout` | JWT | Cerrar sesión |
| GET | `/users` | JWT | Listar usuarios |
| GET | `/users/:id` | JWT | Ver usuario |
| POST | `/users` | JWT | Crear usuario |
| PATCH | `/users/:id` | JWT | Actualizar usuario |
| DELETE | `/users/:id` | JWT | Eliminar usuario |
| GET | `/chat/messages` | JWT | Historial mensajes |

**WebSocket Events:**

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `connect` | Client → Server | Conexión autenticada |
| `history` | Server → Client | Historial al conectar |
| `message` | Client → Server | Enviar mensaje |
| `message` | Server → All | Broadcast mensaje |

### Frontend (`gimnasio-frontend/`)

| Aspecto | Detalle |
|---------|--------|
| Framework | React 19 |
| Bundler | Vite 8 |
| UI | MUI 9 + Emotion |
| Router | React Router v7 |
| Estado auth | Context API (localStorage) |
| Estado theme | Context API + localStorage |
| WebSocket | socket.io-client |
| HTTP client | Axios |
| Puerto dev | `5173` |

**Rutas:**
- `/` — Landing page
- `/login` — Login de usuario
- `/register` — Registro de usuario
- `/chat` — Chat grupal (auth requerido)
- `/admin/dashboard` — Dashboard (admin)
- `/admin/users` — Gestión usuarios (admin)

**Paleta de colores (Tema Dark):**
| Rol | Color |
|-----|-------|
| primary.main | #4ADE80 (verde lima) |
| primary.light | #86EFAC |
| primary.dark | #22C55E |
| background.default | #0F172A (azul pizarra) |
| background.paper | #1E293B |
| text.primary | #F8FAFC |

**Paleta de colores (Tema Light):**
| Rol | Color |
|-----|-------|
| primary.main | #16A34A (verde bosque) |
| primary.light | #4ADE80 |
| primary.dark | #15803D |
| background.default | #FAFAFA |
| background.paper | #FFFFFF |
| text.primary | #1E293B |

**Credenciales admin seed:**
- Email: `admin@rofitness.com`
- Password: `Admin123!`

---

## 4. Restricciones

- El panel admin solo es accesible para rol `admin`
- El chat solo es accesible para usuarios autenticados
- `synchronize: true` en TypeORM (solo dev, no migraciones)
- Contraseñas hasheadas con bcrypt (salt 10)
- Refresh token hasheado en BD para validación segura
- Seed admin se ejecuta automáticamente en bootstrap si `SEED_ADMIN=true` y el email no existe
- Variables sensibles (JWT secrets, passwords) solo en `.env`, no en código
- Mensajes limitados a 500 caracteres

---

## 5. Estructura de Archivos

### Frontend (`gimnasio-frontend/src/`)

```
├── components/
│   ├── AdminLayout.tsx      # Layout admin con sidebar + botón sitio
│   ├── Benefits.tsx         # Sección beneficios
│   ├── ChatWindow.tsx       # Componente de chat
│   ├── Contact.tsx           # Formulario contacto + mapa
│   ├── Footer.tsx            # Pie de página
│   ├── Hero.tsx              # Carrusel principal
│   ├── LandingPage.tsx       # Página principal
│   ├── Navbar.tsx           # Barra de navegación (logo enlace)
│   ├── Pricing.tsx           # Sección planes
│   ├── ProtectedRoute.tsx   # Protección de rutas
│   ├── Results.tsx           # Sección resultados
│   └── Testimonials.tsx     # Sección testimonios
├── context/
│   ├── AuthContext.tsx       # Contexto de autenticación
│   ├── SocketContext.tsx     # Contexto de socket
│   └── ThemeContext.tsx       # Contexto de tema (light/dark)
├── pages/
│   ├── AdminDashboard.tsx     # Dashboard admin
│   ├── AdminUsers.tsx        # Gestión de usuarios
│   ├── ChatPage.tsx         # Página de chat
│   ├── LoginPage.tsx         # Página de login
│   └── RegisterPage.tsx      # Página de registro
├── services/
│   ├── api.ts               # Cliente Axios con interceptors
│   └── socket.ts            # Cliente Socket.io
├── App.tsx                   # Rutas principales
├── theme.ts                 # Configuración MUI themes
└── main.tsx                 # Entry point
```

### Backend (`gimnasio-app/src/`)

```
├── auth/                     # Módulo de autenticación
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── seeder.service.ts
├── users/                    # Módulo de usuarios
│   ├── dto/
│   ├── entities/
│   ├── users.module.ts
│   └── users.service.ts
├── chat/                    # Módulo de chat
│   ├── dto/
│   ├── entities/
│   ├── chat.module.ts
│   ├── chat.gateway.ts      # WebSocket gateway
│   ├── chat.controller.ts   # REST API
│   └── chat.service.ts
├── app.module.ts
└── main.ts
```

---

## 6. Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn
- Docker (para PostgreSQL)

### Instalación

```bash
# Backend
cd gimnasio-app
npm install
docker-compose up -d  # PostgreSQL
npm run start:dev

# Frontend
cd gimnasio-frontend
npm install
npm run dev
```

### Variables de Entorno (Backend)

```env
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gimnasio

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

SEED_ADMIN=true
```

### Variables de Entorno (Frontend)

```env
# .env
VITE_API_URL=http://localhost:3000
```

---

## 7. Bugs Corregidos

| Bug | Archivo | Corrección |
|-----|---------|------------|
| Logout usaba localStorage.clear() | Navbar.tsx | Usa logout() del contexto |
| Admin no veía botón logout | Navbar.tsx | Botón siempre visible |
| getStats apuntando a endpoint inexistente | api.ts | Función eliminada |
| Logo sin enlace | Navbar.tsx | Logoenvuelto en Link |
| Sin enlace a sitio en admin | AdminLayout.tsx | Botón "Ver sitio" agregado |

---

## 8. Documentación Adicional

Ver `ANALISIS.md` para un análisis detallado del proyecto incluyendo:
- Bugs detectados y corregidos
- Issues de UX
- Recomendaciones de mejora
- Checklist de implementación
- Dependencias completas