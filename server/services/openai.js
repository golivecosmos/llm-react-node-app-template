import { ConversationChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { ConversationSummaryMemory } from 'langchain/memory';

class OpenAiService {
  constructor () {
    this.model = new OpenAI({ temperature: 0, verbose: true });

    this.prompt = PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

    Relevant pieces of previous conversation:
    {history}

    (You do not need to use these pieces of information if not relevant)

    Current conversation:
    Human: {input}
    AI:`);

    this.memory = new ConversationSummaryMemory({ llm: this.model, returnMessages: true });
  }

  assembleChain () {
    const chain = new ConversationChain({
      memory: this.memory,
      prompt: this.prompt,
      llm: this.model,
    });
    return chain;
  }

  call = async (userInput) => {  
    const chain = this.assembleChain();
  
    const response = await chain.call({
      input: userInput,
    });
   return response;
  }
}

export { OpenAiService };
