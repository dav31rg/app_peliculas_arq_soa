# Arquitectura SOA 

## Integrantes del Grupo

| Nombre |
|---|
| Davel Reymundo Gobea |
| Humberto Alejandro Lizana Ventura |
| Dante Tarraga Usca |


---

## 1. Descripcion del Proyecto

Aplicacion web para consultar peliculas utilizando **The Movie Database (TMDB)** como fuente de datos. La arquitectura implementa el patron **SOA (Service-Oriented Architecture)** con un **ESB real** basado en **WSO2 Micro Integrator** como intermediario obligatorio entre el frontend y los servicios backend.

El flujo principal es:

```
React App → WSO2 Micro Integrator (ESB) → Servicios SOA NestJS → TMDB API
```

El frontend **nunca** consume directamente los servicios. Toda comunicacion pasa por el BUS/ESB.

---

## 2. Arquitectura

```
                    React App (5173)
                         │
                         ▼
              WSO2 Micro Integrator (8290)
                    BUS / ESB
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
    Popular Service  Top Rated Service  Now Playing Service
       (3001)            (3002)              (3003)
           │             │             │
           ▼             ▼             ▼
        TMDB API      TMDB API      TMDB API
     /movie/popular  /movie/top_rated  /movie/now_playing
```

### Flujo de una peticion

```
 1. Usuario selecciona "Populares" en React
 2. React envia GET /api/movies/popular
 3. Nginx proxy reenvia a WSO2 MI en puerto 8290
 4. WSO2 MI busca el recurso /popular en MoviesAPI Synapse
 5. WSO2 MI ejecuta el mediador <call> hacia PopularServiceEndpoint
 6. PopularService (NestJS) consulta TMDB API /movie/popular
 7. TMDB devuelve JSON con peliculas
 8. PopularService normaliza la respuesta al contrato MovieContract
 9. WSO2 MI devuelve la respuesta al frontend
10. React renderiza las cards de peliculas
```

---

## 3. Componentes

| Componente | Tecnologia | Responsabilidad | Puerto |
|---|---|---|---|
| `frontend` | React + Vite + Nginx | Aplicacion cliente | `5173` |
| `wso2-mi` | WSO2 Micro Integrator 4.4.0 | BUS/ESB: registro, enrutamiento, proxy | `8290` |
| `popular-service` | NestJS (Node.js) | Peliculas populares desde TMDB | `3001` |
| `top-rated-service` | NestJS (Node.js) | Peliculas mejor calificadas desde TMDB | `3002` |
| `now-playing-service` | NestJS (Node.js) | Peliculas en cartelera desde TMDB | `3003` |

---

## 4. APIs Externas

### TMDB API (The Movie Database)

- **URL base:** `https://api.themoviedb.org/3`
- **Autenticacion:** Bearer Token via header `Authorization`
- **Documentacion:** https://developer.themoviedb.org/reference

Endpoints consumidos:

| Endpoint TMDB | Descripcion | Servicio que lo consume |
|---|---|---|
| `GET /movie/popular` | Peliculas populares | popular-service |
| `GET /movie/top_rated` | Peliculas mejor calificadas | top-rated-service |
| `GET /movie/now_playing` | Peliculas en cartelera | now-playing-service |

Parametros comunes enviados:

- `language=en-US`
- `page=1`

Respuesta de TMDB (estructura relevante):

```json
{
  "page": 1,
  "results": [
    {
      "id": 12345,
      "title": "Titulo de la pelicula",
      "overview": "Descripcion...",
      "poster_path": "/ruta-del-poster.jpg",
      "release_date": "2024-01-15",
      "vote_average": 8.5
    }
  ],
  "total_pages": 100,
  "total_results": 2000
}
```

---

## 5. APIs Internas (Servicios SOA)

### Contrato compartido: MovieContract

Los 3 servicios comparten el mismo contrato de salida:

```typescript
export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
}
```

Cada servicio normaliza la respuesta de TMDB a este contrato antes de responder.

### Popular Service (puerto 3001)

```
GET http://localhost:3001/movies/popular
```

Consume TMDB `/movie/popular` y devuelve `Movie[]`.

### Top Rated Service (puerto 3002)

```
GET http://localhost:3002/movies/top-rated
```

Consume TMDB `/movie/top_rated` y devuelve `Movie[]`.

### Now Playing Service (puerto 3003)

```
GET http://localhost:3003/movies/now-playing
```

Consume TMDB `/movie/now_playing` y devuelve `Movie[]`.

---

## 6. ESB / BUS - WSO2 Micro Integrator

WSO2 Micro Integrator actua como BUS central de la arquitectura SOA. Expone endpoints publicos y enruta las peticiones hacia los servicios internos.

### Endpoints registrados en WSO2

| Endpoint | Archivo XML | URL interna |
|---|---|---|
| PopularServiceEndpoint | `popular-service-endpoint.xml` | `http://popular-service:3001/movies/popular` |
| TopRatedServiceEndpoint | `top-rated-service-endpoint.xml` | `http://top-rated-service:3002/movies/top-rated` |
| NowPlayingServiceEndpoint | `now-playing-service-endpoint.xml` | `http://now-playing-service:3003/movies/now-playing` |

### APIs Synapse expuestas

**MoviesAPI** (contexto: `/api/movies`)

