import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({
  label,
  value,
  onChange,
  error,
  required,
  name,
  disabled,
  min,
  className = ""
}) => {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    if (inputRef.current && !disabled) {
      try {
        inputRef.current.showPicker();
      } catch (err) {
        // Fallback for browsers that don't support showPicker on click
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={`space-y-1.5 w-full cursor-pointer ${className}`}>
      {label && (
        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div 
        onClick={handleContainerClick}
        className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
          error ? 'border-red-500 focus-within:border-red-500' : 'border-gold/20 hover:border-gold/40'
        }`}
      >
        <Calendar className="absolute left-4 w-4.5 h-4.5 text-cream/40 pointer-events-none" />
        <input
          type="date"
          ref={inputRef}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          className="text-xs w-full py-3 pl-11 pr-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none cursor-pointer font-medium"
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-semibold mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;
