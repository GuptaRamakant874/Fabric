import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  id,
  className = '',
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => {
    if (typeof opt === 'string') return opt === value;
    return opt.value === value;
  });

  const displayLabel = selectedOption
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label
    : placeholder;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-200 mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white outline-none transition-all cursor-pointer hover:border-sky-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 shadow-lg ${buttonClassName}`}
      >
        <span className={`truncate text-left ${!selectedOption && value === '' ? 'text-slate-400 font-normal' : 'text-white'}`}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-sky-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-sky-300' : ''
          }`}
        />
      </button>

      {/* Downward-Opening List */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 z-40 max-h-60 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {options.map((opt, idx) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            const isSelected = optValue === value;

            return (
              <div
                key={idx}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(optValue)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="truncate">{optLabel}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-slate-950 stroke-[3] ml-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
