import React, { useState } from 'react';
import FormSelect from '../FormComponents/FormSelect';
import FormInput from '../FormComponents/FormInput';
import Button from '../Buttons/Button';
import './GenericFilters.css';

const GenericFilters = ({ config, filters, updateFilter, resetFilters, uniqueValues }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const getOptions = (field) => {
    return ['', ...(uniqueValues[field.key] || [])];
  };

  return (
    <div className="filtersContainer">
      <div className="filtersHeader">
        <h3>Filtros</h3>
        <Button 
          variant="ghost" 
          size="small"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
      
      {showFilters && (
        <>
          <div className="filtersGrid">
            {config.fields.map(field => {
              switch (field.type) {
                case 'select':
                  return (
                    <FormSelect
                      key={field.key}
                      label={field.label}
                      value={filters[field.key] || ''}
                      onChange={(e) => updateFilter(field.key, e.target.value)}
                      options={getOptions(field)}
                    />
                  );
                
                case 'range':
                  return (
                    <div key={field.key} className="rangeGroup">
                      <label>{field.label}</label>
                      <div className="rangeInputs">
                        <FormInput
                          type="number"
                          min="0"
                          placeholder="Desde"
                          value={filters[`${field.key}Min`] || ''}
                          onChange={(e) => updateFilter(`${field.key}Min`, e.target.value)}
                        />
                        <FormInput
                          type="number"
                          min="0"
                          placeholder="Hasta"
                          value={filters[`${field.key}Max`] || ''}
                          onChange={(e) => updateFilter(`${field.key}Max`, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                
                case 'radio':
                  return (
                    <div key={field.key} className="radioGroup">
                      <label>{field.label}</label>
                      <div>
                        {field.options.map(option => (
                          <label key={option}>
                            <input
                              type="radio"
                              name={field.key}
                              value={option}
                              checked={filters[field.key] === option}
                              onChange={() => updateFilter(field.key, option)}
                            />
                            {option === 'todos' ? 'Todos' : option}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                
                default:
                  return null;
              }
            })}
          </div>
          
          <div className="filtersActions">
            <Button variant="secondary" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenericFilters;