import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const NewsletterPreview = () => {
  const { state } = useLocation();
  const { formData, imagePreview } = state || {};
  const navigate = useNavigate();

  if (!formData) {
    return <div className="text-center py-8 text-gray-600">No preview data available.</div>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 bg-gray-50/95 md:rounded-tl-3xl overflow-y-auto max-h-screen relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="text-center bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-purple-700 animate-pulse-glow">
            <h1 className="text-2xl font-bold text-purple-800">Newsletter Preview</h1>
          </div>
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-200/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{formData.title}</h2>
            {formData.subtitle && <h3 className="text-xl text-gray-700 mb-4">{formData.subtitle}</h3>}
            {imagePreview && (
              <img src={imagePreview} alt="Newsletter" className="w-full h-64 object-cover rounded-lg mb-4" />
            )}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.description }} />
            {formData.url && (
              <a
                href={formData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline mt-4 inline-block"
              >
                {formData.url}
              </a>
            )}
            <button
              onClick={() => navigate('/newsletter')}
              className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all duration-200 shadow-md hover:ring-2 hover:ring-purple-400"
            >
              Back to Editor
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsletterPreview;