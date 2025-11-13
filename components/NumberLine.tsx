
import React from 'react';
import { NumberLineConfig } from '../types';

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

export default NumberLine;
