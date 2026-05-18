# Notes for Claude / AI agents working on this repo

## Wish-to-concept flow — review is mandatory

When processing a user wish (from `wishes` table) into a new concept in
`data/concepts.js`, **always do an explicit review pass before
integrating**, and surface the result to the user.

The required steps in order:

1. **Pick the angle** — based on the wish topic + track, decide on the
   sharpest take (avoid marketing speak, lean into trade-offs / common
   misconceptions).

2. **Write the draft** — full concept object matching the schema in
   `scripts/gen-concept.mjs` (`ConceptSchema`). Either inline in this
   session or as `data/drafts/<slug>.json`.

3. **Review pass — DO NOT SKIP**
   Read the draft as a "挑刺工程師" (adversarial reviewer). Check:
   - 事實錯誤 — technical correctness, year / band / version specifics
   - 干擾選項強度 — each quiz wrong option should be plausible-but-wrong,
     not obviously absurd. If a wrong option is too weak, replace it.
   - 解說品質 — explanation answers "why" not just "what"
   - 類比破綻 — analogy mapping holds, doesn't mislead
   - 風格偏移 — engineer-targeted, hook is direct, tradeoffs explicit
   - level 是否相符 — L1 from zero, L2 prereq + tradeoffs,
     L3 assumes background + pitfall focus
   - prereq / assumedKnowledge — every concept the body references must
     either be in `prerequisites` (techbyte internal slug), in
     `assumedKnowledge` (free-text tag), or self-explained

   Output verdict (`pass` / `needs-edit` / `rewrite`) and the issue list
   to the user. **Show this to the user explicitly** — do not just
   write "verdict: pass" in commit message without surfacing the actual
   review content.

4. **Apply fixes** — if `needs-edit`, list each issue with proposed fix
   and either apply directly or ask the user to confirm.

5. **Integrate** — merge into `data/concepts.js` with a real
   `releaseDay`. Check `MAX_BATCH_END_DAY` in `app/recap/[batch]/page.jsx`
   if Day > 25.

6. **Provide the SQL** to mark the originating wish as published:
   ```sql
   UPDATE wishes
   SET status='published', linked_concept_slug='<slug>'
   WHERE id='<wish-id>';
   ```

## What "review skip" looks like — don't do this

Bad pattern: writing concept directly into `data/concepts.js`, opening
a PR, and saying "verdict: pass" in the commit message without showing
the user the review content. Even if the concept is good, the process
hides quality control from the user.

Good pattern: produce a visible review block before integrating, list
issues with severity (blocker / warn / nit), let user see what was
considered and what was decided.

This rule exists because on 2026-05-18 a wish was integrated without
review and the user caught the omission. Don't repeat.
