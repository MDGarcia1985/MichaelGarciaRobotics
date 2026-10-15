# Michael Garcia Robotics — YAML-driven starter

This is a small TypeScript/Vite website starter built around the architecture explored in the design discussion:

- **YAML** describes the website, design tokens, page composition, navigation, and engagement behavior.
- **TypeScript** parses the YAML, resolves named tokens, renders pages, and executes behavior.
- **CSS** handles presentation mechanics that are better expressed as styling rather than data.
- **Markdown** documents the architecture and decisions.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints in the terminal.

For a production check:

```bash
npm run build
npm run preview
```

## Where to start reading

1. `specs/main.yaml` — global design tokens and page registry.
2. `specs/homepage.yaml` — the homepage composition.
3. `src/specs.ts` — where YAML files are loaded and parsed.
4. `src/main.ts` — where named YAML intent becomes browser behavior.
5. `docs/ARCHITECTURE.md` — why the layers are divided this way.

## Engagement interaction

Twelve seconds after a first-time visitor lands on the homepage, a small modal asks **"What do you want to explore first?"** with Robotics, Software, Design, and Just looking.

It does **not** collect email, name, analytics, or contact information. The selected answer is only written to `sessionStorage` so the prompt does not repeat during the same browser session. If the visitor chooses one of the three disciplines, that navigation item receives a short visual emphasis and keyboard focus.

The intent is to cause a small commitment after the visitor has had time to inspect the landing page, without interrupting immediately or turning the site into a lead-capture funnel.

Everything about the interaction — delay, copy, choices, and targets — is defined in `specs/homepage.yaml` so you can experiment without rewriting TypeScript.

## Deliberate placeholders

The project, About, and Contact pages are intentionally sparse. They exist to make the navigation architecture executable without inventing content you have not specified yet.
