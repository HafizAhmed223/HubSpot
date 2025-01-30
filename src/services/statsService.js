import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getStats = async (token) => {
    try {
        const url = new URL(`${API_URL}/stats`);

        const response = await axios.get(url.toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        throw error;
    }
};

export const dynamicSearch = async (token, searchTerm) => {
  try {
    // For mocking, we'll assume you have an endpoint /dynamic-search
    const url = new URL(`${API_URL}/dynamic-search`);
    url.searchParams.set("query", searchTerm);

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Example response:
    // {
    //   "allFields": [
    //     { "fieldKey": "name", "fieldLabel": "Name" },
    //     { "fieldKey": "email", "fieldLabel": "Email" },
    //     ...
    //   ],
    //   "results": [
    //     { "id": 1, "name": "John Doe", "email": "john@example.com", ... },
    //     ...
    //   ],
    //   "total": 42,
    //   "nextPage": null
    // }
    return response.data;
  } catch (error) {
    console.error("Error calling dynamicSearch:", error);
    throw error;
  }
};
