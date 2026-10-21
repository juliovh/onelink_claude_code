# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Onelink is an experimental link-in-bio tool built with Nuxt 4 (Vue 3, `<script setup>`), Tailwind CSS 3 (via `@nuxtjs/tailwindcss`), and `@nuxt/icon`. Source lives under `app/` (Nuxt 4's default `srcDir`); `public/` stays at the root. There is no backend or database: **all profile data lives in the URL** as a base64-encoded JSON query parameter.

## Commands

```bash
yarn install        # yarn.lock is committed; postinstall runs `nuxt prepare` (generates .nuxt/, which tsconfig.json references)
npm run dev         # dev server on http://localhost:3000
npm run build       # production build
npm run generate    # static generation
npm run preview     # preview production build
```

There is no test suite, linter, or formatter configured.

## Architecture

The data flow goes through two pages:

- **Editor**: `app/pages/index.vue` holds a single reactive `data` object. It binds each field to the form components in `app/components/AppForm/` via named `v-model`s and renders a live preview (`AppForm/Preview.vue`). "Publish" encodes `data` with `app/utils/transformer.js` (`encodeData` = `JSON.stringify` + `js-base64`) and copies `<origin>/1?data=<base64>` to the clipboard.
- **Viewer**: `app/pages/1.vue` decodes `route.query.data` with `decodeData` and renders it.

Both the preview and the viewer render the same component, `app/components/Templates/Simple.vue`. Any change to how a profile looks therefore shows up in both places. The README roadmap treats each numbered page (`/1`) as a template, so a new template would be a new `app/pages/<n>.vue` plus a `app/components/Templates/*.vue`, with the editor's publish URL updated to match.

### Data schema (short keys, kept small to minimize URL length)

| Key | Meaning | Key | Meaning |
|---|---|---|---|
| `n` | name | `gh` | GitHub URL |
| `d` | description (max 100 chars) | `tg` | Telegram URL |
| `i` | profile image URL | `l` | LinkedIn URL |
| `f` | Facebook URL | `e` | email (rendered as `mailto:`) |
| `t` | Twitter URL | `w` | WhatsApp number (rendered as `https://wa.me/<w>`) |
| `ig` | Instagram URL | `y` | YouTube URL |
| `ls` | array of links `{ l: label, i: iconify icon key, u: url }` | | |

A new field has to be added in several places that are not linked to each other: the initial `data` object and `prefillDemoData` in `app/pages/index.vue`, the relevant `AppForm` component (props plus `update:<prop>` emits), the rendering in `Templates/Simple.vue`, and `Simple.vue`'s `allSocialLinksAreEmpty` computed. Keep keys short, because they are part of every published URL and changing them breaks links that already exist. `Simple.vue` also checks a key `m` that no form ever sets.

### Conventions

- Components are auto-imported by Nuxt and used in kebab-case with their directory as a prefix (e.g. `app/components/AppForm/SocialLinks.vue` → `<app-form-social-links>`, `app/components/Base/FormSection.vue` → `<base-form-section>`).
- Icons are Iconify names (`ph:…`, `mdi:…`, etc.) passed to `<icon name="…">` from `@nuxt/icon`. No `@iconify-json/*` collections are installed, so the icon server endpoint (`/api/_nuxt_icon/…`) fetches from the Iconify API at runtime; that is what lets users type any icon key (see https://icones.js.org/).
- `AppForm/Links.vue` uses `vuedraggable` and mutates the `modelValue` array directly before emitting it.
