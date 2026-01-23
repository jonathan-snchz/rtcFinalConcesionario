import './Modal.css';

const Modal = ({ 
  title, 
  children, 
  onClose, 
  size = 'medium',
  closeOnOverlayClick = true 
}) => {
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const sizeClasses = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large'
  };

  return (
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className={`modalContent ${sizeClasses[size]}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modalHeader">
            <h3>{title}</h3>
            {onClose && (
              <button onClick={onClose} className="closeButton">
                ×
              </button>
            )}
          </div>
        )}
        <div className="modalBody">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;