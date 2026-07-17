// Shared design tokens — light background, gold accent, legible sans-serif.
// Swap values here to retune the whole site's look.

export const GOLD        = "#c2a12b" // accent: borders, small UI fills — NOT for solid-fill button text contrast
export const GOLD_DARK   = "#766119" // accent text/labels on light bg — ~6:1 contrast on white (was too pale at #8d741c, ~4.5:1)
export const GOLD_BRIGHT = "#e3b93a" // hover / active accent, dark backgrounds only

export const INK       = "#241f0f" // primary body text — also use as button text on GOLD fills (GOLD is too light for white text, ~2.5:1)
export const INK_SOFT  = "#463c2c" // secondary / muted text — darkened for extra legibility margin (was #5c5240)

export const BG        = "#fffdf9" // page background
export const BG_ALT    = "#f7f2e6" // alternate section background
export const CARD      = "#ffffff" // card background
export const BORDER    = "#e7ddc4" // default border
export const BORDER_STRONG = "#d8c791" // hover / active border

export const FONT = "'DM Sans', sans-serif"

export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');"

// Dark tokens — reserved for Navbar/Footer, which keep the dark design.
// Text stays full-opacity/bold for legibility (unlike the old low-contrast thin serif).
export const DARK_BG     = "#100d07" // navbar / footer background
export const DARK_BG_ALT = "#0a0805" // secondary dark surface (footer bottom bar)
export const DARK_BORDER = "#c2a12b33" // subtle gold-tinted border on dark
export const LIGHT_TEXT      = "#f5f1e8" // primary text on dark
export const LIGHT_TEXT_SOFT = "#c8c0aa" // secondary/muted text on dark
