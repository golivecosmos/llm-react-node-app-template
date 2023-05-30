import { HuggingFaceInference } from 'langchain/llms/hf';

class HuggingFaceService {
    constructor () {
        this.model = new HuggingFaceInference({
            model: 'gpt2',
            temperature: 0.7,
            maxTokens: 50,
        });
    }

    async getModel() {
        const model = await this.model();
    }
  
    async call(userInput) {
        console.log('this model ', this.model)
        const response = await this.model.call(
          userInput,
        );
       return response;
    }
}

export { HuggingFaceService }

