import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("@/component/Common/pdfview"), {
    ssr: false
});

const Pdf=()=>{
    return (
        <div>
            <h1>PDF Viewer</h1>
            <p>This is a placeholder for the PDF viewer component.</p>
            <PDFViewer />
        </div>
    );
}
export default Pdf;