const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url && url !== "undefined") {
    return url.replace(/\/$/, "");
  }
  return "";
};

export const API_BASE_URL = getBaseUrl();

export async function apiFetch(endpoint: string, init?: RequestInit) {
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  
  
  
  
  
  let fullUrl = "";
  if (API_BASE_URL.endsWith("/api")) {
     fullUrl = `${API_BASE_URL}/v1/${cleanEndpoint}`;
  } else if (API_BASE_URL === "") {
     fullUrl = `/api/v1/${cleanEndpoint}`;
  } else {
     fullUrl = `${API_BASE_URL}/api/v1/${cleanEndpoint}`;
  }
    
  return fetch(fullUrl, init);
}

