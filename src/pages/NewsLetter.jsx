import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NewsletterEditor from '../components/NewsletterEditor';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Tilt from 'react-parallax-tilt';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { RefreshCw } from 'lucide-react';

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);

  const fetchNewsletters = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('newsletters/');
      setNewsletters(response.data);
    } catch (error) {
      toast.error('Failed to load newsletters. Please log in.');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleSave = () => {
    fetchNewsletters(); // Auto-reload after save
  };

  const handleCardClick = (newsletter) => {
    if (newsletter.status === 'draft') {
      setEditingNewsletter(newsletter);
    } else {
      setSelectedNewsletter(newsletter);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 font-poppins flex">
      <Sidebar />
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto max-h-screen relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        <Toaster position="top-right" toastOptions={{ className: 'bg-white/95 text-gray-800 backdrop-blur-lg shadow-xl' }} />
        <div className="relative z-10">
          <div className="text-center bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-100 mb-12 transform hover:scale-[1.01] transition-transform duration-300">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent animate-pulse">
              Manage News Letter
            </h1>
          </div>
          <NewsletterEditor initialData={editingNewsletter || {}} isEditing={!!editingNewsletter} onSave={handleSave} />
          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Previous Newsletters</h2>
              <button
                onClick={fetchNewsletters}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
              </div>
            ) : newsletters.length === 0 ? (
              <div className="text-center text-gray-600 text-xl bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl mx-auto">
                No newsletters available. Create a new one above!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsletters.map((newsletter) => (
                  <Tilt
                    key={newsletter.id}
                    tiltMaxAngleX={10}
                    tiltMaxAngleY={10}
                    glareEnable={true}
                    glareMaxOpacity={0.4}
                    glareColor="#ffffff"
                    glarePosition="all"
                  >
                    <div
                      className="bg-white/95 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => handleCardClick(newsletter)}
                    >
                      <h3 className="text-xl font-bold text-gray-900">{newsletter.title}</h3>
                      {newsletter.subtitle && <p className="text-sm text-gray-600 mt-2">{newsletter.subtitle}</p>}
                      {newsletter.image && (
                        <img
                          src={newsletter.image}
                          alt={newsletter.title}
                          className="w-full h-48 object-cover rounded-xl mt-4 shadow-sm"
                          onError={(e) => (e.target.src = '/placeholder.jpg')} // Fallback image
                        />
                      )}
                      <div
                        className="text-sm text-gray-600 mt-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: newsletter.description }}
                      />
                      <p className="text-sm text-gray-500 mt-3">Status: {newsletter.status}</p>
                      <p className="text-sm text-gray-500">Created: {new Date(newsletter.created_at).toLocaleDateString()}</p>
                    </div>
                  </Tilt>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal for Published Newsletters */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-lg p-8 text-left align-middle shadow-2xl transition-all">
                    {selectedNewsletter && (
                      <>
                        <Dialog.Title as="h3" className="text-3xl font-bold text-gray-900 mb-6">
                          {selectedNewsletter.title}
                        </Dialog.Title>
                        {selectedNewsletter.subtitle && (
                          <p className="text-lg text-gray-600 mb-4">{selectedNewsletter.subtitle}</p>
                        )}
                        {selectedNewsletter.image && (
                          <img
                            src={selectedNewsletter.image}
                            alt={selectedNewsletter.title}
                            className="w-full h-64 object-cover rounded-xl mb-6"
                          />
                        )}
                        <div
                          className="text-gray-700 mb-6 prose prose-lg"
                          dangerouslySetInnerHTML={{ __html: selectedNewsletter.description }}
                        />
                        {selectedNewsletter.url && (
                          <a
                            href={selectedNewsletter.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedNewsletter.url}
                          </a>
                        )}
                        <p className="text-sm text-gray-500 mt-4">
                          Status: {selectedNewsletter.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(selectedNewsletter.created_at).toLocaleDateString()}
                        </p>
                        <div className="mt-8">
                          <button
                            type="button"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Close
                          </button>
                        </div>
                      </>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </main>
    </div>
  );
};

export default Newsletter;