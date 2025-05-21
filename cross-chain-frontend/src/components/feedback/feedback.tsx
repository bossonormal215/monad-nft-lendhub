"use client"
import React, { useState } from 'react';

const FeedbackModal = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const tallyFormUrl = 'https://tally.so/r/nGg9JZ'; // Replace with your Tally form URL

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <>
            <button
                onClick={openModal}
                className="flex items-center px-4 py-2 rounded-xl bg-monad-500 text-white font-bold text-base shadow-lg hover:bg-monad-800 transition-colors z-50"
            >
                <span className="mr-1">📣</span>  Feedback
            </button>

            {modalIsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-70"
                        onClick={closeModal}
                    ></div>
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-xl mx-auto overflow-hidden flex flex-col" style={{ height: '70vh' }}>
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        {/* Tally Form */}
                        <iframe
                            data-tally-src={tallyFormUrl}
                            loading="lazy"
                            width="100%"
                            height="100%"
                            title="Submit Feedback"
                            src={tallyFormUrl}
                            className="w-full h-full border-0"
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackModal;