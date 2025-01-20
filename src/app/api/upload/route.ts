import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { getGCPCredentials } from '@/lib/utils';

const storage = new Storage(getGCPCredentials());
const bucketName = process.env.GOOGLE_CLOUD_BUCKET || ''; 

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ errorMessage: 'Method Not Allowed' }, { status: 405 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ errorMessage: 'No file uploaded' }, { status: 400 });
  }

  try {
    const uniqueFileName = `${uuidv4()}-${file.name}`;

    const fileStream = storage.bucket(bucketName).file(uniqueFileName).createWriteStream();

    const buffer = Buffer.from(await file.arrayBuffer());
    fileStream.end(buffer);

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;

    return NextResponse.json({ filePath: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file to Google Cloud Storage:', error);
    return NextResponse.json({ errorMessage: 'Error uploading file to Google Cloud Storage' }, { status: 500 });
  }
}