import { requestClient } from './request-client';

const create = async ({ userInput }) => {
    const { data } = await requestClient.post('/chat', { userInput }, 120000);
    return data;
};

const chatServices = {
    create,
}

export { chatServices };