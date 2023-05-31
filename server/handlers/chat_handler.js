import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";

import { MODEL_STORES, enabledModel } from '../config/model_store_constants.js';

class ChatService {
  constructor () {
    this.model = new MODEL_STORES[enabledModel]
  }

  async startChat(data) {
    const { body: { userInput } } = data;
    const response = await this.model.call(userInput);

    return response;
  }

  async startFileQa(data) {
    const { body: { userInput } } = data;

    const tmpFile = `${process.cwd()}/mlk_letter.txt`;
    const textFromFile = fs.readFileSync(tmpFile, 'utf-8');

    const baseCompressor = LLMChainExtractor.fromLLM(this.llm);
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([textFromFile]);

    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(),
    });

    const chain = RetrievalQAChain.fromLLM(this.llm, retriever);

    const { text } = await chain.call({
      query: userInput,
    });

    return { response: text };
  }

  async startPdfQa(data) {
    const { body: { userInput }} = data;

    const loader = new PDFLoader(`${process.cwd()}/synthetic_image_research.pdf`);
    const docs = await loader.load();
    
    const baseCompressor = LLMChainExtractor.fromLLM(this.llm);
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(),
    });

    const chain = RetrievalQAChain.fromLLM(this.llm, retriever);

    const { text } = await chain.call({
      query: userInput,
    });

    return { response: text };
  }

  async startGithubRepoQa(data) {
    const { body: { userInput }} = data;

    const loader = new GithubRepoLoader('https://github.com/golivecosmos/pluto', { branch: 'main', recursive: false, unknown: "warn" });
    const docs = await loader.load();
    
    const baseCompressor = LLMChainExtractor.fromLLM(this.llm);
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(),
    });

    const chain = RetrievalQAChain.fromLLM(this.llm, retriever);

    const { text } = await chain.call({
      query: userInput,
    });

    return { response: text };
  }

  async startCSVQa(data) {

    const { body: { userInput }} = data;

    const loader = new CSVLoader(`${process.cwd()}/orgs-10000.csv`);
    const docs = await loader.load();

    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    const retriever = vectorStore.asRetriever();
    const chain = RetrievalQAChain.fromLLM(this.llm, retriever, { returnSourceDocuments: true });

    const { text } = await chain.call({
      query: userInput,
    });

    return { response: text };
  }
}

export { ChatService };