import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CryptoSearch.css';

function CryptoSearch() {
  const { coinName } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: 'usd',
              ids: coinName.toLowerCase(),
              order: 'market_cap_desc',
              per_page: 1,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoin(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [coinName]);

  return (
    <div className="crypto-search">
      <h1>Cryptocurrency Details</h1>
      <button onClick={() => navigate('/cryptolist')}>Back</button>
      {loading ? (
        <p>Loading...</p>
      ) : coin ? (
        <div className="coin-details">
          <img src={coin.image} alt={coin.name} />
          <h2>
            {coin.name} ({coin.symbol.toUpperCase()})
          </h2>
          <p>Current Price: ${coin.current_price}</p>
          <p>Market Cap: ${coin.market_cap}</p>
          <p>24h Change: {coin.price_change_percentage_24h}%</p>
        </div>
      ) : (
        <p>No coin found!</p>
      )}
    </div>
  );
}

export default CryptoSearch;
