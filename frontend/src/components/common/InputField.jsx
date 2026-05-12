import React from 'react';

const InputField = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    readOnly = false,
    inputMode,
    autoComplete,
    maxLength
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
                    {label}
                </label>
            )}
            <input
                id={name}
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                inputMode={inputMode}
                autoComplete={autoComplete}
                maxLength={maxLength}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                    ${readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
                    ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
                `}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default InputField;
