# Fixtures

Each fixture contains the following contents:

```
<fixture-name>/
├── <fixture-name>.spec.ts - Playwright tests
├── index.html - HTML page served by Vite
└── main.ts - component definition and setup
```

Fixtures are auto-discovered by the Vite config in `../vite.config.ts`. To add a new fixture, create a new directory with the files above — no other changes are needed.
