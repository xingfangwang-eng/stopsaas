import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

// Generate response using Hugging Face API (free)
async function generateWithHuggingFace(prompt: string): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    if (hfApiKey) {
      headers['Authorization'] = `Bearer ${hfApiKey}`;
    }

    const response = await axios.post(
      hfApiUrl,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      },
      {
        headers,
        timeout: 30000,
      }
    );

    // Parse the response
    const generatedText = response.data?.[0]?.generated_text || response.data?.generated_text || '';
    
    // Extract JSON from the generated text
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse JSON from Hugging Face response:', parseError);
      }
    }

    // Fallback: create a simple response
    return {
      email: `Subject: Cancellation Request\n\nDear Support,\n\nI am writing to cancel my subscription. The service has feature bloat and there is a significant cost mismatch for the functionality I actually use.\n\nPlease confirm the cancellation and provide any necessary next steps.\n\nRegards,\nCustomer`,
      savings: 1200,
      alternative: `<html><body><h1>Simple Alternative</h1><p>This is a basic alternative solution.</p></body></html>`
    };
  } catch (error) {
    console.error('Error with Hugging Face API:', error);
    // Fallback response
    return {
      email: `Subject: Cancellation Request\n\nDear Support,\n\nI am writing to cancel my subscription. The service has feature bloat and there is a significant cost mismatch for the functionality I actually use.\n\nPlease confirm the cancellation and provide any necessary next steps.\n\nRegards,\nCustomer`,
      savings: 1200,
      alternative: `<html><body><h1>Simple Alternative</h1><p>This is a basic alternative solution.</p></body></html>`
    };
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
    const sanitizedInput = input.replace(/[<>'&]/g, (match) => {
      const entityMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
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

    // Check if OpenAI API key is configured
    if (!openai) {
      // Use Hugging Face API as fallback (free)
      console.log('Using Hugging Face API as fallback');
      const result = await generateWithHuggingFace(prompt);
      return NextResponse.json(result);
    }

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
