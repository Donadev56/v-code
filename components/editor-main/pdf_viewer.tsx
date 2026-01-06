"use client";
import { fromString } from "uint8arrays/from-string";

import { utf8StringToUint8Array } from "@/lib/utils";
import { FileRendererType, OpenedFile } from "@/types/types";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

function PdfViewer({ file }: FileRendererType) {
  return (
    <div style={{ height: "100%" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={file.content} />
      </Worker>
    </div>
  );
}

export default PdfViewer;
