
import React from 'react';

interface DropdownProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showPlaceholder?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onChange, disabled = false, showPlaceholder = true }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
      className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
    >
      {showPlaceholder && <option value="" disabled hidden>{selectedValue === "" ? "Selecciona..." : selectedValue}</option>}
      {options.map((option, index) => (
        <option key={index} value={option} className="bg-slate-700 text-slate-100">
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
