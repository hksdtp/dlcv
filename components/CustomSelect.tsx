import React, { useState, useRef, useEffect } from 'react';
import { SelectOption } from '../types';
import { ChevronDownIcon } from './icons';

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(option => option.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left px-3 py-2 border border-slate-300/70 rounded-lg bg-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={disabled}
      >
        <span className="text-slate-800">{selectedLabel}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && !disabled && (
        <div 
            className="absolute z-10 mt-1 w-full bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-lg shadow-2xl overflow-hidden animate-fade-in-down"
        >
          <ul className="py-1">
            {options.map(option => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2 text-slate-800 cursor-pointer hover:bg-indigo-500/10 ${value === option.value ? 'font-semibold bg-indigo-500/10' : ''}`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
        <style>{`
            @keyframes fade-in-down {
                from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-fade-in-down {
                animation: fade-in-down 0.15s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default CustomSelect;