import { HuggingFaceService } from '../services/model_hf.js';
import { OpenAiService } from '../services/model_openai.js';

const { ENABLED_MODEL } = process.env;

class ChatService {
  constructor () {
  }

  async selectModelService() {
    let model;
    switch (ENABLED_MODEL) {
      case 'HUGGINGFACEHUB':
        const huggingFaceService = new HuggingFaceService();
        model = huggingFaceService;
        break;
      case 'OPENAI':
        const openAiService = new OpenAiService();
        model = openAiService;
        break;
      default:
        break;
    }
    return model;
  }

  async startChat(data) {
    const { body: { userInput } } = data;
    const model = this.selectModelService();
    console.log('model ', model.OpenAiService);
    const response = await model.call(userInput);

    return response;
  }
}

export { ChatService };