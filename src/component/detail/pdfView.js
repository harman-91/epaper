"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import DataLoading from "../Common/DataLoading";
import DocViewer, { DocViewerRenderers, DocRenderer } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const CustomPDFRenderer = ({ mainState }) => {
  const { currentDocument } = mainState;
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!currentDocument || !canvasRef.current) return;

    const renderPDF = async () => {
      try {
        const pdf = await pdfjs.getDocument({
          url: currentDocument.uri,
          cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
          cMapPacked: true,
          renderScale: 2.0, // Higher resolution for better zoom quality
        }).promise;

        const page = await pdf.getPage(1); // Render first page
        const viewport = page.getViewport({ scale: 2.0 }); // Adjust scale for quality

        const canvas = canvasRef.current;
        if (!canvas) {
          console.error("Canvas element not found");
          return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
          console.error("Failed to get 2D context");
          return;
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (error) {
        console.error("Error rendering PDF:", error);
      }
    };

    renderPDF();
  }, [currentDocument]);

  if (!currentDocument) return null;

  return (
    <div id="custom-pdf-renderer">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

// Override file types and weight
CustomPDFRenderer.fileTypes = ["pdf", "application/pdf"];
CustomPDFRenderer.weight = 1;

// Optional: Disable fileLoader if rendering is handled in useEffect
CustomPDFRenderer.fileLoader = ({ fileLoaderComplete }) => {
  fileLoaderComplete(); // Signal completion immediately
};

const PdfView = ({
  isLoading,
  item,
  currentSlideIndex,
  docs,
  onDocumentLoadSuccess,
  zoomLevel,
}) => {
  return (
    <>
      {isLoading ? (
        <DataLoading />
      ) : (
        <div className="doc-viewer-container">
          <DocViewer
            documents={[docs[currentSlideIndex]]}
            pluginRenderers={[CustomPDFRenderer, ...DocViewerRenderers]}
            style={{ width: "100%", height: "100%" }}
            config={{
              pdfZoom: {
                defaultZoom: zoomLevel,
                zoomJump: 0.5,
                maxZoom: 3,
                minZoom: 0.5,
              },
              header: {
                disableHeader: true,
                disableFileName: true,
                retainURLParams: true,
                overrideComponent: () => null,
              },
              pdfVerticalScrollByDefault: true,
            }}
            onDocumentLoad={() => onDocumentLoadSuccess({ numPages: 1 })}
          />
        </div>
      )}
    </>
  );
};

export default memo(PdfView);