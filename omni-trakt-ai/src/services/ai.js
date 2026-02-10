/**
 * @file AI Identification Service using Google Gemini API (Gemma 3 27B IT)
 * Analyzes page metadata to identify what movie or TV show is playing.
 * User provides their own Gemini API key.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemma-3-27b-it';

/**
 * The system prompt that instructs Gemini to parse media metadata
 */
const MEDIA_IDENTIFICATION_PROMPT = `You are a media metadata expert. Your task is to identify the Movie or TV Show from the given browsing context.

RULES:
1. Analyze the URL, page title, headings, and description to determine what media content is being watched.
2. Ignore clutter words like "Watch Online", "Free", "HD", "1080p", "720p", "123Movies", "Putlocker", streaming site names, etc.
3. Determine if it's a Movie or TV Show (with Season and Episode numbers if applicable).
4. Provide a confidence score (0-100) based on how certain you are about the identification.
5. Return ONLY valid JSON, no other text.

OUTPUT FORMAT (strict JSON):
{
  "title": "The exact title of the movie or TV show",
  "type": "movie" or "show",
  "year": 2024 or null,
  "season": 5 or null,
  "episode": 14 or null,
  "confidence": 95
}

If you cannot identify any media content, return:
{
  "title": null,
  "type": "unknown",
  "year": null,
  "season": null,
  "episode": null,
  "confidence": 0
}`;

/**
 * Identify media content from page context using Gemini AI
 * @param {Object} pageContext - { url, title, heading, ogTitle, description, h2 }
 * @returns {Promise<Object>} MediaIdentification result
 */
async function identifyContent(pageContext) {
    try {
        const apiKey = await storageGet(StorageKeys.GEMINI_API_KEY);
        if (!apiKey) {
            console.warn('[Omni-Trakt AI] No Gemini API key configured.');
            return createFailedIdentification('Gemini API key not configured. Please set it in Settings.');
        }

        const userPrompt = buildUserPrompt(pageContext);
        const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: `${MEDIA_IDENTIFICATION_PROMPT}\n\n---\n\n${userPrompt}` }
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 256,
                    responseMimeType: 'application/json',
                },
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('[Omni-Trakt AI] Gemini API error:', response.status, errText);
            return createFailedIdentification(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();

        // Extract the text content from Gemini response
        const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textContent) {
            return createFailedIdentification('Empty response from Gemini.');
        }

        // Parse the JSON response
        const parsed = parseAIResponse(textContent);
        parsed._rawResponse = textContent;
        parsed._pageContext = pageContext;
        parsed._timestamp = Date.now();

        return parsed;
    } catch (err) {
        console.error('[Omni-Trakt AI] AI identification error:', err);
        return createFailedIdentification(err.message);
    }
}

/**
 * Build the user prompt from page context
 * @param {Object} ctx - Page context
 * @returns {string}
 */
function buildUserPrompt(ctx) {
    const parts = [];
    parts.push(`URL: ${ctx.url}`);
    parts.push(`Page Title: ${ctx.title}`);
    if (ctx.ogTitle) parts.push(`OG Title: ${ctx.ogTitle}`);
    if (ctx.heading) parts.push(`H1 Heading: ${ctx.heading}`);
    if (ctx.h2) parts.push(`H2 Heading: ${ctx.h2}`);
    if (ctx.description) parts.push(`Description: ${ctx.description}`);
    return parts.join('\n');
}

/**
 * Parse the AI response text into a structured object
 * @param {string} text - Raw AI response text
 * @returns {Object}
 */
function parseAIResponse(text) {
    try {
        // Try direct JSON parse first
        const parsed = JSON.parse(text.trim());
        return normalizeIdentification(parsed);
    } catch (_) {
        // Try to extract JSON from markdown code blocks or mixed text
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                return normalizeIdentification(parsed);
            } catch (__) {
                // Fall through
            }
        }
    }

    return createFailedIdentification('Could not parse AI response.');
}

/**
 * Normalize and validate the identification result
 * @param {Object} raw
 * @returns {Object}
 */
function normalizeIdentification(raw) {
    return {
        title: raw.title || null,
        type: ['movie', 'show'].includes(raw.type) ? raw.type : 'unknown',
        year: typeof raw.year === 'number' ? raw.year : null,
        season: typeof raw.season === 'number' ? raw.season : null,
        episode: typeof raw.episode === 'number' ? raw.episode : null,
        confidence: typeof raw.confidence === 'number' ? Math.min(100, Math.max(0, raw.confidence)) : 0,
        error: null,
    };
}

/**
 * Create a failed identification result
 * @param {string} reason
 * @returns {Object}
 */
function createFailedIdentification(reason) {
    return {
        title: null,
        type: 'unknown',
        year: null,
        season: null,
        episode: null,
        confidence: 0,
        error: reason,
        _timestamp: Date.now(),
    };
}
