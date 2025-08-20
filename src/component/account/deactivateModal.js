import React from "react";
import LoadingButton from "../global/LoadingButton";

export default function DeactivateModal({
  isOpen,
  onClose,
  onConfirm,
  error,
  loading,
  success,
  onGoHome,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              className="h-6 w-6 text-red-600 animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              />
            </svg>
          </div>

          <div className="mt-3">
            {success ? (
              <p className="text-sm text-gray-600">
                आपका अकाउंट हटाने की मांग मिल गई है। आपका अकाउंट 30 दिन में
                हमेशा के लिए हटा दिया जाएगा। अगर आप अपना फैसला बदलते हैं, तो
                हटाने की तारीख से पहले लॉगिन करके अकाउंट फिर से चालू कर सकते
                हैं।
              </p>
            ) : (
              <>
                <h3 className="text-base font-semibold text-gray-900">
                  डिलीट एकाउंट
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  क्या आप वाकई अपना एकाउंट डिलीट करना चाहते हैं? आपका सारा डेटा
                  हमेशा के लिए हटा दिया जाएगा।
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="mt-2 text-center text-sm text-red-600">
              कृपया दो दोबारा प्रयास करें।
            </div>
          )}

          <div className="mt-4 flex flex-col space-y-3 bg-gray-50 px-4 py-3">
            {success ? (
              <button
                className="w-full rounded-md border border-gray-300 bg-black px-4 py-2 text-white transition hover:bg-red-600"
                type="button"
                onClick={onGoHome}
              >
                होम पेज पर जाएं
              </button>
            ) : (
              <>
                <LoadingButton
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-100"
                  type="button"
                  onClick={onConfirm}
                  loading={loading}
                  loadingClassName="inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-white shadow-sm"
                  loadingDotColor="#ffffff"
                  dotColor="#ffffff"
                  size="0.5rem"
                >
                  डिलीट एकाउंट
                </LoadingButton>

                <button
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-white shadow-sm transition hover:bg-red-600"
                  type="button"
                  onClick={onClose}
                >
                  कैंसिल
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
