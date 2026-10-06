import OpenAI from "openai";

// BYOK：每個請求使用使用者自己提供的 API Key 建立 client
export function createOpenAI(apiKey: string) {
  return new OpenAI({ apiKey });
}
