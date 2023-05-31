import { HfInference } from "@huggingface/inference";

const { HUGGINGFACEHUB_API_KEY } = process.env;

class HuggingFaceService {
    constructor () {
      this.modelName = 'microsoft/DialoGPT-large';
      this.model = new HfInference(HUGGINGFACEHUB_API_KEY);
    }

    async call(userInput) {
      // TO DO: pass in past_user_inputs for context
      const response = await this.model.conversational({
        model: this.modelName,
        temperature: 0,
        inputs: {
          text: userInput,
        }
      });

      return { response: response && response.generated_text };
    }
}

export { HuggingFaceService }
