import { HuggingFaceService } from '../services/hf.js'
import { OpenAiService } from '../services/openai.js'

export const MODEL_STORES = {
    'HUGGING_FACE': HuggingFaceService,
    'OPEN_AI': OpenAiService,
};

export const { ENABLED_MODEL_STORE } = process.env;
export const DEFAULT_ENABLED_MODEL_STORE = 'HUGGING_FACE';

export const enabledModel = ENABLED_MODEL_STORE || DEFAULT_ENABLED_MODEL_STORE;