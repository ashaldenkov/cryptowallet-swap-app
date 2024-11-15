import { useState, useEffect } from "react";

export const useFetch = () => {
  const [balance, setBalance] = useState<any>(null);
  const [price, setPrice] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-balance');
      if (!response.ok) throw new Error(response.statusText);
      const json = await response.json();
      setBalance(json);

      const response2 = await fetch('https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-price');
      if (!response2.ok) throw new Error(response2.statusText);
      const json2 = await response2.json();
      setPrice(json2);

      setIsLoading(false);
      setError(null);
    } catch (error) {
      setError(`${error} Could not Fetch Data `);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { balance, price, isLoading, error };
};