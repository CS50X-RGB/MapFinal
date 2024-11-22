import instance from "./axiosInstance";

// create a get request to the API
export const getData = async (url, params) => {
  return await instance.get(url, { params });
};


// create a post request to the API
export const postData = async (url, params, data) => {
  console.log(url, params, data);

  return await instance.post(url, data, { params });
};

export const putData = async (url, params, data) => {
  return await instance.put(url, data, { params });
}
// create a patch request to the API
export const patchData = async (url, params, data) => {
  console.log(url, params, data);

  return await instance.patch(url, data, { params });
};

// create a delete request to the API
export const deleteData = async (url, params) => {
  return await instance.delete(url, { params });
};

// create a post with multipart data
export const postMultipart = async (
  url,
  params,
  formData
) => {
  const customHeaders = {
    "Content-Type": "multipart/form-data",
  };

  try {
    const response = await instance.post(url, formData, {
      params,
      headers: customHeaders,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending multipart request:", error);
    throw error;
  }
};
