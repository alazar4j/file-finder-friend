# Navy and Gold Single-Page Refresh

## Scope
- Replace the existing parchment and wood palette with semantic deep-navy surfaces, warm-gold accents, and high-contrast light text.
- Rework the header into a desktop link row and a compact mobile hamburger menu with smooth open/close behavior.
- Keep one continuous home page and reorder it to: header, hero, service times, about/ministries, giving/bank information, contact/map, member access, footer.
- Preserve existing church content, bilingual switching, sign-in, giving, map, and direct-link fallback pages.

## Verification
- Check the live page at mobile and desktop sizes for vertical order, menu behavior, anchor scrolling, overflow, readability, and loading errors.
- Confirm the current build is healthy after the package security update.

## Technical details
- Apply the palette through existing semantic tokens in the global stylesheet, then update section-level classes to use those tokens.
- Use the existing button component for menu controls and close the mobile menu after navigation.
- Keep legacy routes as direct-link fallbacks while the public navigation targets anchored home sections.
