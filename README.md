# app_peliculas_arq_soa

Proyecto académico desarrollado para demostrar la implementación de una **Arquitectura Orientada a Servicios (SOA)** utilizando **NestJS**, **React**, **Enterprise Service Bus (ESB)** y **Docker**.

## 📌 Descripción

La aplicación permite visualizar un catálogo de películas, consultar sus puntuaciones y obtener recomendaciones relacionadas.

La arquitectura está compuesta por múltiples servicios independientes que exponen contratos REST y son integrados mediante un **ESB Gateway**, el cual centraliza las consultas y proporciona una interfaz unificada al frontend.

---

## 🏗️ Arquitectura

```text
                 React Frontend
                    (5173)
                       │
                       ▼
                 ESB Gateway
                    (3000)
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼

 Movies Service   Rating Service   Recommendation Service
     (3001)          (3002)               (3003)
```

### Componentes

| Componente             | Puerto | Responsabilidad                         |
| ---------------------- | ------ | --------------------------------------- |
| Frontend               | 5173   | Interfaz de usuario                     |
| ESB Gateway            | 3000   | Orquestación e integración de servicios |
| Movies Service         | 3001   | Gestión del catálogo de películas       |
| Rating Service         | 3002   | Gestión de puntuaciones                 |
| Recommendation Service | 3003   | Gestión de recomendaciones              |

---

## 📋 Características

* Arquitectura SOA.
* Servicios desacoplados.
* Contratos REST independientes.
* Integración mediante Enterprise Service Bus (ESB).
* Frontend React consumiendo únicamente el ESB.
* Dockerización completa mediante Docker Compose.
* Documentación Swagger para cada servicio.

---

## 📜 Contratos de Servicio

Uno de los principios fundamentales de la Arquitectura Orientada a Servicios (SOA) es la definición de contratos claros entre los consumidores y proveedores de servicios. Cada servicio de la solución expone una interfaz que define la estructura de los datos intercambiados y los endpoints disponibles para su consumo.

### 🎬 Contrato Movies Service

Define la estructura de una película dentro del sistema.

```ts
export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
}
```

#### Endpoint asociado

```http
GET /movies/:id
```

#### Ejemplo de respuesta

```json
{
  "id": 1,
  "title": "Interstellar",
  "description": "A team travels through a wormhole to save humanity.",
  "releaseDate": "2014-11-07"
}
```

---

### ⭐ Contrato Rating Service

Define la estructura de las puntuaciones asociadas a una película.

```ts
export interface Rating {
  movieId: number;
  rating: number;
}
```

#### Endpoint asociado

```http
GET /ratings/:movieId
```

#### Ejemplo de respuesta

```json
{
  "movieId": 1,
  "rating": 4.8
}
```

---

### 🎯 Contrato Recommendation Service

Define la estructura utilizada para las recomendaciones de películas relacionadas.

```ts
export interface Recommendation {
  movieId: number;
  recommendations: number[];
}
```

#### Endpoint asociado

```http
GET /recommendations/:movieId
```

#### Ejemplo de respuesta

```json
{
  "movieId": 1,
  "recommendations": [2, 3, 5]
}
```

---

### 🔄 Contrato de Integración ESB Gateway

El ESB consume los contratos individuales de cada servicio y construye un contrato unificado para el frontend.

```ts
export interface MovieDetailResponse {
  movie: Movie;
  rating: number;
  recommendations: {
    id: number;
    title: string;
  }[];
}
```

#### Endpoint asociado

```http
GET /movie-details/:id
```

#### Ejemplo de respuesta

```json
{
  "movie": {
    "id": 1,
    "title": "Interstellar",
    "description": "A team travels through a wormhole to save humanity.",
    "releaseDate": "2014-11-07"
  },
  "rating": 4.8,
  "recommendations": [
    {
      "id": 2,
      "title": "Inception"
    },
    {
      "id": 3,
      "title": "The Matrix"
    },
    {
      "id": 5,
      "title": "Avatar"
    }
  ]
}
```

### Flujo de Contratos

```text
Frontend
    │
    ▼
ESB Gateway Contract
    │
 ┌──┼──┐
 ▼  ▼  ▼

Movie Contract
Rating Contract
Recommendation Contract
```

El frontend consume únicamente el contrato expuesto por el ESB Gateway, mientras que el ESB utiliza los contratos individuales de cada servicio para realizar la orquestación, transformación y agregación de datos, manteniendo el desacoplamiento característico de una arquitectura SOA.


## 🔌 Servicios

### Movies Service

Responsable de gestionar el catálogo de películas.

#### Endpoints

```http
GET /movies
GET /movies/:id
```

#### Ejemplo

```json
{
  "id": 1,
  "title": "Interstellar",
  "description": "A team travels through a wormhole to save humanity.",
  "releaseDate": "2014-11-07"
}
```

---

### Rating Service

Responsable de gestionar las puntuaciones de las películas.

#### Endpoints

