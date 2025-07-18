import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// {
//   "questionCount": 1,
//   "difficulty": "mixed",
//   "questionTypes": ["multiple-choice", "short-answer", "true-false"],
//   "text": "The Industrial Revolution began in Britain in the late 18th century. It was a period of great technological advancement, including the development of steam power, mechanized textile production, and improvements in metallurgy. Key inventions included the steam engine by James Watt and the spinning jenny by James Hargreaves. The revolution led to urbanization, with many people moving to cities for factory work, significantly impacting social and economic structures."
// }
export const generate_using_pdf = async (req, res) => {
  const {
    questionCount = 10,
    difficulty = 'mixed',
    questionTypes = ['multiple-choice', 'short-answer', 'true-false'],
    text
  } = req.body;

  // console.log("input: ",req.body);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Based on the following text, generate ${questionCount} educational questions in JSON format.

    Text content:
    ${text}

    Requirements:
    1. Generate a variety of question types: ${questionTypes.join(', ')}
    2. Difficulty level: ${difficulty}
    3. Questions should test understanding, not just memorization
    4. Include proper distractors for multiple choice questions
    5. Ensure questions are clear and unambiguous

    Return the response in this exact JSON format:
    {
      "questions": [
        {
          "id": 1,
          "type": "multiple-choice",
          "difficulty": "easy|medium|hard",
          "question": "Question text here",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "A",
          "explanation": "Explanation for the correct answer",
          "topic": "Topic/concept being tested"
        },
        {
          "id": 2,
          "type": "short-answer",
          "difficulty": "easy|medium|hard",
          "question": "Question text here",
          "sample_answer": "Expected answer or key points",
          "explanation": "Explanation or marking scheme",
          "topic": "Topic/concept being tested"
        },
        {
          "id": 3,
          "type": "true-false",
          "difficulty": "easy|medium|hard",
          "question": "Statement to evaluate",
          "correct_answer": true,
          "explanation": "Explanation for why this is true/false",
          "topic": "Topic/concept being tested"
        }
      ],
      "metadata": {
        "total_questions": ${questionCount},
        "difficulty_distribution": {
          "easy": 0,
          "medium": 0,
          "hard": 0
        },
        "type_distribution": {
          "multiple-choice": 0,
          "short-answer": 0,
          "true-false": 0
        },
        "generated_at": "${new Date().toISOString()}",
        "source_length": ${text.length}
      }
    }

    Important: 
    - Return only valid JSON, no additional text
    - Ensure all questions are answerable from the provided text
    - Make sure JSON is properly formatted and escaped
    - Include exactly ${questionCount} questions
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText
      .replace(/```json\s*/, '')
      .replace(/```\s*$/, '')
      .trim();

    const questionsData = JSON.parse(cleanedResponse);
    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // console.log("result : ",questionsData);
    res.send(questionsData);
  }
  catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}


// {
//   "questionCount": 1,
//   "difficulty": "mixed",
//   "questionTypes": ["multiple-choice", "short-answer", "true-false"],
//   "topic": "Kingdom Animalia"
// }
export const generate_using_topic = async (req, res) => {
  const {
    questionCount = 10,
    difficulty = 'mixed',
    questionTypes = ['multiple-choice', 'short-answer', 'true-false'],
    topic
  } = req.body;

  // console.log("input: ",req.body);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Based on the following text, generate ${questionCount} educational questions in JSON format.

    Text content Topic:
    ${topic}

    Requirements:
    1. Generate a variety of question types: ${questionTypes.join(', ')}
    2. Difficulty level: ${difficulty}
    3. Questions should test understanding, not just memorization
    4. Include proper distractors for multiple choice questions
    5. Ensure questions are clear and unambiguous

    Return the response in this exact JSON format:
    {
      "questions": [
        {
          "id": 1,
          "type": "multiple-choice",
          "difficulty": "easy|medium|hard",
          "question": "Question text here",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "A",
          "explanation": "Explanation for the correct answer",
          "topic": "Topic/concept being tested"
        },
        {
          "id": 2,
          "type": "short-answer",
          "difficulty": "easy|medium|hard",
          "question": "Question text here",
          "sample_answer": "Expected answer or key points",
          "explanation": "Explanation or marking scheme",
          "topic": "Topic/concept being tested"
        },
        {
          "id": 3,
          "type": "true-false",
          "difficulty": "easy|medium|hard",
          "question": "Statement to evaluate",
          "correct_answer": true,
          "explanation": "Explanation for why this is true/false",
          "topic": "Topic/concept being tested"
        }
      ]
    }

    Important: 
    - Return only valid JSON, no additional text
    - Ensure all questions are answerable from the provided text
    - Make sure JSON is properly formatted and escaped
    - Include exactly ${questionCount} questions
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText
      .replace(/```json\s*/, '')
      .replace(/```\s*$/, '')
      .trim();

    const questionsData = JSON.parse(cleanedResponse);
    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // console.log("result : ",questionsData);
    res.send(questionsData);
  }
  catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}


