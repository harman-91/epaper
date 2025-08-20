import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

// const pdfUrl = 'https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf';

function PdfView({numPages,pageNumber,pdfUrl,onDocumentLoadSuccess,goToPreviousPage,goToNextPage}) {


  return (
    <div className="pdf-div flex flex-col items-center">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          aria-label="Previous page"
        >
          <HiChevronLeft size={24} />
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          aria-label="Next page"
        >
          <HiChevronRight size={24} />
        </button>
      </div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          key={`page_${pageNumber}`}
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}

export default PdfView;