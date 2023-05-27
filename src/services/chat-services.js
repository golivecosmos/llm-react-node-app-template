import { requestClient } from './request-client';

const create = async ({ userInput }) => {
    console.log('send me ', userInput);
    const { data } = await requestClient.post('/chat', { userInput }, 120000);
    return;
};

const chatServices = {
    create,
}

export { chatServices };