import './Button.css';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  fullWidth = false
}) => {
  const variantClasses = {
    primary: 'buttonPrimary',
    secondary: 'buttonSecondary',
    danger: 'buttonDanger',
    success: 'buttonSuccess',
    warning: 'buttonWarning',
    ghost: 'buttonGhost'
  };

  const sizeClasses = {
    small: 'buttonSmall',
    medium: 'buttonMedium',
    large: 'buttonLarge'
  };

  const buttonClass = `button ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'buttonFullWidth' : ''} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;