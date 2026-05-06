# Fleet Management

Gestion de flotte de véhicules en Node.js.
**DDD + CQRS + GraphQL**, architecture hexagonale, données en mémoire.

---

## Démarrer

```bash
npm install
npm start          # http://localhost:4000/graphql  (mode mémoire)
npm test           # tests unitaires (node:test) — 6 tests
npm run test:bdd   # scénarios BDD (Cucumber)  — 5 scénarios
npm run lint       # ESLint
npm run format     # Prettier
```

Mode PostgreSQL :

```bash
set DATABASE_URL=postgres://user:pass@localhost:5432/fleet
npm start
```

---

## Architecture

```
src/
  Domain/   Entités, Value Objects, règles métier
  App/      Commands, Queries, Handlers (CQRS)
  Infra/    Repositories (mémoire) + Container DI
  API/      Schéma et resolvers GraphQL
```

Sens des dépendances :

```
API ──► App ──► Domain
                 ▲
                Infra
```

Le **Domain ne dépend de rien**. Infra et API dépendent du Domain, jamais l'inverse.

---

## Modèle métier

**Entités**
- `Fleet` — agrégat racine, possède une liste de plaques.
- `Vehicle` — identifié par sa plaque, connaît sa dernière position.

**Value Objects** (immuables, validés à la construction)
- `VehiclePlateNumber`
- `Location` (lat, lng, alt?)

**Règles** (portées par les entités, pas par les handlers)
- `Fleet.registerVehicle` empêche un doublon dans la même flotte.
- `Vehicle.parkAt` empêche deux fois la même position consécutive.
- Un véhicule peut appartenir à plusieurs flottes : il est stocké une seule fois, chaque flotte ne garde qu'une liste de plaques.

---

## CQRS

| Commands (écriture)       | Queries (lecture)         |
| ------------------------- | ------------------------- |
| `CreateFleetCommand`      | `GetFleetVehiclesQuery`   |
| `RegisterVehicleCommand`  | `GetVehicleLocationQuery` |
| `ParkVehicleCommand`      |                           |

Un handler par cas d'usage. Les resolvers GraphQL n'ont **aucune logique** : ils traduisent les arguments en command/query et délèguent.

---

## API GraphQL

```graphql
# Créer une flotte
mutation { createFleet(userId: "user-1") }

# Enregistrer un véhicule
mutation {
  registerVehicle(fleetId: "FLEET_ID", plateNumber: "AB-123-CD")
}

# Garer le véhicule
mutation {
  parkVehicle(
    fleetId: "FLEET_ID"
    plateNumber: "AB-123-CD"
    lat: 48.8566
    lng: 2.3522
    alt: 35
  )
}

# Lister les véhicules d'une flotte
query {
  fleetVehicles(fleetId: "FLEET_ID") {
    plateNumber
    location { lat lng alt }
  }
}

# Position d'un véhicule
query {
  vehicleLocation(fleetId: "FLEET_ID", plateNumber: "AB-123-CD") {
    lat lng alt
  }
}
```

---

## Tests

Deux suites complémentaires, toutes deux appelant directement les handlers (sans HTTP).

### Tests unitaires — `npm test`

Utilise le runner natif `node:test`. Couvre les 6 cas métier dans [test/fleet.test.js](test/fleet.test.js) :

- Register a vehicle
- Prevent duplicate vehicle in the same fleet
- Vehicle in multiple fleets
- Park vehicle
- Prevent same location twice
- Different location works

### BDD Gherkin — `npm run test:bdd`

Scénarios métier lisibles par un non-dev dans [features/fleet.feature](features/fleet.feature). Step definitions dans [features/step_definitions/fleet.steps.js](features/step_definitions/fleet.steps.js).

---

## Step 2 — PostgreSQL

Implémenté dans [src/Infra/Postgres/](src/Infra/Postgres) :

- [PostgresFleetRepository.js](src/Infra/Postgres/PostgresFleetRepository.js)
- [PostgresVehicleRepository.js](src/Infra/Postgres/PostgresVehicleRepository.js)
- [schema.sql](src/Infra/Postgres/schema.sql)

Le [Container](src/Infra/Container.js) bascule automatiquement sur Postgres si `DATABASE_URL` est défini, sinon utilise les repos en mémoire. **Aucune autre couche ne change** — c'est l'intérêt de l'hexagonal.

```bash
psql $DATABASE_URL -f src/Infra/Postgres/schema.sql
set DATABASE_URL=postgres://user:pass@localhost:5432/fleet
npm start
```

---

## Step 3 — Outillage

- **ESLint** — [.eslintrc.cjs](.eslintrc.cjs) (config recommandée + compatibilité Prettier).
- **Prettier** — [.prettierrc.json](.prettierrc.json).
- **Husky + lint-staged** — hook pre-commit (situé à la racine du repo : `.husky/pre-commit`) qui lance `lint-staged` (eslint + prettier sur les fichiers stagés) puis `npm test`.

Scripts disponibles : `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`.

---

## Choix techniques

- **Pas de NestJS** : JavaScript pur, plus simple à lire.
- **Express + Apollo Server v3** : couple minimal pour exposer un schéma GraphQL.
- **Container DI maison** : une factory dans [Container.js](src/Infra/Container.js), pas besoin d'IoC pour 5 handlers.
- **Repos en mémoire d'abord** : on valide la logique métier sans I/O, puis on swap pour Postgres sans toucher au reste.
- **`node:test` + Cucumber** : `node:test` pour la rapidité et zero-dep, Cucumber pour la lisibilité métier des scénarios Gherkin.
