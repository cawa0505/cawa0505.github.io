+++
title = "Porting Terminimal to Zola 0.23: When Tera Deleted Macros"
date = 2026-08-06T00:05:00Z
description = "Zola 0.23 moved to Tera 2 and broke macro-based themes. This article documents the Terminimal migration to globally registered components and the syntax changes that followed."

[taxonomies]
tags = ["zola", "tera", "static-sites"]
+++

{% raw %}
Zola 0.23 shipped on 2026-08-05 with a template engine that is not backwards compatible. It bundles Tera 2 — a full rewrite — and the upgrade broke every macro-based theme in the ecosystem, including [Terminimal](https://github.com/pawroman/zola-theme-terminimal), the one this site runs on. Upstream hadn't been touched for 0.20+, so I ported it myself. Here's what actually changed.

## What Zola is, briefly

[Zola](https://www.getzola.org/) is a static site generator in a single Rust binary. No Node, no Ruby, no plugin ecosystem to keep alive — you write Markdown, it builds HTML. It uses [Tera](https://github.com/Keats/tera) for templating, a Jinja2-like engine. That engine is exactly what changed under it.

## Tera 2 deleted macros

The migration guide is blunt about it:

> Macros? Yep completely gone. Nada. They are replaced with components.

Terminimal is built out of macros — `date`, `head`, `menu`, `post`, `title` — 11 of them across 5 files, called from every template. In Tera 1 you imported and called them:

```jinja2
{% import "macros/post.html" as post_macros %}
{{ post_macros::header(page=page) }}
```

In Tera 2 that entire model is gone. No `{% import %}`, no `::`, no `{% macro %}`. Components replace them, and they are **globally registered** — any template containing a `{% component %}` block is available everywhere, no import step.

### Define

```jinja2
{% component header(page) %}
  <h1>{{ page.title }}</h1>
{% endcomponent header %}
```

### Call — JSX, not function calls

This is the part that trips you up. Invocation is a JSX-like tag, not a function call:

```jinja2
{# Tera 1 #}
{{ post_macros::header(page=page) }}

{# Tera 2 #}
{{<header page={page}/>}}
```

String literals stay bare; every non-string value goes in braces: `page={page}`, `summary={true}`, `short={true}`. To capture output into a variable you self-close inside `set`:

```jinja2
{% set title = <title page_title={page.title} main_title={config.title}/> %}
```

### The gotcha: no ambient context

Macros in Tera 1 could see the global template context. **Components can't.** A component only receives what you pass it. Terminimal's `title` macro read `config.extra.page_titles` directly; the `menu` macro read `current_url`. Both broke silently until every call site was updated to pass those in explicitly:

```jinja2
{{<menu config={config} current_path={current_path} current_url={current_url}/>}}
```

That's the real migration cost — not the mechanical `::` → `.` rename, but hunting down every implicit context read and threading it through as an argument.

## Shortcodes are gone too

Same release, second surprise, straight from the changelog:

> As mentioned, shortcodes have been completely removed. [...] just use Tera, the same components you can use elsewhere in your site.

Terminimal's `figure` and `image` shortcodes became components. In content, the call syntax changes from the old `{{ figure(src="...") }}` to the component form:

```markdown
{{< figure src="/img/x.png" />}}
```

No more separate `templates/shortcodes/` mental model — it's components all the way down.

## The tests changed shape

String tests moved to named arguments. What used to be positional now errors without a keyword:

```jinja2
{# breaks in Tera 2 #}
{% if url is starting_with("http") %}

{# works #}
{% if url is starting_with(pat="http") %}
```

## One genuine Zola bug

After the theme compiled, feeds still crashed. Zola 0.23's **built-in** `rss.xml` reads `section.title` without guarding whether `section` is defined — on a taxonomy or a feed with no backing section, that's an undefined-variable error. `atom.xml` guards it; `rss.xml` doesn't. Not a theme problem, a shipped bug.

The fix is a theme-level override: drop a corrected `rss.xml` into the theme's `templates/`, add the missing guard, and Zola prefers it over its built-in. Feeds restored, no fork of Zola required.

## The scoreboard

| Change | Count |
|---|---|
| `{% macro %}` → `{% component %}` | 11, across 5 files |
| Call sites rewritten to `{{<fn .../>}}` | 6 templates |
| Shortcodes → components | `figure`, `image` |
| Test syntax fixed | `starting_with(pat=...)` |
| Zola built-in bugs worked around | 1 (`rss.xml` guard) |

Build time after the port: **~460 ms** for the full site. The single-binary promise still holds — the engine underneath it just moved.

Migration guides referenced: [Tera v1→v2](https://github.com/Keats/tera/blob/master/MIGRATION.md) (canonical — Tera's own docs site is still offline), [Zola CHANGELOG](https://github.com/getzola/zola/blob/master/CHANGELOG.md).
{% endraw %}
