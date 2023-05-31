import path from 'path';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RetrievalQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";

import { MODEL_STORES, enabledModel } from '../config/model_store_constants.js';
import { getFileLoader } from '../utils/documentLoader.js';

class ChatService {
  constructor () {
    this.modelService = new MODEL_STORES[enabledModel]
  }

  async startChat(data) {
    const { body: { userInput } } = data;
    const response = await this.modelService.call(userInput);
    return response;
  }

  async ingestFile(data) {
    const { files } = data;
    const { originalFilename, filepath } = files['chat-file'];
    const fileExtension = path.extname(originalFilename);
    
    const loader = getFileLoader(fileExtension, filepath);
    if (!loader) {
      throw Error('bad');
    }

    const docs = await loader.load();
    this.modelService.vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    const baseCompressor = LLMChainExtractor.fromLLM(this.modelService.model);
    this.modelService.vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    this.modelService.retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: this.modelService.vectorStore.asRetriever(),
    });

    this.modelService.chain = RetrievalQAChain.fromLLM(
      this.modelService.model, 
      this.modelService.retriever, 
      { returnSourceDocuments: true }
    );
    return { success: true };
  }
}

export { ChatService };