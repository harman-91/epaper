import React, { useState } from 'react';


const MobilePagesModal = ({ isOpen = true, onClose = () => {} }) => {
  const [activeTab, setActiveTab] = useState('all-pages');

  // Sample data based on the screenshot
  const pages = [
    { id: 1, type: 'Advertisement', image: '/api/placeholder/120/160', title: 'Better Together' },
    { id: 2, type: 'Advertisement', image: '/api/placeholder/120/160', title: 'Tech News' },
    { id: 3, type: 'Advertisement', image: '/api/placeholder/120/160', title: 'Business' },
    { id: 4, type: 'Advertisement', image: '/api/placeholder/120/160', title: 'Finance' },
    { id: 5, type: 'Front Page', image: '/api/placeholder/120/160', title: 'Main News' },
    { id: 6, type: 'Politics', image: '/api/placeholder/120/160', title: 'Political News' },
    { id: 7, type: 'Sports', image: '/api/placeholder/120/160', title: 'Sports Update' },
    { id: 8, type: 'Entertainment', image: '/api/placeholder/120/160', title: 'Celebrity News' },
    { id: 9, type: 'Business', image: '/api/placeholder/120/160', title: 'Market Update' },
  ];


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            X
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Grid of pages */}
        <div className="grid grid-cols-3 gap-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Page thumbnail */}
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                  {/* Placeholder for newspaper page */}
                  <div className="w-full h-full bg-white m-1 rounded flex flex-col p-2">
                    <div className="text-xs font-bold text-red-600 mb-1">The Economic Times</div>
                    {page.type === 'Front Page' ? (
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded mt-2"></div>
                        <div className="space-y-0.5 mt-2">
                          <div className="h-0.5 bg-gray-300 rounded"></div>
                          <div className="h-0.5 bg-gray-300 rounded"></div>
                          <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
                        </div>
                      </div>
                    ) : page.type === 'Advertisement' ? (
                      <div className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded text-white flex items-center justify-center">
                        <div className="text-xs font-bold text-center">AD</div>
                      </div>
                    ) : (
                      <div className="space-y-1 flex-1">
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-gray-300 rounded"></div>
                          <div className="h-0.5 bg-gray-300 rounded"></div>
                          <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Page label */}
              <span className="text-xs text-gray-600 mt-2 text-center font-medium">
                {page.type}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default function Demo() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Open Pages Modal
        </button>
        
        <MobilePagesModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}