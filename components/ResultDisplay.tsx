import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="w-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436-3.118 2.43-7.2 3.814-11.666 3.814a22.397 22.397 0 0 1-4.755-.54.75.75 0 0 1-.54-4.755c0-4.466 1.385-8.548 3.815-11.666ZM6.9 7.397a.75.75 0 0 1 0 1.06l-1.636 1.637a5.57 5.57 0 0 0-1.572 3.193.75.75 0 0 1-1.478-.26c.25-1.42.842-2.73 1.69-3.844.85-1.112 1.96-1.928 3.235-2.38a.75.75 0 0 1 .533 1.402 5.573 5.573 0 0 0-2.383 1.656L6.9 8.457Z" clipRule="evenodd" />
              </svg>
              AI 맞춤형 이력서
            </h2>
            <p className="text-blue-100 text-sm mt-1">공고에 맞춰 최적화된 결과입니다.</p>
          </div>
          <button 
            onClick={onReset}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
          >
            다시 하기
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Key Matching Points */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 sticky top-6">
              <h3 className="font-bold text-yellow-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                </svg>
                핵심 공략 포인트
              </h3>
              <ul className="space-y-3">
                {result.keyMatchingPoints.map((point, index) => (
                  <li key={index} className="flex items-start text-sm text-yellow-900">
                    <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="prose prose-slate prose-sm md:prose-base max-w-none">
              <ReactMarkdown>{result.refinedResume}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
