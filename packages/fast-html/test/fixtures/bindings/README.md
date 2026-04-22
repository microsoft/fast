# Bindings

Fixtures for testing the various binding types supported by `@microsoft/fast-html` templates.

| Fixture | Description |
|---|---|
| `attribute` | Attribute binding via `@attr` and `@observable` decorators on custom elements. |
| `content` | Content binding with `{{text}}` for escaped HTML and `{{{html}}}` for unescaped HTML injection. |
| `dot-syntax` | Dot-notation path access in bindings (e.g., `{{user.name}}`, `{{user.address.city}}`). |
| `event` | Event binding syntax with `@click="{handleClick()}"`, DOM event access via `$e`, and context access via `$c`. |
| `host` | Host element bindings for applying styles and attributes to the host element. |
