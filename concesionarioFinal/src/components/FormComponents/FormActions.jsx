import Button from '../Buttons/Button';
import './FormComponents.css';

const FormActions = ({ 
  loading = false, 
  isEditMode = false, 
  onCancel,
  submitText = null,
  cancelText = 'Cancelar',
  submitVariant = 'success',
  showCancel = true,
  className = ''
}) => {
  const getSubmitText = () => {
    if (submitText) return submitText;
    if (loading) return 'Guardando...';
    return isEditMode ? 'Actualizar' : 'Agregar';
  };

  return (
    <div className={`formActions ${className}`}>
      <Button 
        type="submit" 
        variant={submitVariant}
        disabled={loading}
      >
        {getSubmitText()}
      </Button>
      
      {showCancel && onCancel && (
        <Button 
          type="button" 
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
      )}
    </div>
  );
};

export default FormActions;