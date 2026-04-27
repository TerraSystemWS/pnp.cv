import React from "react";

const SimpleModal = ({ isOpen, onClose, pdfSrc }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
			<div className="fixed inset-0 transition-opacity" onClick={onClose}>
				<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>
			<div className="relative bg-white rounded-lg overflow-hidden max-w-md">
				<div className="p-6">
					{/* <h2 className="text-lg font-semibold text-gray-800">
						Hello, world!
					</h2> */}
					<iframe className="w-full h-96" src={pdfSrc} />
					<button
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default SimpleModal;
