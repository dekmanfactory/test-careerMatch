import React, { useState } from 'react';
import JobUploader from './components/JobUploader';
import ResumeInput from './components/ResumeInput';
import ResultDisplay from './components/ResultDisplay';
import { refineResumeWithGemini } from './services/geminiService';
import { LoadingState, AnalysisResult } from './types';

function App() {
  const [jobImage, setJobImage] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!jobImage || !resumeText.trim()) {
      setErrorMessage("채용 공고 이미지와 이력서 내용을 모두 입력해주세요.");
      return;
    }

    setLoadingState(LoadingState.PROCESSING);
    setErrorMessage(null);

    try {
      const data = await refineResumeWithGemini(jobImage, resumeText);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
      setErrorMessage("이력서를 생성하는 도중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleReset = () => {
    setLoadingState(LoadingState.IDLE);
    setResult(null);
    setErrorMessage(null);
    // Keep inputs for better UX, or clear them if preferred
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CareerMatch <span className="text-blue-600">AI</span></h1>
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">사람인/잡코리아 공고 맞춤 이력서 첨삭</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {loadingState === LoadingState.SUCCESS && result ? (
          <ResultDisplay result={result} onReset={handleReset} />
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-3xl font-bold text-slate-900">내 이력서, 공고에 딱 맞게 수정해드려요</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                채용 공고 스크린샷과 내 이력서를 입력하면, AI가 직무 핵심 키워드를 추출하여 
                합격률 높은 맞춤형 이력서로 다시 작성해줍니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Image Upload */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <JobUploader 
                  onFileSelect={setJobImage} 
                  selectedFile={jobImage} 
                />
              </div>

              {/* Right Column: Resume Input */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[300px] flex flex-col">
                <ResumeInput 
                  resumeText={resumeText} 
                  setResumeText={setResumeText} 
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-center max-w-2xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </div>
            )}

            {/* Action Button Area */}
            <div className="flex justify-center pt-4 pb-10">
              <button
                onClick={handleProcess}
                disabled={loadingState === LoadingState.PROCESSING}
                className={`
                  group relative flex items-center justify-center px-8 py-4 text-lg font-bold text-white rounded-full shadow-xl shadow-blue-200 transition-all
                  ${loadingState === LoadingState.PROCESSING 
                    ? 'bg-blue-400 cursor-not-allowed pr-12' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'}
                `}
              >
                {loadingState === LoadingState.PROCESSING ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    분석 및 작성 중...
                  </>
                ) : (
                  <>
                    AI 이력서 첨삭 받기
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                      <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} CareerMatch AI. Powered by Google Gemini.
        </div>
      </footer>
    </div>
  );
}

export default App;
