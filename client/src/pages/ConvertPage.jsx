import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { convertToPdf } from '../api/pdfApi';

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

function ConvertPage() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFiles = (incoming) => setFiles((prev) => [...prev, ...incoming]);
  const handleRemove = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const onProgress = (e) => {
    if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) { toast.error('Please upload at least one image.'); return; }
    setLoading(true);
    setProgress(0);
    setResult(null);
    try {
      const data = await convertToPdf(files, onProgress);
      setResult(data);
      toast.success('Images converted to PDF!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Images to PDF</h1>
        <p className="text-gray-500 mt-1">Convert JPG, PNG or WEBP images into a single PDF file.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <DropZone
          onFiles={handleFiles}
          accept={ACCEPT}
          multiple
          label="Accepts JPEG, PNG, WEBP files"
          files={files}
          onRemove={handleRemove}
        />

        {loading && <ProgressBar value={progress} label="Uploading & converting…" />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            {loading ? 'Converting…' : 'Convert to PDF'}
          </button>
          {result && <DownloadButton url={result.downloadUrl} filename="converted.pdf" />}
        </div>

        {result && (
          <p className="text-green-600 text-sm font-medium">{result.message}</p>
        )}
      </form>
    </div>
  );
}

export default ConvertPage;
