import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts';
import { EntityMemory } from 'langchain/memory';

class ChatService {
  constructor () {
    this.chat = new ChatOpenAI({ temperature: 0, verbose: true });
    this.chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate('The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.'),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    this.memory = new EntityMemory({ llm: this.chat, returnMessages: true });
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
}

export { ChatService };