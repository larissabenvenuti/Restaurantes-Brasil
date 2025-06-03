import React from 'react';

const RestaurantDetails = ({ restaurant, onPhotoSelect, priceLevelToDollar, getAllReadableTypes }) => (
  <div className="p-4 sm:p-6 space-y-6">
    <div className="border-b border-amber-100 pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
        <h4 className="text-xl sm:text-2xl font-bold text-amber-950 mb-2 sm:mb-0">
          {restaurant.name}
        </h4>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {getAllReadableTypes(restaurant.types).map((type, index) => (
            <span key={index} className="bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full">
              {type}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-3 flex-wrap">
        <div className="flex items-center space-x-1">
          <span className="text-xl sm:text-2xl">⭐</span>
          <span className="text-lg sm:text-xl font-semibold text-amber-950">
            {restaurant.rating ?? "N/A"}
          </span>
        </div>
        {restaurant.userRatingsTotal && (
          <span className="text-amber-700 text-sm sm:text-base">
            ({restaurant.userRatingsTotal.toLocaleString()} avaliações)
          </span>
        )}
        <div className="text-base sm:text-lg font-medium text-amber-600">
          {priceLevelToDollar(restaurant.priceLevel)}
        </div>
      </div>
    </div>
    {restaurant.photos?.length > 0 && (
      <div>
        <h5 className="text-base sm:text-lg font-semibold text-amber-950 mb-3">Fotos</h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {restaurant.photos.slice(0, 6).map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${restaurant.name} - ${index + 1}`}
              className="rounded-lg w-full h-24 sm:h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity shadow-sm border border-amber-100"
              onClick={() => onPhotoSelect(photo)}
            />
          ))}
        </div>
        {restaurant.photos.length > 6 && (
          <p className="text-xs sm:text-sm text-amber-700 mt-2">
            +{restaurant.photos.length - 6} fotos adicionais
          </p>
        )}
      </div>
    )}
    <div className="space-y-4">
      <h5 className="text-base sm:text-lg font-semibold text-amber-950">Informações de Contato</h5>
      <div className="bg-amber-50 p-3 sm:p-4 rounded-lg space-y-3 text-sm sm:text-base">
        <div>
          <span className="font-medium text-amber-800">Endereço:</span>
          <p className="text-amber-950 mt-1">{restaurant.address}</p>
        </div>
        <div>
          <span className="font-medium text-amber-800">Telefone:</span>
          <p className="text-amber-950 mt-1">{restaurant.phone}</p>
        </div>
        {restaurant.website && (
          <div>
            <span className="font-medium text-amber-800">Website:</span>
            <div className="mt-1">
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-800 underline"
              >
                Visitar site oficial
              </a>
            </div>
          </div>
        )}
        {restaurant.googleUrl && (
          <div>
            <span className="font-medium text-amber-800">Google Maps:</span>
            <div className="mt-1">
              <a
                href={restaurant.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-800 underline"
              >
                Ver no Google Maps
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
    {restaurant.openingHours && (
      <div>
        <h5 className="text-base sm:text-lg font-semibold text-amber-950 mb-3">Horário de Funcionamento</h5>
        <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
          <div className="space-y-1 text-xs sm:text-sm">
            {restaurant.openingHours.map((hour, index) => (
              <p key={index} className="text-amber-900">{hour}</p>
            ))}
          </div>
        </div>
      </div>
    )}
    {restaurant.reviews?.length > 0 && (
      <div className="border-t border-amber-100 pt-4 sm:pt-6">
        <h5 className="text-base sm:text-lg font-semibold text-amber-950 mb-4">Avaliações Recentes</h5>
        <div className="space-y-4 max-h-60 sm:max-h-80 overflow-y-auto custom-scrollbar">
          {restaurant.reviews.map((review, index) => (
            <div key={index} className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="font-medium text-amber-950 text-xs sm:text-sm">
                    {review.author_name}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1 text-xs sm:text-sm">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="text-amber-700 text-xs">
                      ({review.rating}/5)
                    </span>
                  </div>
                </div>
                <span className="text-amber-700 text-xs">
                  {review.relative_time_description}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default RestaurantDetails;