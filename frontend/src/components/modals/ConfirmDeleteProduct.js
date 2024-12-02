import React from 'react';

function ConfirmDeleteProductModal({ productName, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Confirmare Ștergere</h2>
                <p className="mb-6">Ești sigur că vrei să ștergi <strong>{productName}</strong>?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Anulează
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Șterge
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteProductModal;
