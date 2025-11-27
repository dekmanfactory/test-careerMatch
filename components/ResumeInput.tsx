import React from 'react';

interface ResumeInputProps {
  resumeText: string;
  setResumeText: (text: string) => void;
}

const ResumeInput: React.FC<ResumeInputProps> = ({ resumeText, setResumeText }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        2. 기존 이력서 내용 복사 & 붙여넣기
      </label>
      <textarea
        className="w-full flex-grow p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm leading-relaxed resize-none h-64 md:h-auto"
        placeholder="이력서의 핵심 역량, 경력 기술서, 자기소개서 등을 여기에 붙여넣으세요..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      ></textarea>
    </div>
  );
};

export default ResumeInput;
