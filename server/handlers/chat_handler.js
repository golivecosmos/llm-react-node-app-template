import * as fs from "fs";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ConversationChain, RetrievalQAChain } from 'langchain/chains';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, PromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { ConversationSummaryMemory } from 'langchain/memory';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { Chroma } from "langchain/vectorstores/chroma";
import { csvLoader } from "../utils/csvLoader.js";
import { ChromaClient } from "chromadb";
import { embedder } from "../utils/embeddings.js";
import { createClient } from "redis";
import { RedisVectorStore } from "langchain/vectorstores/redis";


class ChatService {
  constructor () {
    this.llm = new OpenAI({ temperature: 0, verbose: true });
    this.prompt =
    PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

    Relevant pieces of previous conversation:
    {history}

    (You do not need to use these pieces of information if not relevant)

    Current conversation:
    Human: {input}
    AI:`);
  
    this.memory = new ConversationSummaryMemory({ llm: this.chat, returnMessages: true });
  }

  async startChat(data) {
    const { body: { userInput } } = data;

    const chain = new ConversationChain({
      memory: this.memory,
      prompt: this.chatPrompt,
      llm: this.chat,
    });

    const response = await chain.call({
      input: userInput,
    });

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

    const loader = new PDFLoader(`${process.cwd()}/research.pdf`);
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

    // const { data: csvData, meta } = await csvLoader(`${process.cwd()}/orgs-10000.csv`);
    // console.log({ csvData });
    const loader = new CSVLoader(`${process.cwd()}/orgs-10000.csv`);
    const docs = await loader.load();

    const client = createClient({
      url: process.env.REDIS_URL ?? "redis://localhost:6379",
    });
    await client.connect();

    const vectorStore = new RedisVectorStore(new OpenAIEmbeddings(), {
      redisClient: client,
      indexName: "docs",
    });

    console.log({ ide: await vectorStore.checkIndexExists() })

    const batches = embedder.sliceIntoChunks(docs, 1000);
    for (const batch of batches) {
      console.log({batch})
      await vectorStore.addDocuments(batch);
      // await Promise.all(batch.map((text) => vectorStore.addDocuments(text.pageContent)));
    }
    

    // Start the batch embedding process
    // await embedder.init();
    // await embedder.embedBatch(docs, 1000, async (embeddings) => {
      // console.log({ embeddings });
      // counter += embeddings.length;
      //Whenever the batch embedding process returns a batch of embeddings, insert them into the index
      // (await chromaDBClient.getCollection("org-collection")).add()
      // progressBar.update(counter);
    // });
    
    // const retriever = vectorStore.asRetriever();
    // const chain = RetrievalQAChain.fromLLM(this.llm, retriever, { returnSourceDocuments: true });

    // const { text } = await chain.call({
    //   query: userInput,
    // });

    // console.log({ text });
    return { response: 'text' };
  }
}

export { ChatService };