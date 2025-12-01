import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
    baseURL: process.env.OpenAI_API_BASE_URL,
});