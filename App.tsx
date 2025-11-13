
import React, { useState, useEffect } from 'react';

// From types.ts
export interface NumberLineConfig {
  initialValue: number;
  step: number;
}

// From components/Icons.tsx
export const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);


// From components/InputGroup.tsx
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

// From components/NumberLine.tsx
interface NumberLineProps {
  config: NumberLineConfig;
  numTicks: number;
  isTopLine: boolean;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

const NumberLine: React.FC<NumberLineProps> = ({ config, numTicks, isTopLine, textColor, borderColor, bgColor }) => {
    const values = Array.from({ length: numTicks }, (_, i) => config.initialValue + i * config.step);

    // Format numbers to avoid excessive length
    const formatNumber = (num: number) => {
        if (Number.isInteger(num)) {
            return num;
        }
        if (Math.abs(num) > 1000 || Math.abs(num) < 0.01 && Math.abs(num) > 0) {
            return num.toExponential(1);
        }
        return parseFloat(num.toFixed(2));
    };

    return (
        <div className="relative">
            {/* The main horizontal line */}
            <div className={`absolute left-0 right-0 h-0.5 ${bgColor} ${isTopLine ? 'bottom-0' : 'top-0'}`}></div>

            <div className="flex justify-between items-center">
                {values.map((value, i) => (
                    <div
                        key={i}
                        className={`relative flex justify-center items-center ${i === 0 || i === numTicks - 1 ? 'w-px' : 'flex-1'}`}
                    >
                        <div className={`flex flex-col items-center ${isTopLine ? 'pb-2' : 'pt-2'}`}>
                            {/* Tick value */}
                            <span className={`text-xs md:text-sm font-medium ${textColor} ${isTopLine ? 'order-1 -mt-1' : 'order-2 mt-1'}`}>
                                {formatNumber(value)}
                            </span>

                            {/* Tick mark */}
                            <div className={`w-0.5 h-3 ${bgColor} ${isTopLine ? 'order-2' : 'order-1'}`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Define playful color themes
const THEMES = {
    sky: {
        bg: 'bg-sky-100',
        text: 'text-sky-800',
        border: 'bg-sky-400',
        accent: 'ring-sky-300'
    },
    cyan: {
        bg: 'bg-cyan-100',
        text: 'text-cyan-800',
        border: 'bg-cyan-400',
        accent: 'ring-cyan-300'
    }
};

const App: React.FC = () => {
    // State for initial values and a shared multiplier
    const [line1InitialValue, setLine1InitialValue] = useState(2);
    const [line2InitialValue, setLine2InitialValue] = useState(5);
    const [multiplier, setMultiplier] = useState(3);
    const [ingredient1Name, setIngredient1Name] = useState('밀가루');
    const [ingredient2Name, setIngredient2Name] = useState('설탕');
    const [dishName, setDishName] = useState('맛있는 쿠키 만들기');


    return (
        <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
                <header className="text-center">
                    <input
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="요리 이름을 입력하세요"
                        aria-label="요리 이름"
                        className="text-4xl font-bold text-gray-700 text-center w-full max-w-lg mx-auto bg-sky-50/50 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition placeholder:text-gray-400"
                    />
                    <p className="mt-2 text-lg text-gray-500">이중수직선에 값을 넣어보며 비의 성질을 알아봅시다.</p>
                    <div className="text-4xl mt-4">🍪🍩🧁🍰</div>
                </header>
                <main className="space-y-6">
                    <InteractiveNumberLine
                        id="line1"
                        label="첫 번째 재료"
                        title={ingredient1Name}
                        setTitle={setIngredient1Name}
                        initialValue={line1InitialValue}
                        step={multiplier}
                        onInitialValueChange={setLine1InitialValue}
                        onStepChange={setMultiplier}
                        colors={THEMES.sky}
                    />
                    <InteractiveNumberLine
                        id="line2"
                        label="두 번째 재료"
                        title={ingredient2Name}
                        setTitle={setIngredient2Name}
                        initialValue={line2InitialValue}
                        step={multiplier}
                        onInitialValueChange={setLine2InitialValue}
                        onStepChange={setMultiplier}
                        colors={THEMES.cyan}
                    />
                </main>
            </div>
             <footer className="text-center mt-8 text-gray-500">
                <a href="https://github.com/google-gemini" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gray-700 transition-colors">
                    <GithubIcon className="w-5 h-5" />
                    GitHub에서 보기
                </a>
            </footer>
        </div>
    );
};

export default App;
