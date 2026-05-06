# test-Full

Tests techniques — un exercice algorithmique et une API métier.

## Projets

### Algo
Exercice FizzBuzz — [Algo/fizzbuzz.js](Algo/fizzbuzz.js)

### Backend
API Fleet Management en Node.js (DDD + CQRS + GraphQL).
Documentation complète : [Backend/README.md](Backend/README.md)

## Démarrage

```bash
cd Backend
npm install        # installe les deps + active le hook Husky
npm start          # http://localhost:4000/graphql
npm test           # tests unitaires
npm run test:bdd   # scénarios Cucumber
```

## Qualité & CI

- **Pre-commit** — [.husky/pre-commit](.husky/pre-commit) lance `lint-staged` (ESLint + Prettier sur les fichiers stagés) puis `npm test`.
- **GitHub Actions** — [.github/workflows/ci.yml](.github/workflows/ci.yml) exécute `install → lint → test → test:bdd` à chaque push et pull request.
