# DESIGN SYSTEM MASTER: Sepotifi AI Studio (Next.js)

Generated via `ui-ux-pro-max` + Custom **Spotify Studio Command Center** Architecture.

## 1. Visual Identity (Spotify Palette, Custom Studio Layout)
- **Colors**: `#000000` outer frame, `#121212` main canvas, `#181818` cards, `#242424` interactive inputs, `#1ED760` Spotify Green CTA, `#FFFFFF` primary text, `#B3B3B3` subdued text.
- **Distinct Layout (Not a 1:1 Spotify Web Clone)**:
  - **Left Studio Navigation Rail (`w-64`)**: Dedicated switcher between **AI Mix Studio**, **Massive Listening DNA**, and **Quick Presets**, plus Account & Multi-User Login status.
  - **AI DJ Composer Deck (Dedicated Hero Card)**: Placed prominently inside the AI Mix Studio workspace (never cramped inside a top search bar).
  - **Non-Blinking Shimmer Skeletons & Step Progress**: Smooth overlay + skeleton rows during API fetches and parallel track resolution.
  - **Consistent Bottom Audio Bar**: Fixed transport controls (`Shuffle`, `Prev`, `Play/Pause`, `Next`, `Repeat` + live progress bar) that never jump or morph when clicked, paired with a collapsible Mini Embed Dock on the right.
