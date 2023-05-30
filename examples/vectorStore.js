
import { OpenAI } from "langchain/llms/openai";
import { ConversationChain, LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, PromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { VectorStoreRetrieverMemory } from 'langchain/memory';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

class ChatService {
  constructor () {
    this.chat = new OpenAI({ temperature: 0, verbose: true });
    this.prompt =
  PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

    Relevant pieces of previous conversation:
    {history}

    (You do not need to use these pieces of information if not relevant)

    Current conversation:
    Human: {input}
    AI:`);
    // this.chatPrompt = ChatPromptTemplate.fromPromptMessages([
    //   SystemMessagePromptTemplate.fromTemplate('The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.'),
    //   new MessagesPlaceholder('history'),
    //   HumanMessagePromptTemplate.fromTemplate('{input}'),
    // ]);


    this.vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    this.memory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: this.vectorStore.asRetriever(4),
      memoryKey: "history",      
      returnDocs: true,
    });
  }

  async startChat(data) {
    const { body: { userInput } } = data;

    const chain = new ConversationChain({
      memory: this.memory,
      prompt: this.prompt,
      llm: this.chat,
    });

    const response = await chain.call({
      input: userInput,
    });

    console.log({ modelResp: response });
    return response;
  }
}

export { ChatService };