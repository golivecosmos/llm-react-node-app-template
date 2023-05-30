import { requestClient } from './request-client';

const chatWithLLM = async ({ userInput }) => {
    const { data } = await requestClient.post('/chat', { userInput }, 120000);
    return data;
};

const chatServices = {
    chatWithLLM
}

export { chatServices };