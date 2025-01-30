import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Contacts
export const getContacts = async (token, limit = 10, nextPage = null, search = "") => {
  try {
    const url = new URL(`${API_URL}/contacts`);
    url.searchParams.set("limit", limit);

    if (nextPage) {
      url.searchParams.set("nextPage", nextPage);
    }

    // Include search param if we have one
    if (search) {
      url.searchParams.set("search", search);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // e.g. { message, results, total, nextPage }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};
export const fetchContactFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/contacts/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching contact fields:', error);
    throw error;
  }
};

// Companies
export const getCompanies = async (token, limit = 10, nextPage = null, search = "") => {
  try {
    const url = new URL(`${API_URL}/companies`);
    url.searchParams.set('limit', limit);
    if (nextPage) {
      url.searchParams.set('nextPage', nextPage);
    }
    // Include search param if we have one
    if (search) {
      url.searchParams.set("search", search);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};
export const fetchCompanyFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/companies/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching company fields:', error);
    throw error;
  }
};
export const exportAllCompanies = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/companies/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all companies:', error);
    throw error;
  }
};

// Preferences
export const fetchPreferences = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/preferences`, {
      params: { category },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('hubspotToken')}`,
      },
    });
    return response.data.preferences;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
};
export const savePreferences = async (category, selectedFields) => {
  try {
    const response = await axios.post(
      `${API_URL}/preferences`,
      { category, selectedFields },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('hubspotToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};


// Deals
export const getDeals = async (token, limit = 10, nextPage = null, search = "") => {
  try {
    const url = new URL(`${API_URL}/deals`);
    url.searchParams.set('limit', limit);
    if (nextPage) {
      url.searchParams.set('nextPage', nextPage);
    }

    // Include search param if we have one
    if (search) {
      url.searchParams.set("search", search);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // {
    //   "message": "Deals fetched successfully",
    //   "results": [...],
    //   "total": ...,
    //   "nextPage": "..." or null
    // }
    return response.data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};
export const fetchDealFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/deals/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Should return fields like { fieldKey: '...', fieldLabel: '...' }
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching deal fields:', error);
    throw error;
  }
};
export const exportAllDeals = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/deals/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all deals:', error);
    throw error;
  }
};

// exportAllContacts
export const exportAllContacts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/contacts/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    throw error;
  }
};

// Products
export const getProducts = async (token, limit = 10, nextPage = null, search = "") => {
  try {
    const url = new URL(`${API_URL}/products`);
    url.searchParams.set('limit', limit);
    if (nextPage) {
      url.searchParams.set('nextPage', nextPage);
    }
    // Include search param if we have one
    if (search) {
      url.searchParams.set("search", search);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};
export const fetchProductFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/products/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching contact fields:', error);
    throw error;
  }
};
export const exportAllProducts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/products/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    throw error;
  }
};

// Quotes
export const getQuotes = async (token, limit = 10, nextPage = null) => {
  try {
    const url = new URL(`${API_URL}/quotes`);
    url.searchParams.set('limit', limit);
    if (nextPage) {
      url.searchParams.set('nextPage', nextPage);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};
export const fetchQuoteFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/quotes/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching contact fields:', error);
    throw error;
  }
};
export const exportAllQuotes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/quotes/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    throw error;
  }
};

// Payments
export const getPayments = async (token, limit = 10, nextPage = null) => {
  try {
    const url = new URL(`${API_URL}/payments`);
    url.searchParams.set('limit', limit);
    if (nextPage) {
      url.searchParams.set('nextPage', nextPage);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};
export const fetchPaymentFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/payments/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching payment fields:', error);
    throw error;
  }
};
export const exportAllPayments = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/payments/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all payments:', error);
    throw error;
  }
};

// Invoices
export const getInvoices = async (token, limit = 10, nextPage = null) => {
  try {
    const url = new URL(`${API_URL}/invoices`);
    url.searchParams.set('limit', limit);
    if (nextPage) {
      url.searchParams.set('nextPage', nextPage);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};
export const fetchInvoiceFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching invoice fields:', error);
    throw error;
  }
};
export const exportAllInvoices = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all invoice:', error);
    throw error;
  }
};

// Subscriptions
export const getSubscriptions = async (token, limit = 10, nextPage = null) => {
  try {
    const url = new URL(`${API_URL}/subscriptions`);
    url.searchParams.set('limit', limit);
    if (nextPage) {
      url.searchParams.set('nextPage', nextPage);
    }

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};
export const fetchSubscriptionFields = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/subscriptions/user/fields`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.fields;
  } catch (error) {
    console.error('Error fetching subscription fields:', error);
    throw error;
  }
};
export const exportAllSubscriptions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/subscriptions/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API response structure: { message, results, total }
  } catch (error) {
    console.error('Error fetching all subscription:', error);
    throw error;
  }
};