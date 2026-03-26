import emailjs from '@emailjs/browser';

const SERVICE_ID = 'whyiswhen';
const TEMPLATE_ID = 'template_vtfsvsa';
const PUBLIC_KEY = 'ez_TbfaB5JPmwPKek';

export interface AlertData {
  visitorQuery: string;
  visitorEmail: string;
  visitorName: string;
  pageContext: string;
  aiResponse: string;
  timestamp: string;
}

let initialized = false;

function ensureInit() {
  if (!initialized) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
}

export async function sendAlertEmail(data: AlertData): Promise<boolean> {
  ensureInit();

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: 'hi@chirag127.in',
      visitor_query: data.visitorQuery,
      visitor_email: data.visitorEmail || 'anonymous',
      visitor_name: data.visitorName || 'Anonymous',
      page_context: data.pageContext,
      ai_response: data.aiResponse,
      timestamp: data.timestamp,
    });
    return true;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
}

export function isLowConfidence(response: string): boolean {
  const phrases = [
    "i don't have",
    "i'm not sure",
    "i don't know",
    "i couldn't find",
    'not mentioned',
    "i'm not aware",
    "don't have information",
    'i cannot',
    "i'm unable",
    'no information',
    'not available',
    'not provided',
  ];
  const lower = response.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}
