import { MODEL_STORES, enabledModel } from '../config/model_store_constants.js';

class ChatService {
  constructor () {
    this.model = new MODEL_STORES[enabledModel]
  }

  async startChat(data) {
    const { body: { userInput } } = data;
    const response = await this.model.call(userInput);

    return response;
  }
}

export { ChatService };