import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const getFileLoader = (fileExt, filePath) => {
  let loader;
  switch (fileExt) {
    case '.pdf': 
      loader = new PDFLoader(filePath);
      break;
    case '.txt': 
      loader = new TextLoader(filePath);
      break;
    case '.csv': 
      loader = new CSVLoader(filePath);
      break;
    default: 
      console.log('unsupported format');
      break;
	}
  
  return loader;
};


export { getFileLoader };
