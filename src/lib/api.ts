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
  
  // Se API_BASE_URL for vazio, usamos caminhos relativos /api/v1/...
  // Se for "/api", o resultado será /api/api/v1/... (que o Nginx tratará) 
  // O ideal é que se API_BASE_URL terminar em /api, a gente não adicione /api novamente.
  
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

