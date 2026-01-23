import './FormComponents.css';

const FormSelect = ({ 
  label, 
  register, 
  name, 
  errors, 
  options, 
  disabled = false,
  required = false,
  className = '',
  value,
  onChange
}) => {
  const selectProps = register ? register(name, { 
    required: required ? `${label} es requerido` : false 
  }) : {};

  return (
    <div className="formGroup">
      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <select
        {...selectProps}
        disabled={disabled}
        className={`formSelect ${errors?.[name] ? 'error' : ''} ${className}`}
        value={value}
        onChange={onChange}
      >
        <option value="">Seleccionar {label.toLowerCase()}</option>
        {options.map((option, index) => {
          if (typeof option === 'string') {
            return (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            );
          }
          if (option && typeof option === 'object') {
            return (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            );
          }
          return null;
        })}
      </select>
      {errors?.[name] && (
        <span className="errorMessage">{errors[name].message}</span>
      )}
    </div>
  );
};

export default FormSelect;