import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { splitPdf } from '../api/pdfApi';

const ACCEPT = { 'application/pdf': ['.pdf'] };

function SplitPage() {
  const [files, setFiles] = useState([]);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFiles = (incoming) => setFiles(incoming.slice(0, 1));
  const handleRemove = () => setFiles([]);

  const onProgress = (e) => {
    if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) { toast.error('Please upload a PDF file.'); return; }
    if (startPage < 1 || endPage < startPage) { toast.error('Invalid page range.'); return; }
    setLoading(true);
    setProgress(0);
    setResult(null);
    try {
      const data = await splitPdf(files[0], startPage, endPage, onProgress);
      setResult(data);
      toast.success('PDF split successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Split failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Split PDF</h1>
        <p className="text-gray-500 mt-1">Extract a page range from your PDF.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <DropZone
          onFiles={handleFiles}
          accept={ACCEPT}
          multiple={false}
          label="Select a single PDF file"
          files={files}
          onRemove={handleRemove}
        />

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Start Page</span>
            <input
              type="number"
              min={1}
              value={startPage}
              onChange={(e) => setStartPage(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">End Page</span>
            <input
              type="number"
              min={startPage}
              value={endPage}
              onChange={(e) => setEndPage(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
        </div>

        {loading && <ProgressBar value={progress} label="Uploading & processing…" />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            {loading ? 'Splitting…' : 'Split PDF'}
          </button>
          {result && <DownloadButton url={result.downloadUrl} filename="split.pdf" />}
        </div>

        {result && (
          <p className="text-green-600 text-sm font-medium">{result.message}</p>
        )}
      </form>
    </div>
  );
}

export default SplitPage;
