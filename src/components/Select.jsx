import React from 'react';

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  name,
  disabled,
  className = ""
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`text-xs w-full py-3 px-4 bg-white border rounded-md cursor-pointer focus:outline-none focus:border-rosegold focus:ring-1 focus:ring-rosegold/30 transition-all duration-300 appearance-none ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gold/20 hover:border-gold/40'
          } ${value ? 'text-cream font-medium' : 'text-cream/50'}`}
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231C1A17' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
            backgroundPosition: 'right 16px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '14px'
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options && options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="text-cream bg-white font-medium">
              {opt.label}
            </option>
          ))}

        </select>
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-semibold mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default Select;
