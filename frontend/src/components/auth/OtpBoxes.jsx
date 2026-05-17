import React, { useRef } from 'react';

function digitsOnly(value) {
    return String(value ?? '').replace(/\D/g, '').slice(0, 6);
}

export default function OtpBoxes({ value, onChange, disabled }) {
    const inputsRef = useRef([]);
    const digits = digitsOnly(value).padEnd(6, ' ').split('').map((c) => (c === ' ' ? '' : c));

    const emit = (nextDigits) => {
        onChange(digitsOnly(nextDigits.join('')));
    };

    const handleChange = (index, raw) => {
        const d = digitsOnly(raw);
        const next = [...digits];
        if (d.length > 1) {
            const chars = d.split('');
            for (let i = 0; i < 6; i += 1) {
                next[i] = chars[i] ?? '';
            }
            emit(next);
            const focusIdx = Math.min(chars.length, 5);
            inputsRef.current[focusIdx]?.focus();
            return;
        }
        next[index] = d;
        emit(next);
        if (d && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = digitsOnly(e.clipboardData.getData('text'));
        if (!pasted) return;
        const chars = pasted.split('');
        const next = [...digits];
        for (let i = 0; i < 6; i += 1) {
            next[i] = chars[i] ?? '';
        }
        emit(next);
        inputsRef.current[Math.min(chars.length, 5)]?.focus();
    };

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, index) => (
                <React.Fragment key={index}>
                    {index === 3 && (
                        <span className="px-0.5 text-xl font-bold text-outline-variant" aria-hidden>
                            -
                        </span>
                    )}
                    <input
                        ref={(el) => {
                            inputsRef.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        maxLength={6}
                        value={digit}
                        disabled={disabled}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="h-14 w-11 rounded-xl border-none bg-surface-container text-center text-2xl font-bold text-on-surface focus:ring-2 focus:ring-primary sm:w-12"
                        aria-label={`Digit ${index + 1}`}
                    />
                </React.Fragment>
            ))}
        </div>
    );
}
