# Aivora — AI University Advisor

> An AI-powered platform that helps applicants choose universities and specialties through personalized recommendations and intelligent conversation.

**Live Demo:** https://aivora-rho.vercel.app  
**Backend API:** https://aivora-backend-l8mv.onrender.com/test

---

## Table of Contents

1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Setup Instructions](#setup-instructions)
5. [REST API Endpoints](#rest-api-endpoints)
6. [Design Patterns](#design-patterns)
7. [OOP Principles](#oop-principles)
8. [Database Schema](#database-schema)
9. [Running Tests](#running-tests)
10. [AI Use Statement](#ai-use-statement)

---

## Project Description

Aivora is an AI-powered university advising platform targeted at applicants aged 16–20, primarily from Kyrgyzstan and Central Asia. The platform addresses a common problem: students have no personalized advisor to help them choose the right university and field of study.

**Core features:**
- Conversational AI advisor (powered by Groq's LLaMA 3.3 70B model) that understands goals, interests, and skills
- Personalized university recommendations with filtering by country, interest, and score
- University detail pages with 12-month preparation timelines and resource lists
- Learning Center with 28 curated resources across 7 categories
- Chat history saved to database with session management
- Favorites system for saving universities of interest
- JWT-based authentication

**Context:** Built as both a startup pitch and an OOP Capstone Project for E|C College, Spring 2026 (Weight: 35%).

---

## Tech Stack

| Component     | Technology                        | Version       | Hosted On              |
|---------------|-----------------------------------|---------------|------------------------|
| Backend       | Java Spring Boot                  | 3.5.13        | Render.com (Free tier) |
| Frontend      | React + Vite                      | latest        | Vercel (Free tier)     |
| Database      | PostgreSQL                        | 17.6          | Supabase (Free tier)   |
| ORM           | Hibernate / JPA                   | 6.6.45        | (part of Spring Boot)  |
| Security      | Spring Security + JWT             | 6.5.9 / 0.11.5| Backend                |
| AI Chat       | Groq API (llama-3.3-70b-versatile)| —             | External API           |
| HTTP Client   | Spring WebFlux                    | 6.2.17        | Backend                |
| Build Tool    | Maven                             | 3.x           | Backend                |
| Runtime       | OpenJDK                           | 25.0.1        | Backend                |

---

## Architecture

The system follows a classic 4-layer Spring Boot architecture:

```
React Frontend (Vercel)
        │
        ▼  HTTP / REST
Spring Boot Backend (Render)
        │                    │
        ▼                    ▼
PostgreSQL (Supabase)    Groq API (LLaMA 3.3)
```

**Dependency flow (strictly enforced):**
```
Controller → Service → Repository → Entity
```

Each layer has a single responsibility:
- **Controller** — handles HTTP requests and responses, no business logic
- **Service** — contains all business logic
- **Repository** — data access via Spring Data JPA interfaces
- **Entity** — JPA-mapped domain objects

---

## Setup Instructions

### Prerequisites

- Java 21+
- Maven (or use included `./mvnw`)
- Node.js 18+ and npm
- Docker Desktop (for local PostgreSQL)

### 1. Clone the repository

```bash
git clone https://github.com/ulikwwq/Aivora.git
cd Aivora
```

### 2. Start local PostgreSQL via Docker

```bash
docker run -d --name aivora-db \
  -e POSTGRES_USER=aivora_user \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=aivora \
  -e POSTGRES_INITDB_ARGS='--auth-host=md5 --auth-local=md5' \
  -p 5433:5432 \
  postgres:16
```

> Port 5433 is used because 5432 may be occupied by a local PostgreSQL installation.

### 3. Configure environment variables

The `backend/src/main/resources/application.yaml` uses environment variables with local defaults. For local development, the defaults work out of the box. For production, set the following on Render.com:

| Variable                        | Description                        |
|---------------------------------|------------------------------------|
| `SPRING_DATASOURCE_URL`         | Supabase JDBC connection string    |
| `SPRING_DATASOURCE_USERNAME`    | Supabase username                  |
| `SPRING_DATASOURCE_PASSWORD`    | Supabase password                  |
| `JWT_SECRET`                    | Secret key (min 32 characters)     |
| `JWT_EXPIRATION`                | Token TTL in ms (default 86400000) |
| `GROQ_API_KEY`                  | Groq API key                       |
| `GROQ_MODEL`                    | Model name (llama-3.3-70b-versatile)|

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend starts on `http://localhost:8080`. Verify with:
```
GET http://localhost:8080/test
```

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`.

---

## REST API Endpoints

Base URL (production): `https://aivora-backend-l8mv.onrender.com`

> **Note:** The Render free tier sleeps after 15 minutes of inactivity. The first request after sleep may take ~50 seconds. Hit `/test` before a demo to wake it up.

### Authentication

| Method | Endpoint         | Auth   | Description                                      |
|--------|------------------|--------|--------------------------------------------------|
| GET    | `/test`          | Public | Health check                                     |
| POST   | `/auth/register` | Public | Register. Body: `{name, email, password}`        |
| POST   | `/auth/login`    | Public | Login. Returns: `{token, name, email}`           |

**Register example:**
```json
POST /auth/register
{
  "name": "Aibek",
  "email": "aibek@example.com",
  "password": "securepassword"
}
```

**Login example:**
```json
POST /auth/login
{
  "email": "aibek@example.com",
  "password": "securepassword"
}
// Response: { "token": "eyJ...", "name": "Aibek", "email": "aibek@example.com" }
```

All JWT-protected endpoints require header:
```
Authorization: Bearer <token>
```

### Chat

| Method | Endpoint      | Auth | Description                                        |
|--------|---------------|------|----------------------------------------------------|
| POST   | `/chat`       | JWT  | Send message to AI. Body: `{message, uniContext?}` |
| DELETE | `/chat/reset` | JWT  | Reset current session context                      |

**Chat example:**
```json
POST /chat
{
  "message": "What universities are good for computer science?",
  "uniContext": null
}
```

### Chat History

| Method | Endpoint           | Auth | Description                                    |
|--------|--------------------|------|------------------------------------------------|
| GET    | `/history`         | JWT  | Get all saved chats for the user               |
| POST   | `/history/save`    | JWT  | Save session. Body: `{title, messages}`        |
| DELETE | `/history/{id}`    | JWT  | Delete a saved chat                            |

### Recommendations

| Method | Endpoint                               | Auth   | Description                                       |
|--------|----------------------------------------|--------|---------------------------------------------------|
| GET    | `/recommendations`                     | Public | Get all universities                              |
| POST   | `/recommendations`                     | JWT    | Filter. Body: `{interests?, country?, specialty?}`|
| GET    | `/recommendations/countries`           | Public | Get list of available countries                   |
| GET    | `/recommendations/requirements/{name}` | Public | Get university details by name                    |

**Filter example:**
```json
POST /recommendations
{
  "interests": "computer science",
  "country": "Germany",
  "specialty": "software engineering"
}
```

### Favorites

| Method | Endpoint          | Auth | Description                                              |
|--------|-------------------|------|----------------------------------------------------------|
| GET    | `/favorites`      | JWT  | Get user's saved universities                            |
| POST   | `/favorites`      | JWT  | Add. Body: `{universityName, country, city}`             |
| DELETE | `/favorites/{id}` | JWT  | Remove from favorites                                    |

---

## Design Patterns

### 1. Strategy Pattern — University Recommendations

**Location:** `service/strategy/`

**Problem:** Different filtering algorithms for universities (by interest, by country, by score) should be interchangeable without modifying existing code.

**Implementation:**
```
RecommendationStrategy (interface)
    ├── ByInterestStrategy
    ├── ByCountryStrategy
    └── ByScoreStrategy
```

`RecommendationService` holds a `Map<String, RecommendationStrategy>` and calls:
```java
strategies.get("byInterest").recommend(universities, request);
```

**Rationale:** Satisfies the Open/Closed Principle — adding a new filtering algorithm only requires creating a new class that implements the interface, without touching `RecommendationService`.

---

### 2. Factory Pattern — AI Response Creation

**Location:** `factory/AiResponseFactory.java`

**Problem:** Different types of AI responses (standard reply, error response, context-aware response) need to be created in different situations.

**Implementation:**
```java
AiResponseFactory.createResponse(content)
AiResponseFactory.createErrorResponse(message)
AiResponseFactory.createContextResponse(content, universityName)
```

**Rationale:** Centralizes object creation logic. Callers don't need to know the details of how response objects are constructed — they just call the appropriate factory method.

---

### 3. Singleton Pattern — Spring Beans

**Location:** All `@Service`, `@Repository`, `@Component` classes

**Implementation:** Spring Boot creates all beans as singletons by default. Every service (e.g., `AuthService`, `ChatService`, `RecommendationService`) has exactly one instance managed by the Spring IoC container.

**Rationale:** Ensures shared state (like conversation context in `ChatService`) is consistent across all requests from the same user session, and avoids unnecessary object creation overhead.

---

### 4. Builder Pattern — Entity Construction

**Location:** `User.java`, `ChatSession.java`, `FavoriteUniversity.java` (via Lombok `@Builder`)

**Implementation:**
```java
ChatSession session = ChatSession.builder()
    .userEmail(email)
    .title(title)
    .messages(messagesJson)
    .build();
```

**Rationale:** Provides a readable, fluent API for creating complex objects with optional fields, avoiding telescoping constructor anti-patterns.

---

## OOP Principles

| Principle       | Implementation                                                                                          |
|-----------------|---------------------------------------------------------------------------------------------------------|
| Encapsulation   | All entity fields are private. `User.password` is never returned in responses. BCrypt logic is encapsulated inside `AuthService`. |
| Inheritance     | `ResourceNotFoundException` and `BadRequestException` extend `RuntimeException`, sharing exception handling behavior. |
| Polymorphism    | `RecommendationService` calls `strategy.recommend()` polymorphically — the same call dispatches to different implementations at runtime. |
| Abstraction     | `RecommendationStrategy` abstracts over filtering algorithms. Services depend on `JpaRepository` interfaces, not concrete implementations. |
| SRP             | Each class has one responsibility: `AuthService` handles auth only, `ChatService` handles chat only, `RecommendationService` handles recommendations only. |
| OCP             | New recommendation algorithm = new `Strategy` class. `RecommendationService` is never modified.         |
| DIP             | Constructor injection used everywhere (`@RequiredArgsConstructor`). No `@Autowired` field injection.    |

---

## Database Schema

### `users`
| Column   | Type           | Notes              |
|----------|----------------|--------------------|
| id       | BIGINT (PK)    | Auto-generated     |
| email    | VARCHAR UNIQUE | User's email       |
| password | VARCHAR        | BCrypt hash        |
| name     | VARCHAR        | Display name       |

### `chat_sessions`
| Column      | Type        | Notes                              |
|-------------|-------------|------------------------------------|
| id          | BIGINT (PK) | Auto-generated                     |
| user_email  | VARCHAR     | Links to users.email               |
| title       | VARCHAR     | First 40 chars of first message    |
| messages    | TEXT        | JSON array of message objects      |
| created_at  | TIMESTAMP   | Set on `@PrePersist`               |
| updated_at  | TIMESTAMP   | Set on `@PreUpdate`                |

### `favorite_universities`
| Column           | Type        | Notes             |
|------------------|-------------|-------------------|
| id               | BIGINT (PK) | Auto-generated    |
| user_email       | VARCHAR     | Links to users    |
| university_name  | VARCHAR     | University name   |
| country          | VARCHAR     |                   |
| city             | VARCHAR     |                   |
| saved_at         | TIMESTAMP   | When it was saved |

---

## Running Tests

```bash
cd backend
./mvnw test
```

**Expected output:**
```
Tests run: 1,  Failures: 0, Errors: 0  ← BackendApplicationTests (context load)
Tests run: 5,  Failures: 0, Errors: 0  ← AuthServiceTest
Tests run: 6,  Failures: 0, Errors: 0  ← RecommendationServiceTest

Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Tests use an in-memory H2 database — no Docker or external database required to run the test suite.

**Test coverage:**

`AuthServiceTest` (5 tests):
- Successful registration
- Registration with duplicate email
- Successful login
- Login with non-existent user
- Login with wrong password

`RecommendationServiceTest` (6 tests):
- Get all universities
- Filter by country
- Filter by interest
- Find university by name (found)
- Find university by name (not found → exception)
- Get distinct countries list

---

## AI Use Statement

AI tools (Claude by Anthropic) were used during the development of this project in the following ways:

- **Debugging:** Identifying causes of runtime errors (e.g., PostgreSQL dialect warnings with H2 in tests, CORS configuration issues)
- **Explaining concepts:** Understanding Spring Security filter chain behavior, JWT token lifecycle, and Hibernate DDL strategies
- **Generating boilerplate:** Scaffolding DTO classes, test method stubs, and exception handler structure
- **Code review:** Reviewing service layer logic for adherence to SOLID principles

All architectural decisions, business logic implementation, and design pattern choices were made by the developer. AI was used as a productivity tool, not as a substitute for understanding.

---

*Aivora — E|C College OOP Capstone Project, Spring 2026*
