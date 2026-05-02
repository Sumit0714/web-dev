import { useState, useEffect } from 'react';
import axios from 'axios';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('https://fakestoreapi.com/products');
        if (!cancelled) {
          // Enrich with occasional oldPrice for sale badges
          const enriched = data.map(p => ({
            ...p,
            oldPrice: [2, 5, 8, 11, 14, 17].includes(p.id)
              ? +(p.price * 1.28).toFixed(2)
              : null,
          }));
          setProducts(enriched);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}
