import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts';
import { BufferWindowMemory } from 'langchain/memory';

process.env.OPENAI_API_KEY = 'YOUR API KEY';

const run = async () => {
  const llm = new ChatOpenAI({ temperature: 0, verbose: true });
  const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate('The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.'),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ]);

  const memory = new BufferWindowMemory({ returnMessages: true, k: 5 });
  const userInput = 'Hi I\'m a human';

  const chain = new ConversationChain({
    memory,
    prompt,
    llm,
  });

  return chain.call({
    input: userInput,
  });
}

run();