import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
당신은 대한민국 최고의 취업 컨설턴트이자 인사 담당자(HR Specialist)입니다. 
사용자가 제공하는 '채용 공고 이미지(스크린샷)'와 '기존 이력서 텍스트'를 분석하여, 해당 채용 공고에 최적화된 맞춤형 이력서 내용을 작성해야 합니다.

다음 단계로 작업을 수행하세요:
1. **채용 공고 분석**: 이미지에서 회사명, 직무, 주요 업무, 자격 요건, 우대 사항, 기술 스택 등을 정확하게 파악하세요.
2. **이력서 매칭**: 사용자의 기존 이력서에서 채용 공고와 연관된 경험과 역량을 찾아내세요.
3. **이력서 첨삭 (핵심)**: 
    - 채용 공고의 키워드를 자연스럽게 녹여내세요.
    - 자기소개서 도입부나 경력 기술서의 요약 부분을 해당 직무에 맞춰 매력적으로 재작성하세요.
    - 불필요한 내용은 줄이고, 직무와 관련된 성과는 수치화하거나 구체화하여 강조하세요.
4. **매칭 포인트 요약**: 왜 이렇게 수정했는지, 어떤 부분이 공고와 잘 맞는지 3가지 핵심 포인트를 요약해주세요.

출력은 반드시 JSON 형식을 따르십시오.
`;

const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const refineResumeWithGemini = async (
  jobPostingFile: File,
  currentResume: string
): Promise<AnalysisResult> => {
  try {
    const imagePart = await fileToPart(jobPostingFile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            imagePart,
            { text: `다음은 나의 현재 이력서 내용입니다:\n\n${currentResume}\n\n이 내용을 첨부된 채용 공고 이미지에 맞춰서 합격 확률을 높일 수 있도록 전문적으로 수정하고 다듬어주세요.` }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedResume: {
              type: Type.STRING,
              description: "Markdown format of the refined resume content",
            },
            keyMatchingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 key reasons why this refinement matches the job",
            },
          },
          required: ["refinedResume", "keyMatchingPoints"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
        throw new Error("No response from Gemini");
    }

    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Error refining resume:", error);
    throw error;
  }
};
