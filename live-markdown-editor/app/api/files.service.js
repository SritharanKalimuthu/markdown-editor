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

export const createAndUploadFile = async (fileData) => {
    try {
        const response = await api.post(`/file/create`, fileData);
        return response;
    } catch (err) {
        console.log("Error creating file", err);
        return err;
    }
}

export const updateMarkdownFile = async (fileData) => {
    try {
        const response = await api.put(`/file/update`, fileData);
        return response;
    } catch (err) {
        console.log("Error creating file", err);
        return err;
    }
}

export const RenameFile = async ( fileData ) => {
    try {
        const response = await api.put(`/file/rename`, fileData);
        return response;
    } catch (err) {
        console.log("Error renaming file", err);
        return err;
    }
}

export const DeleteFile = async ( fileData ) => {
  try {
    console.log(fileData);
    const response = await api.delete(`/file/delete`, {
        data: fileData,
    }); 
    return response;
  } catch (err) {
    console.log("Error deleting file", err);
    return err;
  }
}