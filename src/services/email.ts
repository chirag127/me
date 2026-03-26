import emailjs from '@emailjs/browser';
import { ADMIN_EMAIL } from '../lib/firebase';

const EMAILJS_SERVICE_ID = 'whyiswhen';
const EMAILJS_TEMPLATE_ID = 'template_vtfsvsa';
const EMAILJS_PUBLIC_KEY = 'ez_TbfaB5JPmwPKek';

export interface AlertData {
  query: string;
  reason: string;
  context?: string;
  timestamp: string;
}

/**
 * Sends a real-time email alert to the admin when an unknown query or critical fallback occurs.
 * Costs ₹0 forever via EmailJS Free Tier.
 */
export async function sendUnknownQueryAlert(data: AlertData) {
  try {
    const templateParams = {
      to_email: ADMIN_EMAIL,
      user_query: data.query,
      trigger_reason: data.reason,
      context_dump: data.context || 'None',
      time: data.timestamp,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY,
    );
    console.log('[Email Alert] Unknown query sent to admin.');
  } catch (error) {
    console.error('[Email Alert] Failed to send email via EmailJS', error);
  }
}