```http
GET /ratings
GET /ratings/:movieId
```

#### Ejemplo

```json
{
  "movieId": 1,
  "rating": 4.8
}
```

---

### Recommendation Service

Responsable de gestionar las recomendaciones.

#### Endpoints

```http
GET /recommendations
GET /recommendations/:movieId
```

#### Ejemplo

```json
{
  "movieId": 1,
  "recommendations": [2, 3, 5]
}
```

---

### ESB Gateway

Responsable de integrar la información proveniente de los distintos servicios.

#### Endpoints

```http
GET /movies-overview
GET /movie-details/:id
```

#### Ejemplo de respuesta

```json
{
  "movie": {
    "id": 1,
    "title": "Interstellar",
    "description": "A team travels through a wormhole to save humanity.",
    "releaseDate": "2014-11-07"
  },
  "rating": 4.8,
  "recommendations": [
    {
      "id": 2,
      "title": "Inception"
    },
    {
      "id": 3,
      "title": "The Matrix"
    },
    {
      "id": 5,
      "title": "Avatar"
    }
  ]
}
```

---

## 📚 Swagger

Cada servicio expone su documentación mediante Swagger.

| Servicio               | URL                        |
| ---------------------- | -------------------------- |
| Movies Service         | http://localhost:3001/docs |
| Rating Service         | http://localhost:3002/docs |
| Recommendation Service | http://localhost:3003/docs |

---

## 🐳 Ejecución con Docker

### Construir contenedores

```bash
docker compose build
```

### Levantar aplicación

```bash
docker compose up
```

### Levantar en segundo plano

```bash
docker compose up -d
```

### Detener servicios

```bash
docker compose down
```

---

## 🌐 Accesos

| Aplicación             | URL                   |
| ---------------------- | --------------------- |
| Frontend               | http://localhost:5173 |
| ESB Gateway            | http://localhost:3000 |
| Movies Service         | http://localhost:3001 |
| Rating Service         | http://localhost:3002 |
| Recommendation Service | http://localhost:3003 |

---

## 📁 Estructura del Proyecto

```text
app_peliculas_arq_soa
│
├── docker-compose.yml
├── README.md
│
├── frontend
│   ├── Dockerfile
│   ├── package.json
│   └── src
│       ├── services
│       │   └── esbApi.ts
│       ├── App.tsx
│       ├── App.css
│       └── main.tsx
│
└── backend
    │
    ├── movies-service
    │   ├── Dockerfile
    │   ├── src
    │   │   ├── contracts
    │   │   │   └── movie.interface.ts
    │   │   ├── app.controller.ts
    │   │   ├── app.service.ts
    │   │   └── main.ts
    │   └── package.json
    │
    ├── rating-service
    │   ├── Dockerfile
    │   ├── src
    │   │   ├── contracts
    │   │   │   └── rating.interface.ts
    │   │   ├── app.controller.ts
    │   │   ├── app.service.ts
    │   │   └── main.ts
    │   └── package.json
    │
    ├── recommendation-service
    │   ├── Dockerfile
    │   ├── src
    │   │   ├── contracts
    │   │   │   └── recommendation.interface.ts
    │   │   ├── app.controller.ts
    │   │   ├── app.service.ts
    │   │   └── main.ts
    │   └── package.json
    │
    └── esb-gateway
        ├── Dockerfile
        ├── .env.docker
        ├── src
        │   ├── app.controller.ts
        │   ├── app.service.ts
        │   └── main.ts
        └── package.json
```

### Organización

#### Frontend

Aplicación React desarrollada con Vite. Consume exclusivamente los endpoints expuestos por el ESB Gateway.

#### Movies Service

Servicio encargado de gestionar el catálogo de películas y exponer la información principal de cada película.

#### Rating Service

Servicio encargado de gestionar las puntuaciones asociadas a las películas.

#### Recommendation Service

Servicio encargado de gestionar las recomendaciones de películas relacionadas.

#### ESB Gateway

Componente central de integración. Orquesta las llamadas a los distintos servicios, transforma las respuestas y expone una interfaz unificada para el frontend.

#### Docker Compose

Archivo encargado de coordinar el despliegue de todos los contenedores y establecer la comunicación entre ellos dentro de una red Docker común.


## 🛠️ Tecnologías utilizadas

### Backend

* NestJS
* TypeScript
* Axios
* Swagger

### Frontend

* React
* Vite
* TypeScript

### DevOps

* Docker
* Docker Compose

---

## 📸 Capturas

Agregar aquí las capturas de:

* Catálogo de películas.
* Detalle de película.
* Swagger de los servicios.
* Ejecución mediante Docker Compose.

---

## 👨‍💻 Autor

Proyecto desarrollado como práctica académica para el curso de Arquitectura de Software utilizando el estilo arquitectónico SOA (Service-Oriented Architecture).
Desarrollado por:
  - Dante Rodolfo Tarraga Usca
  - Davel Reymundo Gobea
  - Humberto Alejandro Lizana Ventura
