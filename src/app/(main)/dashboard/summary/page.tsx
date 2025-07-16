'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useSummary } from '../../../../context/SummaryProvider';
import { useRouter } from 'next/navigation';
import Loading from '../../../../components/Loading';
import { FiCopy } from 'react-icons/fi';
import ErrorTile from '../../../../components/ErrorTile';

const Summary = () => {
  const { file, summaryLength } = useSummary();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>('Uploading file...');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const handleGenerateSummary = async () => {
      if (!file) {
        setError('No file selected');
        setLoading(false);
        return;
      }

      try {
        const filePath = await handleFileUpload(file);
        await extractText(filePath);
      } catch (error) {
        console.error('Error analyzing file:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    handleGenerateSummary();
    return () => {
      setSummary('');
    };
    
  }, []);

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log("Data: " , data);
    console.log("Data Status: " , response.status); 
    if (response.status != 200) {
      throw new Error(`Failed to upload file: ${data.errorMessage}`);
    }

    if (!data.filePath) {
      throw new Error('No file path returned after upload.');
    }

    //  console.log('File uploaded successfully:', data.filePath);
    return data.filePath;
  };

  const extractText = async (filePath: string) => {
    setLoadingText('Extracting Text...');
    const extractResponse = await fetch('/api/extract-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath }),
    });

    const extractData = await extractResponse.json();

    if (extractResponse.status != 200) {
      throw new Error(`Failed to extract text: ${extractData.errorMessage}`);
    }

    console.log('Extracted text:', extractData.extractedText);

    setLoadingText('Generating Summary...');

    const summaryResponse = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: extractData.extractedText, length: summaryLength }),
    });

    // Check if response is JSON
    const contentType = summaryResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned an invalid response. Please try with a shorter summary length.');
    }

    let summaryData;
    try {
      summaryData = await summaryResponse.json();
    } catch (jsonError) {
      throw new Error('Failed to parse server response. The request may have timed out. Please try with a shorter summary length.');
    }

    if (summaryResponse.status != 200) {
      throw new Error(`Failed to summarize text: ${summaryData.errorMessage}`);
    }

    setSummary(summaryData.summary);
  };

  const handleSummarizeAnother = () => {
    router.push('/dashboard');
  };

  const anotherSummaryButton = (
    <button
      onClick={handleSummarizeAnother}
      className="mt-4 bg-indigo-600 md:w-1/6 w-3/6 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
    >
      Summarize Another Document
    </button>
  );

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary).then(() => {
        alert('Summary copied to clipboard!');
      }).catch((err) => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  return (
    <>
      {loading && <Loading textContent={loadingText}/>}
      {error && (
        <>
          <ErrorTile message={error} />
          {anotherSummaryButton}
        </>
      )}
      {summary && (
        <>
          <h1 className="text-2xl text-white font-bold mt-4 text-center">{`Summary of ${file?.name}`}</h1>
          <div className="relative mt-4 w-[90vw] md:w-4/6 p-5 border-0 bg-gray-100 text-gray-700 rounded-xl max-h-[60vh] overflow-y-scroll">
            <div className="absolute top-1 right-1">
              <button onClick={handleCopy} className="text-gray-500 hover:text-gray-400 hover:cursor-pointer">
                <FiCopy size={24} />
              </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(summary) }} />
          </div>
          {anotherSummaryButton}
        </>
      )}
    </>
  );
};

export default Summary;