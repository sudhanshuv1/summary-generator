# Summary Assistant

This is a [Next.js](https://nextjs.org) app that takes any document (PDF/Image) and generates smart summaries.

## Getting Started
Here are the steps to run this project on local development environment :

1. Clone the project and run:

```bash
cd summary-generator 
npm install
```

2. Sign in to [Google Cloud Platform](https://cloud.google.com/?hl=en) and create a project in the console. Enable these APIs and services in the project:

- Cloud Storage
- Cloud Storage API
- Cloud Document AI API
- Vertex AI API

Create a storage bucket and processor with the Document AI API.

3. Install the `gcloud` CLI and set up [Application Default Credentials](https://cloud.google.com/sdk/docs/install).

4. Create an OAuth app on Github, with the homepage URL set to `http://localhost:3000/dashboard` and the callback URL set to `http://localhost:3000/api/auth/callback/github`.

5. Create a MongoDB collection and copy the connection string.

6. Create a `.env.local` file and create the relevant environment variables form Google Cloud, Github, MongoDB, and NextAuth. Set `HOMEPAGE_URL` to `http://localhost:3000`.

7. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Approach

This project uploads the files to Google Cloud Storage, uses the [Cloud Document AI API](https://cloud.google.com/document-ai/docs/reference/rest) to extract text from the PDF or Image file, and then sends a prompt to Gemini via the [Vertex AI API](https://cloud.google.com/vertex-ai/docs/reference/rest) to summarize the extracted text. NextAuth enables authentication with github or credentials that are stored in MongoDB. 


## Deployed on Vercel

This project is deployed on Vercel: [https://summary-generator-beryl.vercel.app/](https://summary-generator-beryl.vercel.app/)