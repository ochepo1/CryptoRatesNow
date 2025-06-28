import { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "./App.css";

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=true";

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setCoins(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCoins(); // fetch immediately

    const interval = setInterval(() => {
      fetchCoins();
    }, 30000); // every 30 seconds is better

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="overlay"></div>
      <div className="app">
        <div className="header">
          <h1>Crypto Rates Now</h1>
          <p>
            Welcome to Crypto Rates Now! This is a simple app to check the
            latest cryptocurrency rates.
          </p>
        </div>
        {loading && <p>Loading...</p>}
        {!loading && coins.length === 0 && <p>No data available</p>}
        <div className="coins">
          <ul>
            {coins.map((coin, i) => (
              <li key={i}>
                <span className="coin">
                  <img src={coin.image} alt={`${coin.name} logo`} />
                  <p>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </p>
                </span>
                <div className="price-data">
                  <p>${coin.current_price.toLocaleString()}</p>

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
                      style={{ fill: "none", strokeWidth: 2 }}
                    />
                  </Sparklines>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
