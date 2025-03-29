import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Save letter to Google Drive
export const saveLetterToDrive = async (title: string, content: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/letter/save`,
            {
                title,
                content,
            },
            { withCredentials: true }
        );
        return {
            success: response.data.success,
            file: response.data.file
        };
    } catch (error) {
        console.error("Error saving letter:", error);
        return false;
    }
};


// Fetch list of saved letters from Google Drive
export const getLettersFromDrive = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/letter/list`, {
        withCredentials: true,
      });
      return response.data.files;
    } catch (error) {
      console.error("Error fetching letters:", error);
      return [];
    }
  };
  