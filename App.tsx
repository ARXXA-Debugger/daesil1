import React, { useState } from 'react';
import InteractiveNumberLine from './components/InputGroup';
import { GithubIcon } from './components/Icons';

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
                <a href="https://github.com/gemini-apps/double-number-line" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gray-700 transition-colors">
                    <GithubIcon className="w-5 h-5" />
                    View on GitHub
                </a>
            </footer>
        </div>
    );
};

export default App;