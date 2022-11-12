import axios from "axios";

const baseUrl = "http://127.0.0.1:5000/api/predict";

function transform(data, setProgress) {
    return axios.post(baseUrl, data, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        onUploadProgress: (progressEvent) => setProgress((progressEvent.loaded / progressEvent.total) * 100),
    });
}

export { transform };
