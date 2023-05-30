import * as fs from "fs";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ConversationChain, RetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts';
import { ConversationSummaryMemory } from 'langchain/memory';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

class ChatService {
  constructor () {
    this.chat = new ChatOpenAI({ temperature: 0, verbose: true });
    this.chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate('The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.'),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

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

    const baseCompressor = LLMChainExtractor.fromLLM(this.chat);
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([textFromFile]);

    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(),
    });

    const chain = RetrievalQAChain.fromLLM(this.chat, retriever);

    const { text } = await chain.call({
      query: userInput,
    });

    return { response: text };
  }
}

export { ChatService };