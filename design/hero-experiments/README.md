# Hero experiments

Snapshots of each destination-step hero variant tried, so any of them can be
restored without reconstructing from conversation history. These are **not**
live code — `src/...` is always the current, running version; these are
copies frozen at the moment each variant was replaced.

To restore a variant: copy its files back over the matching path under
`src/`, reinstate any imports/props the current `StepDestination.tsx`
expects, and check `npx tsc --noEmit` / `npm run build`.

## Variants

| Folder | What it was | Replaced by | Date |
|---|---|---|---|
| `c-photo-rotator/` | Split hero (text left, controls inline) with a slow-crossfading `<PhotoRotator>` on the right cycling through the 9 non-featured destinations; clicking it selects whichever city is showing. Same `PhotoCard` overlay treatment as the grid. | Option A (full-bleed photo hero) | 2026-09-04 |

Earlier variants (a plain asymmetric split with one static "wing over clouds"
mood photo; before that, a text-only header with no photo at all) were
overwritten before this log started and aren't snapshotted — see
`design/DESIGN.md` §7 and the project memory for a description of what they
looked like.
