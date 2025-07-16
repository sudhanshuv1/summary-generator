import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getGCPCredentials = () => {
  // for Vercel, use environment variables:
  return  {
        credentials: {
          client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY,
        },
        projectId: process.env.GCP_PROJECT_ID,
      }
};

// // for local development, use variables in .env.local:
// export const getGCPCredentials = () => {
//   // for local development:
//   return {
//         credentials: {
//           client_email: process.env.GOOGLE_CLIENT_EMAIL,
//           private_key: process.env.GOOGLE_PRIVATE_KEY,
//         },
//         projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
//       }
// };
