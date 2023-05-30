import { MODEL_STORES, enabledModel } from '../config/model_store_constants.js';

class ChatService {
  constructor () {
    this.model = new MODEL_STORES[enabledModel]
  }

  async startChat(data) {
    const { body: { userInput } } = data;
    const model = this.model;
    const response = await model.call(userInput);

    return response;
  }
}

export { ChatService };