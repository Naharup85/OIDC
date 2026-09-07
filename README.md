# 🔐 NAuth — OpenID Connect (OIDC) & OAuth 2.0 Identity Provider

A lightweight, modern, and type-safe OpenID Connect (OIDC) & OAuth 2.0 Identity Provider built with **Node.js**, **Express 5**, **TypeScript**, **Drizzle ORM**, and **PostgreSQL**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Flow](#architecture--flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Cryptographic Key Generation](#cryptographic-key-generation)
  - [Database Setup & Migrations](#database-setup--migrations)
  - [Running the Application](#running-the-application)
- [Endpoints & API Reference](#endpoints--api-reference)
  - [OIDC Discovery & UI](#oidc-discovery--ui)
  - [Authentication Endpoints](#authentication-endpoints)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)
- [License](#license)

---

## 🌟 Overview

**NAuth** functions as an authentication and identity provider supporting standard OpenID Connect discovery and authorization code flows. It provides:
- Client authentication and validation.
- User registration and login interfaces with a sleek glassmorphic UI.
- Secure cryptographic issuance and storage of short-lived authorization codes.
- Dual-token (Access Token + Refresh Token) session management.

---

## ✨ Key Features

- **Standard OIDC Discovery**: Exposes `/.well-known/openid-configuration` with authorization, token, userinfo, and JWKS endpoints.
- **Authorization Code Flow**: Supports OAuth 2.0 authorization code issuance with client-id matching and redirect callbacks.
- **Built-in Modern Web UI**: Glassmorphic and responsive `/authenticate` and `/signup` pages with real-time feedback and transitions.
- **Enhanced Security**:
  - Passwords hashed using **bcrypt** (salt rounds: 10).
  - One-time authorization codes hashed with **SHA-256** before database storage.
  - JWTs with configurable expiration for access and refresh tokens.
  - Custom SSL/TLS CA certificate support (`ca.pem`).
- **Type-Safe Persistence**: Schema migrations and database queries managed by **Drizzle ORM** with **PostgreSQL**.
- **Request Validation**: Schema parsing and runtime validation using **Zod**.

---

## 🔄 Architecture & Flow

```mermaid
   sequenceDiagram
    autonumber
    actor User as User / Browser
    participant Client as Client Application
    participant OIDC as NAuth OIDC Server
    participant DB as PostgreSQL - Drizzle

    Client->>User: Redirect to authentication endpoint
    User->>OIDC: GET /authenticate
    OIDC-->>User: Render login UI
    User->>OIDC: POST /api/auth/login with credentials and client ID
    OIDC->>DB: Validate user and client
    DB-->>OIDC: User and client validated
    OIDC->>OIDC: Generate short-lived authorization code
    OIDC->>DB: Store SHA-256 hash of authorization code
    DB-->>OIDC: Authorization code stored
    OIDC-->>User: 302 redirect to redirect URI with code
    User->>Client: Navigate to redirect URI with authorization code
    Client->>OIDC: POST /token with authorization code
    OIDC->>DB: Validate authorization code
    DB-->>OIDC: Code valid
    OIDC-->>Client: Access Token, ID Token, and Refresh Token
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (ES Modules) |
| **Language** | TypeScript |
| **Framework** | Express 5 |
| **Database & ORM** | PostgreSQL (`pg`), Drizzle ORM, Drizzle Kit |
| **Validation** | Zod |
| **Security & Cryptography** | JSON Web Tokens (`jsonwebtoken`), Bcrypt, Node.js `crypto`, OpenSSL |
| **Development Tools** | `tsc-watch`, `tsx` |

---

## 📂 Project Structure

```text
oidc/
├── cert/                     # RSA private & public keys (generated via key-gen.sh)
├── drizzle/                  # Drizzle ORM migration files
├── public/                   # Static frontend assets
│   ├── authenticate.html     # Glassmorphic Login interface
│   └── signup.html           # Glassmorphic Sign-up interface
├── src/
│   ├── common/
│   │   ├── dto/              # Generic validation DTO helpers
│   │   │   └── validate.ts
│   │   └── utils/
│   │       ├── apiError.ts   # Standardized application error handler
│   │       ├── apiresonse.ts # Standardized JSON & redirect response wrapper
│   │       └── jwt-utility.ts# JWT sign/verify and crypto token helpers
│   ├── db/
│   │   └── schema.ts         # Drizzle PostgreSQL schema (users, clients, auth codes)
│   ├── module/
│   │   └── auth/
│   │       ├── DTO/          # Zod schemas (loginDto, registerDto)
│   │       ├── contoller/    # Auth route controllers
│   │       ├── middleware/   # JWT Bearer authentication middleware
│   │       ├── routes/       # Express auth routers
│   │       └── services/     # Core authentication & authorization business logic
│   ├── types/
│   │   └── express.d.ts      # Express Request user type augmentation
│   ├── app.ts                # Express application factory & routes registration
│   └── index.ts              # HTTP server entry point & database connection
├── .env.example              # Template for environment variables
├── ca.pem                    # Optional CA bundle for SSL database connections
├── drizzle.config.ts         # Drizzle kit configuration
├── key-gen.sh                # Shell script to generate 2048-bit RSA keys
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (v20+ recommended)
- **PostgreSQL**: v14+ running locally or hosted (e.g. Supabase, Neon, Aiven)
- **OpenSSL**: Installed in your system path (for `key-gen.sh`)

### Installation

1. Clone the repository and enter the directory:
   ```bash
   git clone <repository-url>
   cd oidc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
# Server Configuration
PORT=8000
BASE_URL=http://localhost:8000

# Database Configuration (PostgreSQL connection string)
DATABASE_URL=postgres://username:password@localhost:5432/oidc_db

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=7d
```

> [!NOTE]
> If connecting to a managed PostgreSQL provider requiring a custom CA certificate, ensure `ca.pem` exists in the project root. The npm scripts automatically supply `NODE_EXTRA_CA_CERTS=./ca.pem`.

### Cryptographic Key Generation

To generate the 2048-bit RSA key pair used for OpenID Connect token signing:

```bash
chmod +x key-gen.sh
./key-gen.sh
```

This creates:
- `cert/private.pem` (Private Key - keep secure, never commit to git)
- `cert/public.pem` (Public Key - used for JWKS / signature verification)

### Database Setup & Migrations

1. Generate migration scripts based on the schema:
   ```bash
   npm run db:generate
   ```

2. Apply migrations to your PostgreSQL database:
   ```bash
   npm run db:migrate
   ```

3. (Optional) Open Drizzle Studio to inspect and manage data in the browser:
   ```bash
   npm run db:studio
   ```

### Running the Application

- **Development Mode** (with hot re-compilation and auto-restart):
  ```bash
  npm run dev
  ```

- **Production Build & Run**:
  ```bash
  npm run build
  npm start
  ```

The server will start at `http://localhost:8000` (or the configured `PORT`).

---

## 📡 Endpoints & API Reference

### OIDC Discovery & UI

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Healthcheck endpoint (`OK`) |
| `GET` | `/.well-known/openid-configuration` | OpenID Connect discovery metadata |
| `GET` | `/authenticate` | Authorization login page (HTML UI) |
| `GET` | `/signup.html` | User registration page (HTML UI) |

#### 1. OpenID Discovery
- **`GET /.well-known/openid-configuration`**
- **Response**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "issuer": "http://localhost:8000",
      "authorization_endpoint": "http://localhost:8000/authenticate",
      "token_endpoint": "http://localhost:8000/token",
      "userinfo_endpoint": "http://localhost:8000/userinfo",
      "jwks_uri": "http://localhost:8000/jwks"
    }
  }
  ```

#### 2. Authorization Flow Entrypoint
- **`GET /authenticate?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope={SCOPE}&state={STATE}`**
- Serves the login page. Upon successful authentication, the server redirects to:
  ```
  {redirect_uri}?code={authorization_code}
  ```

---

### Authentication Endpoints

Base URL: `/api/auth`

#### 1. Register / Sign Up
- **`POST /api/auth/signup`**
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "client_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "password": "StrongPassword123!",
    "redirect_uri": "https://client-app.com/callback"
  }
  ```
- **Response**: `302 Found` redirect to `redirect_uri?code={short_code}`

#### 2. Login
- **`POST /api/auth/login`**
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "client_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "email": "jane.doe@example.com",
    "password": "StrongPassword123!",
    "redirect_uri": "https://client-app.com/callback"
  }
  ```
- **Response**: `302 Found` redirect to `redirect_uri?code={short_code}`

#### 3. Refresh Token
- **`POST /api/auth/refresh`**
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "client_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
  }
  ```
- **Response**: Returns a newly generated short-lived code / tokens.

#### 4. Logout
- **`POST /api/auth/logout`**
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "userId": "user-uuid"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logout success",
    "data": {}
  }
  ```

---

## 🗄️ Database Schema

Defined in [`src/db/schema.ts`](file:///Users/nahar/Desktop/Projects/oidc/src/db/schema.ts) using Drizzle ORM:

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, default random | Unique user ID |
| `first_name` | `varchar(255)` | Not Null | User's first name |
| `last_name` | `varchar(255)` | Not Null | User's last name |
| `email` | `varchar(255)` | Not Null, Unique | Email address |
| `password` | `varchar(255)` | Not Null | Bcrypt hashed password |
| `is_active` | `boolean` | Not Null, Default `true` | Account active state |
| `refresh_token` | `varchar(255)` | Nullable | Current active refresh token |
| `reset_token` | `varchar(255)` | Nullable | Password reset token |
| `reset_token_expires_at` | `timestamp` | Nullable | Expiry for reset token |
| `created_at` | `timestamp` | Default `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | Auto-update | Record update timestamp |

### `clients`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, default random | OAuth2 / OIDC Client ID |
| `name` | `varchar(255)` | Not Null | Client application name |
| `secret` | `varchar(255)` | Not Null | Client application secret |
| `owner_id` | `uuid` | Foreign Key (`users.id`) | Owning user account |
| `created_at` | `timestamp` | Default `now()` | Record creation timestamp |
| `updated_at` | `timestamp` | Auto-update | Record update timestamp |

### `authorization_codes`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, default random | Unique record ID |
| `code` | `varchar(255)` | Not Null | SHA-256 hash of the issued authorization code |
| `code_expiry` | `timestamp` | Nullable | Expiration time for authorization code |
| `user_id` | `uuid` | Foreign Key (`users.id`) | User who authorized the request |

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `NODE_EXTRA_CA_CERTS=./ca.pem tsc-watch --onSuccess "node dist/index.js"` | Starts TypeScript watch mode and runs dev server |
| `npm run build` | `tsc -p .` | Compiles TypeScript source to `dist/` |
| `npm start` | `node dist/index.js` | Runs the compiled production server |
| `npm run db:generate` | `drizzle-kit generate` | Generates SQL migrations from Drizzle schema |
| `npm run db:migrate` | `NODE_EXTRA_CA_CERTS=./ca.pem drizzle-kit migrate` | Executes pending migrations on the database |
| `npm run db:studio` | `NODE_EXTRA_CA_CERTS=./ca.pem drizzle-kit studio` | Launches Drizzle Studio Web UI |

---

