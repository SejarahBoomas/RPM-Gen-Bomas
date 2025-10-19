
import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea';
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  rows = 3,
}) => {
  const commonClasses = "block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          className={commonClasses}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          className={commonClasses}
        />
      )}
    </div>
  );
};

export default FormField;
