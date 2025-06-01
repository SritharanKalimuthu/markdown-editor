import api from "./axios.instance";

export const getFiles = async (userkey) => {
    try {
        const response = await api.get(`/file?userKey=${encodeURIComponent((userkey))}`);
        return response;
    } catch (err) {
        console.log("Error fetching files", err);
        return err;
    }
};

export const getFileData = async (fileId) => {
    try {
        const response = await api.get(`/file/getfile?fileId=${encodeURIComponent((fileId))}`);
        return response;
    } catch (err) {
        console.log("Error fetching files", err);
        return err;
    }
};

export const createAndUploadFile = async (formData) => {
    try {
        const response = await api.post(`/file/create`, formData);
        return response;
    } catch (err) {
        console.log("Error creating file", err);
        return err;
    }
}

export const updateMarkdownFile = async (formData) => {
    try {
        const response = await api.put(`/file/update`, formData);
        return response;
    } catch (err) {
        console.log("Error creating file", err);
        return err;
    }
}