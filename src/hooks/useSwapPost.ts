import { useState } from "react";

export const usePost = () => {
  const [response, setResponse] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  const fetchData = async (reqBody: any) => {
    try {
    setIsPending(true)
      const response = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/post-swap', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      });
      if (!response.ok) throw new Error(response.statusText);
      const json = await response.json();
      setResponse(json);
      setIsPending(false)
// deleting success message aftre 5 secs by clearing response
      setTimeout(() => {
        setResponse(null);
      }, 5000);
    } catch (error) {
      setIsPending(false)
      throw(`${error} Could not Fetch Data `);
    }
  };

  return { response, isPending, fetchData };
};