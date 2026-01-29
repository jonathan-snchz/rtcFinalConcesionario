import './FormComponents.css';

const FormInput = ({ 
  label, 
  type = 'text', 
  register, 
  name, 
  errors, 
  placeholder, 
  disabled = false,
  required = false,
  readOnly = false,
  className = '',
  rules = {},
  value,
  onChange
}) => {
  const validationRules = {
    required: required ? `${label} es obligatorio` : false,
    ...rules
  };

  const inputProps = register ? register(name, validationRules) : {};

  return (
    <div className="formGroup">
      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        type={type}
        {...inputProps}
        disabled={disabled}
        readOnly={readOnly}
        className={`formInput ${errors?.[name] ? 'error' : ''} ${readOnly ? 'readonly' : ''} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {errors?.[name] && (
        <span className="errorMessage">{errors[name].message}</span>
      )}
    </div>
  );
};

export default FormInput;