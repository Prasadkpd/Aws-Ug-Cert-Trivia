/**
 * Official AWS User Group Colombo lockup.
 *
 * The supplied artwork is a 4:1 banner with an opaque #1C222E field, so it is
 * presented on a matching "brand plate" rather than blended into the page.
 * That keeps the logo pixel-accurate and unmodified at every size — the one
 * thing you must never get wrong with someone else's mark.
 */

const SIZES = {
  sm:   'logo',
  lg:   'logo logo--lg',
  hero: 'logo logo--hero',
};

export default function Logo({ size = 'sm', className = '', ...rest }) {
  return (
    <span className={`${SIZES[size] ?? SIZES.sm} ${className}`.trim()} {...rest}>
      <img
        className="logo__img"
        src="/brand/awsug-colombo-logo.png"
        alt="AWS User Groups Colombo"
        width={1024}
        height={256}
        draggable="false"
      />
    </span>
  );
}
