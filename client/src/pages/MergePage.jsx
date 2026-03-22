import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { mergePdfs } from '../api/pdfApi';

const ACCEPT = { 'application/pdf': ['.pdf'] };

function MergePage() {
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
    if (files.length < 2) {
      toast.error('Please add at least 2 PDF files.');
      return;
    }
    setLoading(true);
    setProgress(0);
    setResult(null);
    try {
      const data = await mergePdfs(files, onProgress);
      setResult(data);
      toast.success('PDFs merged successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Merge failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Merge PDFs</h1>
        <p className="text-gray-500 mt-1">Combine multiple PDF files into a single document.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <DropZone
          onFiles={handleFiles}
          accept={ACCEPT}
          multiple
          label="Accepts PDF files only (max 50 MB each)"
          files={files}
          onRemove={handleRemove}
        />

        {loading && <ProgressBar value={progress} label="Uploading & processing…" />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || files.length < 2}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            {loading ? 'Merging…' : 'Merge PDFs'}
          </button>
          {result && <DownloadButton url={result.downloadUrl} filename="merged.pdf" />}
        </div>

        {result && (
          <p className="text-green-600 text-sm font-medium">{result.message}</p>
        )}
      </form>
    </div>
  );
}

export default MergePage;
