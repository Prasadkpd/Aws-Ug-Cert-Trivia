import { motion } from 'framer-motion';
import Icon from './Icon';

const ICON_SIZE = { sm: 20, md: 22, lg: 26, xl: 30, hero: 34 };

/**
 * The single button primitive for the whole app.
 *
 * variant: primary | secondary | prize | ghost | danger
 * size:    sm | md | lg | xl | hero
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  iconFill = false,
  pulse = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}) {
  const iconSize = ICON_SIZE[size] ?? 22;

  return (
    <motion.button
      type="button"
      className={[
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? 'btn--full' : '',
        pulse && !disabled ? 'btn--pulse' : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 0, scale: 0.985 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {icon && <Icon name={icon} size={iconSize} fill={iconFill} className="btn__icon" />}
      <span className="btn__label">{children}</span>
      {iconAfter && <Icon name={iconAfter} size={iconSize} fill={iconFill} className="btn__icon" />}
    </motion.button>
  );
}
