import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory rate limiter (for production, use a proper solution like Redis)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return true;
  }
  
  if (now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Clean up old rate limit entries
function cleanupRateLimitStore() {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [ip, entry] of entries) {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(ip);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Clean up old rate limit entries
    cleanupRateLimitStore();
    
    // Check rate limit
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          error: 'TOO MANY REQUESTS!',
          message: 'You have exceeded the rate limit. Please try again later.',
        },
        { status: 429 }
      );
    }

    const { input } = await request.json();

    // Input validation and sanitization
    if (!input || typeof input !== 'string' || input.trim() === '') {
      return NextResponse.json(
        {
          error: 'WHAT ARE YOU DOING? GIVE ME A VALID INPUT!',
          message: 'Your input is empty or invalid. I need a sentence like "I use [Expensive SaaS] just for [Simple Task]..."',
        },
        { status: 400 }
      );
    }

    // Limit input length to prevent DoS
    if (input.length > 500) {
      return NextResponse.json(
        {
          error: 'INPUT TOO LONG!',
          message: 'Your input is too long. Please keep it under 500 characters.',
        },
        { status: 400 }
      );
    }

    // Sanitize input to prevent injection
    const sanitizedInput = input.replace(/[<>"'&]/g, (match) => {
      const entityMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;'
      };
      return entityMap[match];
    });

    const prompt = `
Analyze the following user input and generate a JSON response with the following fields:

1. email: A concise, firm email to customer support requesting to cancel the subscription. Mention "feature bloat" and "cost mismatch".
2. savings: An integer representing the approximate annual cost of the SaaS subscription in USD.
3. alternative: A single-file HTML/JS code snippet that provides the core functionality mentioned. For example, if the user mentions using Salesforce for storing leads, provide an HTML form with localStorage persistence.

User input: ${sanitizedInput}

Return only the JSON object, no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    // Validate response structure
    if (!result.email || !result.savings || !result.alternative) {
      return NextResponse.json(
        {
          error: 'INVALID RESPONSE!',
          message: 'Failed to generate valid response. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    // Don't expose detailed error messages to clients
    return NextResponse.json(
      {
        error: 'SOMETHING WENT HORRIBLY WRONG!',
        message: 'Failed to process your request. Try again later.',
      },
      { status: 500 }
    );
  }
}
