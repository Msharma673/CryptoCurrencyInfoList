import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './CryptoList.css';

function CryptoList() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    if (search.trim() !== '') {
      navigate(`/cryptosearch/${search}`);
    }
  };

  const columns = [
    {
      name: 'Coin',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Symbol',
      selector: (row) => row.symbol.toUpperCase(),
      sortable: true,
    },
    {
      name: 'Current Price',
      selector: (row) => `$${row.current_price.toLocaleString()}`,
      sortable: true,
    },
    {
      name: 'Market Cap',
      selector: (row) => `$${row.market_cap.toLocaleString()}`,
      sortable: true,
    },
    {
      name: 'Price Change (%)',
      selector: (row) => `${row.price_change_percentage_24h.toFixed(2)}%`,
      sortable: true,
    },
  ];

  return (
    <div className="crypto-list">
      <h1>Cryptocurrency Prices</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a cryptocurrency"
          value={search}
          onChange={handleSearch}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          title="Top 100 Cryptocurrencies by Market Cap"
          columns={columns}
          data={coins}
          pagination
          highlightOnHover
          striped
        />
      )}
    </div>
  );
}

export default CryptoList;
