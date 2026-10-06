import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

const DEFAULT_ROUNDS = 3;
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 10;
const MODEL = "gpt-5.4-mini";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type SummaryResult = {
  summary: string;
  coreIssue: string;
  insights: string[];
  suggestions: string[];
  encouragement: string;
};

const SAFETY_RULES = `安全原則（最優先）：
- 若使用者透露自殺、自傷、傷害他人的念頭或計畫，或正處於立即危險中，請先以溫和、不評判的語氣關心其安全，暫停挑戰與追問，並明確鼓勵他立即聯繫可信任的人或專業資源：
  - 衛福部安心專線 1925（24 小時）
  - 生命線 1995
  - 張老師專線 1980
  - 緊急危險請撥 119 或 110
- 你是 AI，不能取代專業心理師或精神科醫師；不要做任何醫療診斷或建議用藥。`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "伺服器未設定 OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[]; totalRounds?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const totalRounds = body.totalRounds ?? DEFAULT_ROUNDS;

  if (
    !Number.isInteger(totalRounds) ||
    totalRounds < MIN_ROUNDS ||
    totalRounds > MAX_ROUNDS
  ) {
    return NextResponse.json(
      { error: `問答輪數需介於 ${MIN_ROUNDS} 到 ${MAX_ROUNDS} 之間` },
      { status: 400 }
    );
  }
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== "user" || !lastMessage.content?.trim()) {
    return NextResponse.json(
      { error: "請先輸入你想聊的困擾" },
      { status: 400 }
    );
  }

  const respondedRounds = messages.filter((m) => m.role === "assistant").length;

  try {
    if (respondedRounds >= totalRounds) {
      const result = await generateSummary(messages, totalRounds);
      return NextResponse.json({ type: "summary", result });
    }

    const round = respondedRounds + 1;
    const reply = await generateReply(messages, round, totalRounds);
    return NextResponse.json({
      type: "reply",
      message: reply,
      round,
      totalRounds,
    });
  } catch (error) {
    console.error("Counselor API error:", error);
    return NextResponse.json(
      { error: "呼叫 OpenAI API 時發生錯誤" },
      { status: 500 }
    );
  }
}

function roundFocus(round: number, totalRounds: number) {
  if (totalRounds === 1) {
    return "這是唯一的一輪：在理解處境的同時，直接點出你觀察到最可能卡住的核心想法，並請他確認。";
  }
  if (round === 1) {
    return "這是第一輪：釐清事件與他的詮釋，並直接點出他敘述中最明顯的一個扭曲想法或未經檢驗的假設。";
  }
  if (round === totalRounds) {
    return "這是最後一輪：收斂到底，明確說出你認為他卡住的點或根本原因，並請他確認或修正。";
  }
  return "這是中間輪：深入挑戰他的核心信念，追問背後的需求、恐懼或過去經驗，指出他可能在逃避或合理化的部分。";
}

async function generateReply(
  messages: ChatMessage[],
  round: number,
  totalRounds: number
) {
  const systemPrompt = `你是一位專業、真誠且說話直接的心理諮詢師，使用繁體中文與來訪者對話。你的目標是引導來訪者找出心裡真正卡住的點或問題的根本原因，而不是讓他只是感覺好一點。

這是第 ${round} 輪回應（共 ${totalRounds} 輪，之後會進行總結）。
${roundFocus(round, totalRounds)}

每一輪回應請依序包含：
1. 同理與承接：用一兩句具體反映你聽到的情緒與處境，讓來訪者感到被理解。簡短即可，不要說空泛的安慰話。
2. 直接的挑戰：這是回應的重點。直接指出來訪者想法中的盲點、矛盾、過度概化、災難化、非黑即白或未被檢驗的假設。
   - 用肯定句明確說出你的觀察，例如「你說『怎麼做都不夠好』，但這是你的感受，不是事實」、「我注意到你把主管一次的批評，直接等同於自己沒用」。
   - 必要時點出他話中前後不一致之處，或他可能在逃避、合理化的部分。
   - 挑戰段落請以「我想直接挑戰你一下：」開頭，接著引用他說過的原話，再用肯定句指出問題所在。
   - 整段回應禁止使用「是否」「或許」「可能」「也許」「似乎」「呢」這些削弱語氣的詞。
   - 不要急著幫他找理由開脫，也不要用「這很常見」「這很正常」來淡化問題。
   - 直接但不攻擊、不貶低：挑戰的是想法，不是這個人。
3. 具體建議：給出一個具體、小而可行的行動或觀察練習。
4. 引導提問：最後提出「一到兩個」尖銳但開放的問題，用「什麼」「為什麼」「如果…你會…」等句式直接發問，逼近更深層的感受、需求或根本原因。

形式要求：
- 自然的對話語氣，像真人諮詢師，不要使用標題、編號或 markdown 格式。
- 長度約 150 到 300 字。

${SAFETY_RULES}`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI 未回傳回應內容");
  }
  return content;
}

async function generateSummary(
  messages: ChatMessage[],
  totalRounds: number
): Promise<SummaryResult> {
  const systemPrompt = `你是一位專業、真誠且說話直接的心理諮詢師，剛與來訪者完成了 ${totalRounds} 輪的諮詢對話。請根據完整對話紀錄，給出最後的總結與建議。

請「只」輸出一個 JSON 物件，格式如下，不要包含任何其他文字或 markdown 標記：
{
  "summary": "整段對話的回顧，包含來訪者的處境與情緒（繁體中文，150字以內）",
  "coreIssue": "你觀察到心裡卡住的點或問題的根本原因（繁體中文，100字以內）",
  "insights": ["對話中浮現的重要覺察1", "覺察2"],
  "suggestions": ["具體可行的建議1", "建議2", "建議3"],
  "encouragement": "一段溫暖的結語與鼓勵（繁體中文，80字以內）"
}

${SAFETY_RULES}
若對話中出現上述危機訊號，請在 suggestions 的第一項放入求助資源。`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI 未回傳總結內容");
  }

  const parsed = JSON.parse(content);
  return {
    summary: String(parsed.summary ?? ""),
    coreIssue: String(parsed.coreIssue ?? ""),
    insights: Array.isArray(parsed.insights) ? parsed.insights.map(String) : [],
    suggestions: Array.isArray(parsed.suggestions)
      ? parsed.suggestions.map(String)
      : [],
    encouragement: String(parsed.encouragement ?? ""),
  };
}
