import axios from 'axios';

    export const getUsers = async () => {
    const response = await axios.get('/api/users');
    return response.data;
    };


    export const createUser = async (form: any) => {
        try {
        await axios.post('/api/users', form);
        } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        } else {
            throw { message: 'salah user.' };
        }
        }
    };

    export const getUserById = async (id: string | number) => {
        const res = await axios.get(`/api/users/${id}`);
        return res.data;
    };
    
    export const updateUser = async (id: string | number, form: any) => {
        try {
        await axios.put(`/api/users/${id}`, form);
        } catch (error: any) {
        if (error.response) throw error.response.data;
        throw { message: 'memperbarui user.' };
        }
    };

    export const deleteUser = async (id: number) => {
    await axios.delete(`/api/users/${id}`);
    };



