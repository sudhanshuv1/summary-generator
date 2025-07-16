import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { marked } from 'marked';
import { getGCPCredentials } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { text, length } = await req.json();

    if (!text) {
      return NextResponse.json({ errorMessage: 'No text provided' }, { status: 400 });
    }

    const client = getGCPCredentials();
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json({ errorMessage: 'Google Cloud project ID is not defined' }, { status: 500 });
    }

    const vertexAI = new VertexAI(
      { 
        project: projectId, 
        location: 'us-central1', 
        googleAuthOptions: {
          credentials: {
            client_email: client.credentials?.client_email,
            private_key: client.credentials?.private_key,
          },
        },
      });

    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash', 
    });

    // Optimize prompt for faster generation
    const prompt = `Provide a concise ${length}-word summary of the following text. Focus on the most important points:\n\n${text}`; 

    const resp = await generativeModel.generateContent(prompt);
    console.log('Response from Vertex AI:', resp.response.candidates?.[0]);
    const summaryText = await marked.parse(resp.response.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No summary available');

    return NextResponse.json({ summary: summaryText }, { status: 200 });
  } catch (error) {
    console.error('Error summarizing text:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // Always return JSON, even on error
    return NextResponse.json({ 
      errorMessage: `Failed to summarize text: ${errorMessage}` 
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}