import React, { useState, useEffect } from 'react';

interface InteractiveNumberLineProps {
    id: string;
    label: string;
    title?: string;
    setTitle?: React.Dispatch<React.SetStateAction<string>>;
    initialValue: number;
    step: number;
    onInitialValueChange: (value: number) => void;
    onStepChange: (value: number) => void;
    colors: {
        bg: string;
        text: string;
        border: string;
        accent: string;
    };
}

const InteractiveNumberLine: React.FC<InteractiveNumberLineProps> = ({ id, label, title, setTitle, initialValue, step, onInitialValueChange, onStepChange, colors }) => {
    const [inputValues, setInputValues] = useState({
        initialValue: String(initialValue),
        step: String(step),
    });

    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        initialValue: null,
        step: null,
    });

    useEffect(() => {
        setInputValues({
            initialValue: String(initialValue),
            step: String(step),
        });
    }, [initialValue, step]);

    const handleInputChange = (field: 'initialValue' | 'step', value: string) => {
        setInputValues(prev => ({ ...prev, [field]: value }));

        if (value.trim() === '' || isNaN(Number(value)) || !isFinite(Number(value))) {
            setErrors(prev => ({ ...prev, [field]: '숫자를 입력해요!' }));
            return;
        }

        const num = Number(value);
        setErrors(prev => ({ ...prev, [field]: null }));
        
        if (field === 'initialValue') {
            onInitialValueChange(num);
        } else {
            onStepChange(num);
        }
    };

    const hasError = !!errors.initialValue || !!errors.step;
    
    const calculateFinalValue = () => {
        if (hasError) return '?';
        const result = initialValue * step;
        if (result % 1 !== 0) {
            return parseFloat(result.toFixed(2));
        }
        return result;
    };
    
    const finalValue = calculateFinalValue();
    
    const inputClass = (hasError: boolean) =>
        `w-24 text-center text-lg font-bold rounded-full border-2 p-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
            hasError
                ? 'border-red-400 bg-red-50 text-red-600 focus:ring-red-200'
                : `${colors.border.replace('bg-', 'border-')} bg-white ${colors.text} focus:${colors.accent}`
        }`;

    return (
        <div className={`p-4 rounded-xl ${colors.bg}`}>
            {setTitle && (
                 <div className="flex items-center gap-2 mb-2">
                    <label htmlFor={`${id}-title`} className={`text-lg font-bold ${colors.text}`}>
                        재료 이름:
                    </label>
                    <input
                        type="text"
                        id={`${id}-title`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={20}
                        placeholder="예: 밀가루"
                        className={`flex-grow bg-white text-lg p-2 rounded-lg focus:outline-none focus:ring-2 ${colors.accent.replace('ring-','ring-offset-2 ring-offset-white ring-')} ${colors.text} placeholder:text-gray-400/80 border ${colors.border.replace('bg-','border-')}`}
                        aria-label={`${label} 이름`}
                    />
                </div>
            )}
            <div className="relative h-64">
                 <svg className="absolute top-0 left-0 w-full h-full z-10" aria-hidden="true">
                    <path
                        d="M 20% 50% C 30% 35%, 40% 35%, 46% 50%"
                        strokeWidth="1"
                        fill="none"
                        className={colors.border.replace('bg-', 'stroke-')}
                    />
                    <path
                        d="M 80% 50% C 70% 35%, 60% 35%, 54% 50%"
                        strokeWidth="1"
                        fill="none"
                        className={colors.border.replace('bg-', 'stroke-')}
                    />
                </svg>

                {/* Main line */}
                <div className={`absolute top-1/2 left-0 w-full h-[4px] ${colors.border} rounded-full -translate-y-1/2`}></div>

                {/* Multiplier input - on the line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex justify-center items-center z-20">
                    <div className={`flex flex-col items-center p-2 rounded-lg`}>
                        <label htmlFor={`${id}-step`} className={`text-sm font-semibold mb-1 ${colors.text} text-center`}>
                            몇 인분을<br/>만들어 볼까?
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            id={`${id}-step`}
                            value={inputValues.step}
                            onChange={(e) => handleInputChange('step', e.target.value)}
                            className={inputClass(!!errors.step)}
                            aria-invalid={!!errors.step}
                            aria-describedby={errors.step ? `${id}-step-error` : undefined}
                        />
                         {errors.step && <p id={`${id}-step-error`} className="mt-1 text-xs text-red-600" aria-live="polite">{errors.step}</p>}
                    </div>
                </div>

                {/* 0% Tick */}
                <div className="absolute left-0 top-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div className={`w-[4px] h-[26px] ${colors.border} rounded-full -translate-y-1/2`}></div>
                    <div className="mt-1 text-xl font-bold text-gray-500">0</div>
                </div>

                {/* 20% Tick */}
                <div className="absolute left-[20%] top-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div className={`w-[4px] h-[26px] ${colors.border} rounded-full -translate-y-1/2`}></div>
                     <label htmlFor={`${id}-initial`} className={`text-sm font-semibold mt-1 mb-1 ${colors.text} text-center`}>
                        1인분을 만들 때<br/>필요한 양
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        id={`${id}-initial`}
                        value={inputValues.initialValue}
                        onChange={(e) => handleInputChange('initialValue', e.target.value)}
                        className={inputClass(!!errors.initialValue)}
                        aria-invalid={!!errors.initialValue}
                        aria-describedby={errors.initialValue ? `${id}-initial-error` : undefined}
                    />
                    {errors.initialValue && <p id={`${id}-initial-error`} className="mt-1 text-xs text-red-600" aria-live="polite">{errors.initialValue}</p>}
                </div>

                {/* 80% Tick */}
                <div className="absolute left-[80%] top-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div className={`w-[4px] h-[26px] ${colors.border} rounded-full -translate-y-1/2`}></div>
                     <div className={`text-sm font-semibold mt-1 mb-1 ${colors.text} text-center`}>
                        최종적으로<br/>필요한 재료
                    </div>
                    <div className={`w-24 h-11 flex items-center justify-center text-center text-lg font-bold rounded-full ${colors.border} ${colors.text} bg-white`}>
                        {finalValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveNumberLine;