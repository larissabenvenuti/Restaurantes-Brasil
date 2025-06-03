import React from 'react';

const PhotoModal = ({ photo, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 z-[10001] flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="relative max-w-full max-h-[90vh] w-auto h-auto">
      <img
        src={photo}
        alt="Foto ampliada"
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black bg-opacity-60 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 transition-opacity text-xl"
      >
        ✕
      </button>
    </div>
  </div>
);

export default PhotoModal;