// {
//   "text":"what is your name ? ____ "
// }
export const generate_using_ocr = async (req, res) => {
  const {
    text
  } = req.body;

  // console.log("input: ",req.body);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Based on the following text content (which may contain OCR errors, incomplete sentences, or missing information), analyze the content and generate appropriate educational questions in JSON format.

    Text content: ${text}

    IMPORTANT OCR HANDLING INSTRUCTIONS:
    - The provided text may be from OCR scanning and could contain:
      * Spelling errors or character misrecognition
      * Incomplete sentences or missing words
      * Fragmented or unclear passages
      * Missing context or partial information
    - Please intelligently interpret the content and fill in reasonable gaps
    - If text is incomplete, use your knowledge to complete concepts appropriately
    - Focus on the core educational concepts that can be reasonably inferred
    - If certain parts are too unclear, skip those sections and work with clearer portions

    Requirements:
    1. Automatically determine appropriate question types based on content
    2. Automatically determine difficulty level based on content complexity
    3. Do not add any extra question
    4. Questions should test understanding, not just memorization
    5. Include proper distractors for multiple choice questions
    6. Ensure questions are clear and unambiguous
    7. When text is unclear due to OCR errors, interpret the intended meaning
    8. Complete partial concepts using educational best practices
    9. If text is severely fragmented, generate questions based on identifiable concepts

    Return the response in this exact JSON format:
    {
      "questions": [
        {
          "id": 1,
          "type": "multiple-choice",
          "difficulty": "easy|medium|hard",
          "question": "Question text here",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "A",
          "explanation": "Explanation for the correct answer",
          "topic": "Topic/concept being tested",
          "source_quality": "clear|interpreted|reconstructed"
        },
        {
          "id": 2,
          "type": "short-answer",
          "difficulty": "easy|medium|hard",
          "question": "Question text here",
          "sample_answer": "Expected answer or key points",
          "explanation": "Explanation or marking scheme",
          "topic": "Topic/concept being tested",
          "source_quality": "clear|interpreted|reconstructed"
        },
        {
          "id": 3,
          "type": "true-false",
          "difficulty": "easy|medium|hard",
          "question": "Statement to evaluate",
          "correct_answer": true,
          "explanation": "Explanation for why this is true/false",
          "topic": "Topic/concept being tested",
          "source_quality": "clear|interpreted|reconstructed"
        }
      ]
    }

    Source Quality Indicators:
    - "clear": Question based on clearly readable text
    - "interpreted": Question based on text with minor OCR errors that were corrected
    - "reconstructed": Question based on heavily fragmented text that required significant interpretation

    Important:
    - Return only valid JSON, no additional text
    - Prioritize educational value over perfect text matching
    - Use context clues to resolve OCR ambiguities
    - If text is too fragmented for a specific question type, choose more suitable question types
    - Make sure JSON is properly formatted and escaped
    - Include ocr_notes field to document any significant interpretations made
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText
      .replace(/```json\s */, '')
      .replace(/```\s*$/, '')
      .trim();

    const questionsData = JSON.parse(cleanedResponse);
    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // console.log("result : ",questionsData);
    res.send(questionsData);
  }
  catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}



