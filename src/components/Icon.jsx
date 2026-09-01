import { resolveIcon } from '../data/icons';

/**
 * Material Symbols Rounded icon.
 *
 * Purely decorative by default (aria-hidden) — every icon in this app is paired
 * with a visible text label or an aria-label on its parent control, so screen
 * readers never depend on the glyph. Pass `label` to make it announced.
 *
 * @param {string} name    semantic key from data/icons.js
 * @param {number} size    px — drives font-size and optical sizing
 * @param {boolean} fill   use the filled variant
 * @param {number} weight  100–700 stroke weight
 */
export default function Icon({
  name,
  size = 24,
  fill = false,
  weight = 400,
  grade = 0,
  label,
  className = '',
  style,
  ...rest
}) {
  // Material Symbols' opsz axis only spans 20–48; clamp so large display icons
  // stay optically correct instead of silently falling back.
  const opsz = Math.min(48, Math.max(20, size));

  return (
    <span
      className={`icon ${className}`}
      translate="no"
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
        ...style,
      }}
      {...rest}
    >
      {resolveIcon(name)}
    </span>
  );
}
