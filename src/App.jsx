import { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "./App.css";
import Navbar from "./components/Navbar";
import PreLoader from "./components/preLoader"; // Assuming preLoader is a component

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("usd"); // Default currency

  const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=15&page=1&sparkline=true`;

  // handles currency change
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        setCoins(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCoins();
  }, [currency]);

  // handles background updates every 60s (does NOT rerun on currency change)
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error("Background fetch error:", error);
      }
    };

    const interval = setInterval(fetchCoins, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <Navbar />
      <div className="overlay"></div>

      {loading ? (
        <div className="loader">
          <PreLoader />
        </div>
      ) : (
        <div className="app">
          <div className="header">
            <h1>Live Crypto Prices</h1>
            <p>
              Track real-time cryptocurrency rates and market movements — all in
              one place.
            </p>
          </div>
          <div className="filter-bar">
            <label htmlFor="currency">Currency: </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="usd">USD ($)</option>
              <option value="ngn">NGN (₦)</option>
              <option value="eur">EUR (€)</option>
            </select>
          </div>

          {coins.length === 0 ? (
            <p>No data available</p>
          ) : (
            <div className="coins">
              <ul>
                {coins.map((coin, i) => (
                  <li key={i}>
                    <div>
                      <span className="coin">
                        <img src={coin.image} alt={`${coin.name} logo`} />
                        <p>
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </p>
                      </span>
                    </div>
                    <div className="price-data">
                      <p>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: currency.toUpperCase(),
                        }).format(coin.current_price)}
                      </p>
                      <Sparklines
                        data={coin.sparkline_in_7d.price}
                        width={100}
                        height={40}
                        className="sparkline"
                      >
                        <SparklinesLine
                          color={
                            coin.price_change_percentage_24h >= 0
                              ? "#7CFC00"
                              : "#FF6B6B"
                          }
                          style={{ fill: "none", strokeWidth: 1 }}
                        />
                      </Sparklines>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
