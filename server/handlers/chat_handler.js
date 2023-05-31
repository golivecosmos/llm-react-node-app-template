import { MODEL_STORES, enabledModel } from '../config/model_store_constants.js';

class ChatService {
  constructor () {
    this.modelService = new MODEL_STORES[enabledModel]
  }

  async startChat(data) {
    const { body: { userInput } } = data;
    const response = await this.modelService.call(userInput);
    return response;
  }

  async ingestFile(data) {
    return this.modelService.ingestFile(data);
  }
}

export { ChatService };
