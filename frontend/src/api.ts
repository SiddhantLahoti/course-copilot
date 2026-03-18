import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8001',
});

export const uploadPDF = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/upload', formData);
};

export const askAI = async (question: string) => {
    const response = await API.post('/chat', { question });
    return response.data;
};

export const fetchQuiz = async () => {
    const response = await API.get('/quiz');
    // Note: AI returns a string that we'll parse into JSON
    return JSON.parse(response.data.quiz.replace(/```json|```/g, ''));
};