import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NewsletterEditor from '../components/NewsletterEditor';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Tilt from 'react-parallax-tilt';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import NewsletterCard from '../components/NewsletterCard';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
    fetchNewsletters();
    setEditingNewsletter(null);
  };

  const handleCardClick = (newsletter) => {
    if (newsletter.status === 'draft') {
      setEditingNewsletter({
        id: newsletter.id,
        title: newsletter.title,
        subtitle: newsletter.subtitle || '',
        description: newsletter.description || '',
        url: newsletter.url || '',
        status: newsletter.status,
        images: newsletter.images || [],
      });
    } else {
      setSelectedNewsletter(newsletter);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (newsletterId) => {
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      try {
        await api.delete(`newsletters/${newsletterId}/`);
        setNewsletters(newsletters.filter((n) => n.id !== newsletterId));
        toast.success('Newsletter deleted successfully!');
      } catch (error) {
        console.error('Error deleting newsletter:', error);
        toast.error('Failed to delete newsletter');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all newsletters?')) {
      try {
        await api.delete('newsletters/delete-all/');
        setNewsletters([]);
        toast.success('All newsletters deleted successfully!');
      } catch (error) {
        console.error('Error deleting all newsletters:', error);
        toast.error('Failed to delete all newsletters');
      }
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
          <NewsletterEditor
            initialData={editingNewsletter || {}}
            isEditing={!!editingNewsletter}
            onSave={handleSave}
          />
          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Previous Newsletters</h2>
              <div className="flex gap-4">
                <button
                  onClick={fetchNewsletters}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw size={20} />
                  Refresh
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Trash2 size={20} />
                  Delete All
                </button>
              </div>
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
                    <NewsletterCard
                      newsletter={newsletter}
                      onEdit={() => handleCardClick(newsletter)}
                      onView={() => handleCardClick(newsletter)}
                      onDelete={handleDelete}
                    />
                  </Tilt>
                ))}
              </div>
            )}
          </div>
        </div>

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
              <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                {/* Left Ribbon */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 transform -rotate-45 -translate-x-16 translate-y-8 shadow-lg animate-ribbon-slide-left pointer-events-none">
                  <span className="absolute inset-0 flex items-center justify-center text-white font-serif text-lg">Celebrate!</span>
                </div>
                {/* Right Ribbon */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-600 to-cyan-600 transform rotate-45 translate-x-16 translate-y-8 shadow-lg animate-ribbon-slide-right pointer-events-none">
                  <span className="absolute inset-0 flex items-center justify-center text-white font-serif text-lg">Success!</span>
                </div>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl p-10 text-left align-middle shadow-2xl transition-all border border-purple-200/50">
                    <div className="relative">
                      <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50 blur-2xl animate-pulse"></div>
                      <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-50 blur-2xl animate-pulse"></div>
                      {selectedNewsletter && (
                        <>
                          <Dialog.Title
                            as="h3"
                            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-700 mb-6"
                          >
                            {selectedNewsletter.title}
                          </Dialog.Title>
                          {selectedNewsletter.subtitle && (
                            <p className="text-xl text-gray-600 mb-2 font-medium">{selectedNewsletter.subtitle}</p>
                          )}
                          <div className="flex items-center text-sm text-gray-500 mb-6">
                            <span>Published: {new Date(selectedNewsletter.created_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              {selectedNewsletter.status.charAt(0).toUpperCase() + selectedNewsletter.status.slice(1)}
                            </span>
                          </div>
                          {selectedNewsletter.images && selectedNewsletter.images.length > 0 && (
                            <Carousel
                              showThumbs={false}
                              autoPlay
                              infiniteLoop
                              interval={3000}
                              transitionTime={600}
                              className="mb-8 rounded-2xl overflow-hidden shadow-lg"
                            >
                              {selectedNewsletter.images.map((image, index) => (
                                <div key={index}>
                                  <img
                                    src={image.image}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-80 object-cover"
                                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                                  />
                                </div>
                              ))}
                            </Carousel>
                          )}
                          <div
                            className="text-gray-700 mb-8 prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: selectedNewsletter.description }}
                          />
                          {selectedNewsletter.url && (
                            <a
                              href={selectedNewsletter.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 decoration-blue-300 hover:decoration-blue-500 transition-all duration-200"
                            >
                              {selectedNewsletter.url}
                            </a>
                          )}
                          <div className="mt-10 flex justify-end">
                            <button
                              type="button"
                              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                              onClick={() => setIsModalOpen(false)}
                            >
                              Close Preview
                            </button>
                          </div>
                        </>
                      )}
                    </div>
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