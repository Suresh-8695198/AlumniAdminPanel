import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const NewsletterCard = ({ newsletter, onEdit, onView, onDelete }) => {
  const isDraft = newsletter.status === 'draft';
  const cardClass = isDraft
    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
    : 'bg-gradient-to-br from-green-50 to-teal-50 border-green-200';

  return (
    <div
      className={`relative p-6 rounded-3xl shadow-xl border ${cardClass} hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl opacity-30" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900">{newsletter.title}</h3>
        {newsletter.subtitle && (
          <p className="text-sm text-gray-600 mt-2">{newsletter.subtitle}</p>
        )}
        {newsletter.images && newsletter.images.length > 0 && (
          <Carousel showThumbs={false} autoPlay infiniteLoop className="mt-4 mb-4">
            {newsletter.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.image}
                  alt={`Newsletter image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl shadow-sm"
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />
              </div>
            ))}
          </Carousel>
        )}
        <div
          className="text-sm text-gray-600 mt-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: newsletter.description }}
        />
        {newsletter.url && (
          <a
            href={newsletter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-2 inline-block text-sm"
          >
            {newsletter.url}
          </a>
        )}
        <p className="text-sm text-gray-500 mt-3">Status: {newsletter.status}</p>
        <p className="text-sm text-gray-500">
          Created: {new Date(newsletter.created_at).toLocaleDateString()}
        </p>
        <div className="flex gap-3 mt-4">
          {isDraft ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(newsletter);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md text-sm font-medium"
            >
              Edit Draft
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(newsletter);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md text-sm font-medium"
            >
              View Published
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(newsletter.id);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCard;