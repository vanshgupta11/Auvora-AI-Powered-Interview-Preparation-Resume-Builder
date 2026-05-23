const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require('zod-to-json-schema');
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),

//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),

//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })

const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: { type: "number" },
    title: { type: "string" },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"]
      }
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["skill", "severity"]
      }
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: { type: "array", items: { type: "string" } }
        },
        required: ["day", "focus", "tasks"]
      }
    },

  },
  required: ["matchScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


  const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        You MUST generate at least 5 technicalQuestions and 5 behavioralQuestions.`

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    }
  })
  console.log("Raw Gemini response:", response.text);
  return JSON.parse(response.text)


}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" })

  const pdfBuffer = await page.pdf({
    format: "A4",

  })

  await browser.close()

  return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
  })

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional also use google xyz rule to increase ATS.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        there should be no errors in spelling and grammer. enhance ATS by implementing various techniques.
                        The resume should not be  lengthy, it should be only and only 1 page long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    }
  })

  const jsonContent = JSON.parse(response.text)

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

  return pdfBuffer

}

async function generateResume2Pdf({ resume, jobDescription }) {

  const resumePdfSchema = z.object({
    html: z.string().describe("ATS-optimized resume HTML"),
    atsAnalysis: z.object({
      score: z.number().describe("Estimated ATS score 0-100"),
      keywordsMatched: z.array(z.string()),
      suggestions: z.array(z.string())
    })
  });

  // Step 1: Extract keywords from JD first
  const keywordPrompt = `
    Analyze this job description and extract:
    1. Hard skills (tools, technologies, languages)
    2. Soft skills explicitly mentioned
    3. Certifications or qualifications required
    4. Exact job title variants used
    5. Industry-specific terminology

    Return ONLY a JSON object:
    {
      "hardSkills": [],
      "softSkills": [],
      "certifications": [],
      "titles": [],
      "industryTerms": []
    }

    Job Description: ${jobDescription}
  `;

  const keywordResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: keywordPrompt,
    config: { responseMimeType: "application/json" }
  });

  const keywords = JSON.parse(keywordResponse.text);

  // Step 2: Generate ATS-optimized resume
  const resumePrompt = `
    You are an expert resume writer and ATS optimization specialist.
    
    CANDIDATE DATA: ${resume}
   
    Generate an ATS-optimized, single-page HTML resume following ALL these rules:

    ## ATS PARSING RULES (Critical)
    - Use standard section headers EXACTLY: "Work Experience", "Education", "Skills", "Summary", "Certifications"
    - NO tables, NO multi-column layouts, NO text boxes, NO graphics, NO SVGs
    - NO headers/footers in HTML (ATS often skips them)
    - Use plain <ul> and <li> for bullet points, never CSS-generated bullets
    - All text must be selectable (no images of text)
    - Dates in consistent format: "Jan 2022 – Mar 2024" or "2022 – 2024"
    - Job titles before company names in each entry
    - Phone: digits only grouping like +1 (555) 123-4567
    - Email as plain text, not a mailto link

    ## KEYWORD INTEGRATION RULES
    - Include EVERY keyword from hardSkills, industryTerms in the Skills section verbatim
    - Mirror the exact job title from the JD in the Summary or current role if truthful
    - Naturally weave softSkills into bullet points (don't list them separately)
    - Use both acronyms AND spelled-out forms: "Search Engine Optimization (SEO)"
    - Use keywords from the JD in context, not just listed

    ## CONTENT QUALITY RULES (Human-sounding)
    - Lead each bullet with a strong action verb: "Engineered", "Spearheaded", "Reduced", "Grew"
    - Quantify achievements: percentages, dollar amounts, time saved, team size
    - Use CAR format: Context → Action → Result where possible
    - NO clichés: "results-driven", "team player", "passionate", "synergy"
    - Summary: 2–3 sentences, include years of experience + top 2 skills + key achievement
    - Write in third-person implied (no "I" or "My")

    ## HTML/CSS RULES (ATS-safe + visually professional)
    - Single column layout only
    - Font: system-safe stack: font-family: 'Arial', 'Helvetica Neue', sans-serif
    - Font sizes: name 18–20px, section headers 13–14px, body 11–12px
    - Use font-weight: bold for headers, NOT h1/h2/h3 tags (use <p> or <div> with bold)
    - Line-height: 1.4–1.5
    - Margins: 0.5in on all sides for PDF
    - Section headers: ALL CAPS or Title Case with a simple bottom border
    - Color: use ONLY for your name and section headers (one accent color, e.g. #1a4f8a)
    - NO background colors on sections, NO colored boxes
    - Page size hint: @page { size: A4; margin: 0.5in; }

  `;

  const resumeResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: resumePrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    }
  });

  const result = JSON.parse(resumeResponse.text);
  console.log("generateResume2Pdf raw result keys:", Object.keys(result));
  console.log("atsAnalysis present:", !!result.atsAnalysis);
  if (result.atsAnalysis) {
    console.log("atsAnalysis.score:", result.atsAnalysis.score);
  }

  // Provide a default atsAnalysis if the model didn't return one
  const atsAnalysis = result.atsAnalysis || {
    score: 75,
    keywordsMatched: [],
    suggestions: ["ATS analysis was not returned by the model — consider reviewing manually."]
  };

  // Step 3: Self-critique and refine if score < 90
  if (atsAnalysis.score < 90) {
    try {
      const refinedResult = await refineResume({ ...result, atsAnalysis }, keywords, jobDescription);
      const pdfBuffer = await generatePdfFromHtml(refinedResult.html);
      return { pdfBuffer, atsAnalysis: refinedResult.atsAnalysis || atsAnalysis };
    } catch (refineError) {
      console.warn("Resume refinement failed, using initial result:", refineError.message);
      const pdfBuffer = await generatePdfFromHtml(result.html);
      return { pdfBuffer, atsAnalysis };
    }
  }

  const pdfBuffer = await generatePdfFromHtml(result.html);
  return { pdfBuffer, atsAnalysis };
}


async function refineResume(previousResult, keywords, jobDescription) {
  const refineSchema = z.object({
    html: z.string(),
    atsAnalysis: z.object({
      score: z.number(),
      keywordsMatched: z.array(z.string()),
      suggestions: z.array(z.string())
    })
  });

  const refinePrompt = `
    This resume scored ${previousResult.atsAnalysis.score}/100 for ATS.
    Issues found: ${previousResult.atsAnalysis.suggestions.join(", ")}
    Missing keywords: ${keywords.hardSkills.filter(k =>
    !previousResult.atsAnalysis.keywordsMatched.includes(k)
  ).join(", ")}

    Previous HTML:
    ${previousResult.html}

    Fix ALL issues above. Keep truthful content. Return improved html and atsAnalysis.
    Target score: 90+. Do not change the single-column structure.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: refinePrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(refineSchema),
    }
  });

  return JSON.parse(response.text);
}

module.exports = { generateInterviewReport, generateResumePdf, generateResume2Pdf }