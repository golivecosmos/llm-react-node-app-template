import { AgentExecutor, ChatAgent } from 'langchain/agents';
import { ConversationChain, LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';
import { SerpAPI } from 'langchain/tools';

class ChatService {
  static async startChat(data) {
    const chat = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0, verbose: true });
    const { body: { userInput } } = data;

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate('The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.'),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const chain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true }),
      prompt: chatPrompt,
      llm: chat,
    });

    const response = await chain.call({
      input: userInput,
    });

    return response;
  }
}

export { ChatService };