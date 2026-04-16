"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportNodeAsPng = async (node: HTMLElement, filename = "consensus.png") => {
  const canvas = await html2canvas(node, {
    backgroundColor: "#f2ede2",
    scale: 2,
    useCORS: true,
    logging: false,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

export const exportNodeAsPdf = async (node: HTMLElement, filename = "consensus.pdf") => {
  const canvas = await html2canvas(node, {
    backgroundColor: "#f2ede2",
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 40;
  const availableWidth = pageWidth - margin * 2;
  const imgRatio = canvas.width / canvas.height;

  let drawWidth = availableWidth;
  let drawHeight = drawWidth / imgRatio;

  if (drawHeight > pageHeight - margin * 2) {
    drawHeight = pageHeight - margin * 2;
    drawWidth = drawHeight * imgRatio;
  }

  const x = (pageWidth - drawWidth) / 2;
  const y = (pageHeight - drawHeight) / 2;

  pdf.addImage(imgData, "PNG", x, y, drawWidth, drawHeight);
  pdf.save(filename);
};
