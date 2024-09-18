import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();
const groqApiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: groqApiKey });
/*
• Idiomatic expressions and cultural references unique to the ancient world.

• Grammatical subtleties, like verb tenses, moods, and voices.

• Connotations of specific words or phrases that may not be immediately apparent in the English translation.

• Historical and literary context that may shed light on the passage's intended meaning.
*/

export async function getGroqChatStream(reference, translatedPassage, originalPassage) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `you are a Biblical scholar providing insight about Biblical texts. \n
        Focus on interpreting the original language and how it would've been understood by people living in that culture.\n
        Include only bullet points with no introductory text.`,
      },
      {
        role: "user",
        content:
          `I want to understand the nuances about the following biblical text that are lost in translation from the original language to English.\n
          The passage is from ${reference}.
          Here is the english version: ${translatedPassage}\n
          Here is the verse in the original language: ${originalPassage}`,
      },
    ],

    model: "llama-3.1-70b-versatile",
    temperature: 0.75,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
  });
}

