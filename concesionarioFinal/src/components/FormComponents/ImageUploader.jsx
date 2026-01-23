import { useRef } from 'react';
import Button from '../Buttons/Button';
import './FormComponents.css';

const ImageUploader = ({ 
  imagePreview, 
  onFileChange, 
  onRemove, 
  disabled = false,
  label = "Imagen"
}) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="imageUploadSection">
      <h3>{label}</h3>
      
      <div className="imagePreviewContainer">
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Vista previa" className="imagePreview" />
            <Button 
              type="button" 
              variant="danger"
              onClick={onRemove}
              disabled={disabled}
            >
              Eliminar Imagen
            </Button>
          </>
        ) : (
          <div className="imagePlaceholder">
            <span>No hay imagen seleccionada</span>
          </div>
        )}
      </div>

      <div className="imageUploadControls">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          onChange={onFileChange}
          disabled={disabled}
          className="fileInput"
        />
        <Button 
          type="button"
          variant="primary"
          onClick={handleFileClick}
          disabled={disabled}
        >
          {imagePreview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
        </Button>
        <p className="fileHelpText">
          Formatos soportados: JPG, PNG, GIF, WebP
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;