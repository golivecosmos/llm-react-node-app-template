import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ConversationChain, RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { ConversationSummaryMemory } from 'langchain/memory';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";


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