import type { ChangeEventHandler, ReactNode } from 'react';

interface AuthFieldProps {
    id: string;
    label: string;
    icon?: string;
    type?: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
    error?: string;
    placeholder?: string;
    autoComplete?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    maxLength?: number;
    rightSlot?: ReactNode;
    as?: 'input' | 'select';
    children?: ReactNode;
}

export default function AuthField({
    id,
    label,
    icon,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    autoComplete,
    inputMode,
    maxLength,
    rightSlot,
    as = 'input',
    children
}: AuthFieldProps) {
    const inputClass = `h-14 w-full rounded-xl border-none bg-surface-container text-base text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 ${
        icon ? 'pl-12' : 'pl-4'
    } ${rightSlot ? 'pr-12' : 'pr-4'} ${error ? 'ring-2 ring-error/30' : ''}`;

    return (
        <div>
            <label htmlFor={id} className="mb-2 ml-1 block text-xs font-semibold text-on-surface-variant">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <span className="material-symbols-outlined absolute left-4 top-1/2 z-10 -translate-y-1/2 text-on-surface-variant">
                        {icon}
                    </span>
                )}
                {as === 'select' ? (
                    <select
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        className={`${inputClass} appearance-none`}
                    >
                        {children}
                    </select>
                ) : (
                    <input
                        id={id}
                        name={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        maxLength={maxLength}
                        className={inputClass}
                    />
                )}
                {rightSlot}
            </div>
            {error && <p className="mt-1 ml-1 text-xs text-error">{error}</p>}
        </div>
    );
}
