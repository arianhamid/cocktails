import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("a");
  const [cocktails, setCocktails] = useState([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${url}${searchTerm}`);
      const data = await response.json();
      const { drinks } = data;

      if (drinks) {
        const newCocktails = drinks.map((item) => {
          const { idDrink, strDrink, strDrinkThumb, strAlcoholic, strGlass } =
            item;
          return {
            id: idDrink,
            name: strDrink,
            image: strDrinkThumb,
            info: strAlcoholic,
            glass: strGlass,
          };
        });
        setCocktails(newCocktails);
        setIsLoading(false);
      } else {
        setCocktails([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, fetchData]);
  return (
    <AppContext.Provider
      value={{ isLoading, cocktails, searchTerm, setSearchTerm }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
