import csvIcon from '/assets/CSV Icon.svg';
import docxIcon from '/assets/Docx SVG Icon.svg';
import fileIcon from '/assets/File Alt Vector Icon.svg';
import jpgIcon from '/assets/Jpg Vector Icon.svg';
import excelIcon from '/assets/Microsoft Excel Icon.svg';
import pdfIcon from '/assets/PDF File 2 Icon.svg';
import pngIcon from '/assets/Png Vector Icon.svg';
import pptxIcon from '/assets/Pptx PowerPoint Icon.svg';
import zipIcon from '/assets/File Zip Icon.svg';
import svgIcon from '/assets/SVG Icon from SVG Repo.svg';


const fileIcons = {
  csv: csvIcon,
  docx: docxIcon,
  file: fileIcon,
  jpg: jpgIcon,
  jpeg: jpgIcon,
  png: pngIcon,
  pdf: pdfIcon,
  pptx: pptxIcon,
  zip: zipIcon,
  xlsx: excelIcon,
  xls: excelIcon,
  default: fileIcon,
  svg: svgIcon
};

export function getFileExtension(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return fileIcons[ext] || fileIcons.default;
}

export function convertDate(date){
  const dateObj = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
}

export function formatFileSize(size) {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}

export { fileIcons };