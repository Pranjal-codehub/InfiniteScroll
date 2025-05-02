import "./App.css";
import React, { useEffect, useState, useCallback } from "react";

function App() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 

  const fetchProducts = async (skip) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://dummyjson.com/products/?limit=10&skip=${skip}`
      );
      const json = await res.json();
      if (json.products.length > 0) {
        setResponse((prev) => [...prev, ...json.products]);
      } else {
        setHasMore(false); 
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const loadMore = useCallback(() => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    if (bottom && !loading && hasMore) {
      fetchProducts(response.length); // Fetch next set of data
    }
  }, [loading, response.length, hasMore]);

  useEffect(() => {
    fetchProducts(0); // Initial fetch
    window.addEventListener("scroll", loadMore); // Attach scroll event
    return () => {
      window.removeEventListener("scroll", loadMore); // Clean up
    };
  }, [loadMore]);

  return (
    <div className="App">
      <div className="product-list">
        {response.map((data) => (
          <div key={data.id} className="product-item">
            <img src={data.thumbnail} alt={data.title} />
            <h3>{data.title}</h3>
            <p>{data.description}</p>
            <p>
              <strong>Price:</strong> ${data.price}
            </p>
          </div>
        ))}
      </div>

      {loading && <div className="loading-indicator">Loading...</div>}
      {!hasMore && (
        <div className="end-of-data">No more products available.</div>
      )}
    </div>
  );
}

export default App;
