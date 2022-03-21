import { useState } from "react";

export default function useApi(apiFunc, showLog = false) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunc(...args);
    if(showLog){
      console.log("SERVER RESPONSE:", response);
    }
    setData(response.data);
    setLoading(false);
    setError(!response.ok);
    return response;
  };

  return { data, error, loading, request };
}
