import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { compressPdf } from '../api/pdfApi';

const ACCEPT = { 'application/pdf': ['.pdf'] };

function CompressPage() {
  const [files, setFiles] = useState([]);
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
    setLoading(true);
    setProgress(0);
    setResult(null);
    try {
      const data = await compressPdf(files[0], onProgress);
      setResult(data);
      toast.success('PDF compressed successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Compression failed.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (bytes) => (bytes / 1024).toFixed(1) + ' KB';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Compress PDF</h1>
        <p className="text-gray-500 mt-1">Reduce your PDF file size while maintaining quality.</p>
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

        {loading && <ProgressBar value={progress} label="Uploading & compressing…" />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            {loading ? 'Compressing…' : 'Compress PDF'}
          </button>
          {result && <DownloadButton url={result.downloadUrl} filename="compressed.pdf" />}
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 space-y-1 text-sm text-green-800">
            <p className="font-semibold">{result.message}</p>
            <p>Original size: {fmt(result.originalSize)}</p>
            <p>Compressed size: {fmt(result.compressedSize)}</p>
            <p>Savings: {result.savings}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default CompressPage;
