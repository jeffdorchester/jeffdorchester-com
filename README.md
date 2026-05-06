# Personal Website

Don't overbuild this. The site exists to do three jobs:

1. Confirm you exist and are credible (load fast, look clean, no broken stuff).
2. Tell the story `CLAUDE.md` tells, in your voice, in under 60 seconds of reading.
3. Make it stupid-easy to contact you.

## Recommended stack

For a senior leadership site, simpler is better. Pick one:

- **Plain HTML + CSS** — fastest, hosts anywhere, zero maintenance. Best choice if content > engineering signal.
- **Astro** — if you want components and markdown content but no SPA overhead.
- **Next.js** — if engineering signal matters for your target roles and you want a blog with decent DX.

Avoid: anything with a CMS, anything that needs a database, anything that takes more than a day to set up. The site should not become the project.

## Structure to aim for

```
/                  Hero (name, one-line pitch, CTA), 3–4 highlight wins, contact
/about             The longer narrative from CLAUDE.md, in prose
/work              Selected projects/wins with real numbers
/writing           (Optional) blog or essays — only if you'll actually write
/contact           Email, LinkedIn, calendar link
```

## Workflow with Claude Code

```
1. Decide the stack (above).
2. Ask Claude: "Scaffold a [stack] site in this folder.
   Use my CLAUDE.md for the about page and hero copy.
   Pull the highlight wins from the resume.
   Keep the design clean and editorial — no AI-generic gradients."
3. Iterate on copy first, design second. Ugly + true beats pretty + vague.
4. Deploy to Vercel/Netlify (both free, both work in 5 minutes from a GitHub repo).
```

## Hosting + domain

- **Domain:** yourname.com if available; yourname.dev or firstlast.io as fallbacks.
- **Hosting:** Vercel or Netlify, free tier is plenty.
- **Email forwarding:** Use the domain registrar's free forwarding to send hi@yourname.com to your real inbox.
