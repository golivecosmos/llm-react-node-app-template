import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts';
import { ConversationSummaryMemory } from 'langchain/memory';

class OpenAiService {
  constructor () {
    this.model = new ChatOpenAI({ temperature: 0, verbose: true });

    this.chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate('The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.'),
      new MessagesPlaceholder('history'),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    this.memory = new ConversationSummaryMemory({ llm: this.model, returnMessages: true });
  }

  assembleChain () {
    const chain = new ConversationChain({
      memory: this.memory,
      prompt: this.chatPrompt,
      llm: this.model,
    });
    return chain;
  }

  call = async (userInput) => {  
    const chain = this.assembleChain();
  
    const response = await chain.call({
      input: userInput,
    });
    console.log('response ', response);
   return response;
  }
}

export { OpenAiService };
