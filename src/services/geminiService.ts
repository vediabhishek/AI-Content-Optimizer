import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AnalysisResults } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeContentWithGemini = async (text: string, url?: string): Promise<AnalysisResults> => {
  const prompt = `
    Perform a comprehensive content optimization audit using real-time Google Search data and URL context to enhance accuracy and relevance. 
    Analyze the provided content for AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), AIO (AI Overviews), and Google Guidelines.
    
    ${url ? `TARGET URL: ${url}` : ""}
    ${text ? `CONTENT TO ANALYZE:\n${text}` : "Please fetch and analyze the content from the provided URL."}
    
    Use Google Search and URL Context to:
    1. Identify current trends and authoritative statistics related to the content's topic.
    2. Verify facts and find recent developments that could improve the content's GEO and AIO scores.
    3. Find relevant authoritative sources for potential citations.
    4. Fetch and analyze the content from the provided URL if available.
    
    Provide:
    1. Scores (0-100) for each framework based on current search landscape.
    2. A detailed checklist (status, issue, why, fix) with specific real-time insights.
    3. Optimized AEO paragraph, H2 questions, and a direct answer block (approx 50 words).
    4. Priority tasks to improve search visibility.
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }, { urlContext: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            frameworks: {
              type: Type.OBJECT,
              properties: {
                AEO: { 
                  type: Type.OBJECT, 
                  properties: { 
                    score: { type: Type.NUMBER },
                    checklist: { 
                      type: Type.ARRAY, 
                      items: { 
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          label: { type: Type.STRING },
                          status: { type: Type.STRING },
                          issue: { type: Type.STRING },
                          why: { type: Type.STRING },
                          fix: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    }
                  } 
                },
                GEO: { 
                  type: Type.OBJECT, 
                  properties: { 
                    score: { type: Type.NUMBER },
                    checklist: { 
                      type: Type.ARRAY, 
                      items: { 
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          label: { type: Type.STRING },
                          status: { type: Type.STRING },
                          issue: { type: Type.STRING },
                          why: { type: Type.STRING },
                          fix: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    }
                  } 
                },
                AIO: { 
                  type: Type.OBJECT, 
                  properties: { 
                    score: { type: Type.NUMBER },
                    checklist: { 
                      type: Type.ARRAY, 
                      items: { 
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          label: { type: Type.STRING },
                          status: { type: Type.STRING },
                          issue: { type: Type.STRING },
                          why: { type: Type.STRING },
                          fix: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    }
                  } 
                },
                GGL: { 
                  type: Type.OBJECT, 
                  properties: { 
                    score: { type: Type.NUMBER },
                    checklist: { 
                      type: Type.ARRAY, 
                      items: { 
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          label: { type: Type.STRING },
                          status: { type: Type.STRING },
                          issue: { type: Type.STRING },
                          why: { type: Type.STRING },
                          fix: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    }
                  } 
                }
              }
            },
            suggestions: {
              type: Type.OBJECT,
              properties: {
                aeoParagraph: { type: Type.STRING },
                h2Headings: { type: Type.ARRAY, items: { type: Type.STRING } },
                directAnswer: { type: Type.STRING }
              }
            },
            priorityActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  impact: { type: Type.ARRAY, items: { type: Type.STRING } },
                  priority: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Add schemaMarkups locally since they are more template-based or can be generated by Gemini too
    // For now, let's generate them based on the Gemini response
    const schemaMarkups: Array<{ type: string; code: string }> = [];
    
    // FAQ
    schemaMarkups.push({
      type: 'FAQPage',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "${result.suggestions?.h2Headings?.[0] || 'Key Question'}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${result.suggestions?.directAnswer || ''}"
      }
    }
  ]
}
</script>`
    });

    // Article
    schemaMarkups.push({
      type: 'Article',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${text.split('\n')[0].slice(0, 100)}",
  "datePublished": "${new Date().toISOString().split('T')[0]}",
  "description": "${result.suggestions?.directAnswer?.slice(0, 160)}..."
}
</script>`
    });

    return {
      ...result,
      suggestions: {
        ...result.suggestions,
        schemaMarkups
      }
    };
  } catch (error: any) {
    console.error("Detailed Gemini Analysis Error:", {
      message: error.message,
      stack: error.stack,
      status: error.status || error.statusCode,
      details: error.details,
    });
    
    const statusCode = error.status || error.statusCode || "UNKNOWN_STATUS";
    const errorMessage = error.message || "An unexpected error occurred during analysis.";
    
    throw new Error(`Gemini API Error [${statusCode}]: ${errorMessage}`);
  }
};
