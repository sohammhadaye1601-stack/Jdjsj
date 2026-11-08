import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const { content } = useContent();
  const { gallery } = content;

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Interiors',
    'Workout',
    'Weight Training',
    'Personal Training',
    'Equipment',
    'Transformations',
  ];

  // Sort gallery by order
  const sortedGallery = [...gallery].sort((a, b) => a.order - b.order);

  const filteredPhotos =
    activeFilter === 'All'
      ? sortedGallery
      : sortedGallery.filter((item) => item.category === activeFilter);

  const openLightbox = (photo: GalleryItem) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;

    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % filteredPhotos.length;
      setSelectedPhoto(filteredPhotos[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
      setSelectedPhoto(filteredPhotos[prevIndex]);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#090909] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Tour</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            GYM GALLERY
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            Step Inside Our High-Octane Facility, Equipment, And Real Member Milestones
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === cat
                  ? 'bg-[#E32636] text-white shadow-lg shadow-[#E32636]/25'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
            <p className="text-neutral-400">No images in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(photo)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer aspect-4/3 hover:border-[#E32636]/60 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-neutral-300 border border-neutral-700/60">
                    {photo.category}
                  </span>
                </div>

                {/* Zoom Icon button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-[#E32636] flex items-center justify-center text-white shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Caption / Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-heading text-sm font-bold text-white truncate">
                    {photo.title}
                  </h4>
                  {photo.caption && (
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Owner helper prompt */}
        <div className="mt-12 text-center text-xs text-neutral-500">
          <span>* Gym owner can add, replace, delete, and reorder photos anytime from the </span>
          <span className="text-[#E32636] font-semibold">Admin Dashboard</span>.
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center hover:bg-[#E32636] transition-colors z-20"
            aria-label="Close image viewer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-neutral-900/80 border border-neutral-700 text-white flex items-center justify-center hover:bg-[#E32636] transition-colors z-20 hidden sm:flex"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-neutral-900/80 border border-neutral-700 text-white flex items-center justify-center hover:bg-[#E32636] transition-colors z-20 hidden sm:flex"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & details container */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl border border-neutral-800 shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-bold text-[#E32636] uppercase tracking-wider mb-1">
                {selectedPhoto.category}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                {selectedPhoto.title}
              </h3>
              {selectedPhoto.caption && (
                <p className="text-sm text-neutral-400 mt-1 max-w-xl mx-auto">
                  {selectedPhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
