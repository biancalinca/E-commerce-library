import React from 'react';

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirmare Ștergere</h2>
        <p className="mb-6">Ești sigur că vrei să ștergi acest utilizator?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
            onClick={onCancel}
          >
            Anulează
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
