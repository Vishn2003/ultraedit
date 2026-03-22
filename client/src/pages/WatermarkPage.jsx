import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DropZone from '../components/DropZone';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { addWatermark } from '../api/pdfApi';

const ACCEPT = { 'application/pdf': ['.pdf'] };

function WatermarkPage() {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState('#FF0000');

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
    if (!text.trim()) { toast.error('Watermark text cannot be empty.'); return; }
    setLoading(true);
    setProgress(0);
    setResult(null);
    try {
      const data = await addWatermark(files[0], { text, fontSize, opacity, rotation, color }, onProgress);
      setResult(data);
      toast.success('Watermark added successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Watermark failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Add Watermark</h1>
        <p className="text-gray-500 mt-1">Stamp a text watermark on every page of your PDF.</p>
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
          <label className="col-span-2 space-y-1">
            <span className="text-sm font-medium text-gray-700">Watermark Text</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              maxLength={100}
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Font Size</span>
            <input
              type="number"
              min={8}
              max={200}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Rotation (°)</span>
            <input
              type="number"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Opacity (0–1)</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 border border-gray-300 rounded-lg cursor-pointer"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </label>
        </div>

        {loading && <ProgressBar value={progress} label="Uploading & adding watermark…" />}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            {loading ? 'Processing…' : 'Add Watermark'}
          </button>
          {result && <DownloadButton url={result.downloadUrl} filename="watermarked.pdf" />}
        </div>

        {result && (
          <p className="text-green-600 text-sm font-medium">{result.message}</p>
        )}
      </form>
    </div>
  );
}

export default WatermarkPage;
