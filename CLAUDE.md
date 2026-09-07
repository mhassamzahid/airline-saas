# airline-saas

A SaaS project (details TBD). Design-quality is a priority — output must **not** look like generic AI-generated UI.

## Design workflow — follow this

1. **Before building any UI**, invoke the `design-taste-frontend` skill to set the design direction from the brief.
2. **Pick a reference design system** from `design/references/<brand>/DESIGN.md` (73 real-brand systems: linear.app, stripe, vercel, notion, sentry, resend, supabase, posthog, superhuman, mintlify, raycast, etc.). Copy the closest match's token/type/spacing values into `design/DESIGN.md` and adapt — don't invent a loose palette.
3. `design/DESIGN.md` is the project's design contract. Keep it current; build all UI against it.
4. For screen mockups / flows, use the `design` skill (canvas artboards).
5. For image-first work, use `image-to-code`.
6. **After building UI**, run the `web-design-guidelines` skill to audit accessibility / UX / performance.
7. To verify a change in a real browser (screenshots, responsive checks), use the `playwright-skill`.
8. Use `redesign-existing-projects` when upgrading existing screens rather than greenfield.
9. `brandkit` for brand-guideline boards / logo systems.

## Installed skills (in `~/.claude/skills/`)

`design-taste-frontend`, `image-to-code`, `redesign-skill`, `brandkit`, `output-skill`,
`web-design-guidelines`, `playwright-skill`.

## Playwright

`playwright-skill` (script-based, no plugin needed) is the default. A `.mcp.json` also
declares the Playwright MCP server — approve it on session start if you want live browser tools.
