import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';
import { getGCPCredentials } from '@/lib/utils';

const storage = new Storage(getGCPCredentials());
const client = new DocumentProcessorServiceClient(getGCPCredentials());
const bucketName = process.env.GOOGLE_CLOUD_BUCKET || '';

export async function POST(req: NextRequest) {
  const { filePath } = await req.json();

  if (!filePath) {
    return NextResponse.json({ error: 'No file path provided' }, { status: 400 });
  }

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = 'us'; 
    const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID;

    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    const objectName = filePath.split('/').pop();

    const tempFilePath = path.join('/tmp', `${uuidv4()}-${objectName}`);
    await storage.bucket(bucketName).file(objectName).download({ destination: tempFilePath });

    const fileBuffer = await fs.readFile(tempFilePath);
    const type = await fileTypeFromBuffer(fileBuffer);
    const mimeType = type ? type.mime : 'application/octet-stream';

    if (mimeType === 'application/pdf' || mimeType.startsWith('image/')) {
      const base64EncodedFile = fileBuffer.toString('base64');

      const request = {
        name,
        rawDocument: {
          content: base64EncodedFile,
          mimeType: mimeType,
        },
      };

      const [result] = await client.processDocument(request);

      const document = result.document;
      if (!document) {
        throw new Error('Document is null or undefined');
      }
      const extractedText = document.text; 

      await fs.unlink(tempFilePath);

      return NextResponse.json({ extractedText }, { status: 200 });
    } else {
      await fs.unlink(tempFilePath);
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing document:', error);
    const errorMessage = (error as Error).message;
    return NextResponse.json({ error: `Error processing document: ${errorMessage}` }, { status: 500 });
  }
}