| Recurso | Metodo | Endpoint WSO2 | Enruta a |
|---|---|---|---|
| `/popular` | GET | `http://localhost:8290/api/movies/popular` | PopularServiceEndpoint |
| `/top-rated` | GET | `http://localhost:8290/api/movies/top-rated` | TopRatedServiceEndpoint |
| `/now-playing` | GET | `http://localhost:8290/api/movies/now-playing` | NowPlayingServiceEndpoint |

**BusServicesAPI** (contexto: `/bus`)

| Recurso | Metodo | Endpoint WSO2 | Descripcion |
|---|---|---|---|
| `/services` | GET | `http://localhost:8290/bus/services` | JSON con los servicios registrados |

### Configuracion Synapse

Estructura de archivos en WSO2:

```
wso2-mi/
  Dockerfile
  deployment/
    synapse-configs/
      default/
        api/
          movies-api.xml
          bus-services-api.xml
        endpoints/
          popular-service-endpoint.xml
          top-rated-service-endpoint.xml
          now-playing-service-endpoint.xml
```

Ejemplo de endpoint Synapse:

```xml
<endpoint name="PopularServiceEndpoint" xmlns="http://ws.apache.org/ns/synapse">
  <address uri="http://popular-service:3001/movies/popular"/>
</endpoint>
```

Ejemplo de API Synapse:

```xml
<api context="/api/movies" name="MoviesAPI" xmlns="http://ws.apache.org/ns/synapse">
  <resource methods="GET" uri-template="/popular">
    <inSequence>
      <property name="REST_URL_POSTFIX" scope="axis2" action="remove"/>
      <call>
        <endpoint key="PopularServiceEndpoint"/>
      </call>
      <respond/>
    </inSequence>
    <faultSequence>
      <makefault response="true" version="pox">
        <code value="tns:Receiver"/>
        <reason value="Popular service unavailable"/>
      </makefault>
      <respond/>
    </faultSequence>
  </resource>
</api>
```

---

## 7. Estructura del Proyecto

```
app_peliculas_arq_soa/
├── .env                            ← Token TMDB
├── .env.example
├── docker-compose.yml              ← Orquestacion de los 5 servicios
├── README.md
│
├── wso2-mi/                        ← ESB / BUS
│   ├── Dockerfile
│   └── deployment/
│       └── synapse-configs/
│           └── default/
│               ├── api/
│               │   ├── movies-api.xml
│               │   └── bus-services-api.xml
│               └── endpoints/
│                   ├── popular-service-endpoint.xml
│                   ├── top-rated-service-endpoint.xml
│                   └── now-playing-service-endpoint.xml
│
├── backend/
│   ├── popular-service/            ← Servicio SOA (puerto 3001)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── app.controller.ts
│   │       ├── app.service.ts
│   │       └── contracts/
│   │           └── movie.interface.ts
│   │
│   ├── top-rated-service/          ← Servicio SOA (puerto 3002)
│   │   └── (misma estructura)
│   │
│   └── now-playing-service/        ← Servicio SOA (puerto 3003)
│       └── (misma estructura)
│
└── frontend/                       ← React App (puerto 5173)
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        ├── services/
        │   └── api.js
        ├── pages/
        │   └── Home.jsx
        └── components/
            ├── MovieCard.jsx
            ├── MovieList.jsx
            └── ErrorBoundary.jsx
```

---

## 8. Tecnologias Utilizadas

| Capa | Tecnologia | Version |
|---|---|---|
| Frontend | React | 19.x |
| Frontend bundler | Vite | 8.x |
| Frontend server | Nginx | Alpine |
| Backend servicios | NestJS | 10.x |
| HTTP client | Axios | 1.x |
| ESB / BUS | WSO2 Micro Integrator | 4.4.0 |
| Configuracion ESB | Synapse XML | - |
| API externa | TMDB API v3 | - |
| Contenedores | Docker + Docker Compose | - |
| Lenguaje | TypeScript | 5.x |

---

## 9. Ejecucion

### Requisitos

- Docker y Docker Compose
- Token de TMDB API (configurar en `.env`)

### Variables de entorno

Archivo `.env` en la raiz del proyecto:

```
TMDB_API_TOKEN=tu_token_de_tmdb_aqui
```

### Levantar con Docker

```bash
docker compose up --build
```

### Acceder

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| WSO2 Micro Integrator | http://localhost:8290 |
| WSO2 Management API | http://localhost:9164 |
| Popular Service (diagnostico) | http://localhost:3001/movies/popular |
| Top Rated Service (diagnostico) | http://localhost:3002/movies/top-rated |
| Now Playing Service (diagnostico) | http://localhost:3003/movies/now-playing |

### Verificacion del BUS

```bash
curl http://localhost:8290/bus/services
```

Respuesta esperada:

```json
[
  {
    "name": "PopularService",
    "contract": "MovieContract",
    "endpoint": "http://popular-service:3001/movies/popular"
  },
  {
    "name": "TopRatedService",
    "contract": "MovieContract",
    "endpoint": "http://top-rated-service:3002/movies/top-rated"
  },
  {
    "name": "NowPlayingService",
    "contract": "MovieContract",
    "endpoint": "http://now-playing-service:3003/movies/now-playing"
  }
]
```

---

## 10. Nota Arquitectonica

La entrega se presenta como una arquitectura **SOA con ESB real**:

```
Aplicacion cliente → WSO2 Micro Integrator → Servicios registrados por contrato
```

Los servicios `popular-service`, `top-rated-service` y `now-playing-service` **no son consumidos directamente** por React. WSO2 Micro Integrator es el BUS responsable del registro, enrutamiento y exposicion de los servicios.
