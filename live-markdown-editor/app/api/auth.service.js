import api from "./axios.instance";

export const getUser = async(email) => {
    try {
        const response = await api.get(`/user?email=${encodeURIComponent((email).toLowerCase())}`);
        return response;
    }catch(err){
        console.log("Error fetching user details", err);
        return err;
    }
}

export const registerUser = async(userData) =>{
    try{
        const response = await api.post(`/user/register`, userData);
        return response;
    }catch (err){
        console.log("Error registering user", err);
        return err;
    }
}

export const loginUser = async(userData) =>{
    try{
        const response = await api.post(`/user/login`, userData);
        return response;
    }catch (err){
        console.log("Error logging in", err);
        return err;
    }
}

export const updateUsername = async ( userData ) =>{
    try{
        const response = await api.post(`/user/updatename`, userData);
        return response;
    }catch (err){
        console.log("Error updating username", err);
        return err;
    };
}

export const otpVerification = async( userData ) =>{
    try{
        const response = await api.post(`/auth`, userData);
        return response;
    }catch (err){
        console.log("Error logging in", err);
        return err;
    }
}