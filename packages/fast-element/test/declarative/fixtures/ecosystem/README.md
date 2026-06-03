# Ecosystem

Fixtures for other APIs and behaviors that are part of FAST Element's
declarative ecosystem, including error handling, lifecycle management, and
performance monitoring.

| Fixture | Description |
|---|---|
| `async-template-string` | Promise-compatible `declarativeTemplate({ callback })` resolution from an imported string containing `<f-template>`. |
| `errors` | Error handling and edge cases in template rendering. |
| `lifecycle-callbacks` | `declarativeTemplate()` and `enableHydration()` lifecycle callbacks such as `elementDidRegister`, `elementDidHydrate`, and `hydrationComplete`. |
| `performance-metrics` | Performance monitoring and measurements during the component lifecycle. |
