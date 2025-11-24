import { CustomerAPI } from "../apis";

const customerAPI = new CustomerAPI();

export  const useGenerateCode = async () => {
    try {
        const response = await customerAPI.generateCode();
        // New API response convention: { data, meta, error }
        if (!response.error) {
            console.log("Generated code successfully:", response.data);
            return response.data;
        } else {
            throw new Error(response.error.message || "Failed to generate code");
        }
    } catch (error) {
        console.log("Error in useGenerateCode:", error);
        throw error;
    }
}