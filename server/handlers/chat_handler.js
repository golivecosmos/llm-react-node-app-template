import { AgentExecutor, ChatAgent } from 'langchain/agents';
import { ConversationChain, LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema';
import { SerpAPI } from 'langchain/tools';

class ChatService {
  static async startChat(data) {
    const chat = new ChatOpenAI({ temperature: 0, verbose: true });
    const { body: { userInput } } = data;

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate('The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. It ends a conversation with an inspiring message.'),
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

    // Define the list of tools the agent can use
    const tools = [
      new SerpAPI(process.env.SERPAPI_API_KEY, {
        location: 'Austin,Texas,United States',
        hl: 'en',
        gl: 'us',
      }),
    ];
    // Create the agent from the chat model and the tools
    const agent = ChatAgent.fromLLMAndTools(new ChatOpenAI(), tools);
    // Create an executor, which calls to the agent until an answer is found
    const executor = AgentExecutor.fromAgentAndTools({ agent, tools });

    const responseG = await executor.run('How many people live in canada as of 2023?');

    console.log(responseG);
  }
}

export default ChatService;
