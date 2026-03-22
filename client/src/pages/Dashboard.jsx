import React from 'react';
import { Link } from 'react-router-dom';

const TOOLS = [
  {
    path: '/merge',
    title: 'Merge PDFs',
    description: 'Combine multiple PDFs into a single document.',
    icon: '🔗',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    path: '/split',
    title: 'Split PDF',
    description: 'Extract pages or page ranges from any PDF.',
    icon: '✂️',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    path: '/compress',
    title: 'Compress PDF',
    description: 'Reduce PDF file size without losing quality.',
    icon: '📦',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconBg: 'bg-green-100',
  },
  {
    path: '/convert',
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, or WEBP images to PDF.',
    icon: '🖼️',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    iconBg: 'bg-yellow-100',
  },
  {
    path: '/watermark',
    title: 'Add Watermark',
    description: 'Stamp a custom text watermark on your PDF.',
    icon: '🔏',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    iconBg: 'bg-red-100',
  },
];

function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Doc<span className="text-brand-600">Ease</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Your free, privacy-friendly PDF toolkit. All processing happens on our server
          and files are automatically deleted after one hour.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className={`border rounded-2xl p-6 flex flex-col gap-4 transition-colors shadow-sm ${tool.color}`}
          >
            <div className={`w-12 h-12 ${tool.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
              {tool.icon}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{tool.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
