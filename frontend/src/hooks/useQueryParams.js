import { useSearchParams } from "react-router-dom";

function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key) => {
    return searchParams.get(key) || "";
  };

  const getAllParams = () => {
    return Object.fromEntries(searchParams.entries());
  };

  const setParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === undefined || value === null || value === "") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams);
  };

  const setParams = (params = {}) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const removeParam = (key) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete(key);

    setSearchParams(nextParams);
  };

  const clearParams = (keys = null) => {
    if (!keys) {
      setSearchParams({});
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    keys.forEach((key) => {
      nextParams.delete(key);
    });

    setSearchParams(nextParams);
  };

  return {
    searchParams,
    getParam,
    getAllParams,
    setParam,
    setParams,
    removeParam,
    clearParams,
  };
}

export default useQueryParams;
