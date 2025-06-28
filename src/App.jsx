import { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "./App.css";
import Navbar from "./components/Navbar";
import PreLoader from "./components/preLoader"; // Assuming preLoader is a component

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("usd");
  // const [gainers, setGainers] = useState([]);

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
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="jpy">JPY (¥)</option>
              <option value="cny">CNY (¥)</option>
              <option value="inr">INR (₹)</option>
              <option value="aud">AUD ($)</option>
              <option value="cad">CAD ($)</option>
              <option value="chf">CHF (Fr)</option>
              <option value="rub">RUB (₽)</option>
              <option value="brl">BRL (R$)</option>
              <option value="mxn">MXN ($)</option>
              <option value="krw">KRW (₩)</option>
              <option value="zar">ZAR (R)</option>
              <option value="try">TRY (₺)</option>
              <option value="sar">SAR (﷼)</option>
              <option value="aed">AED (د.إ)</option>
              <option value="ils">ILS (₪)</option>
              <option value="kwd">KWD (د.ك)</option>
              <option value="qar">QAR (﷼)</option>
              <option value="ngn">NGN (₦)</option>
              <option value="egp">EGP (£)</option>
              <option value="kes">KES (Sh)</option>
              <option value="ghs">GHS (₵)</option>
              <option value="etb">ETB (Br)</option>
              <option value="mad">MAD (د.م.)</option>
              <option value="tnd">TND (د.ت)</option>
              <option value="bdt">BDT (৳)</option>
              <option value="pkr">PKR (₨)</option>
              <option value="vnd">VND (₫)</option>
              <option value="thb">THB (฿)</option>
              <option value="myr">MYR (RM)</option>
              <option value="idr">IDR (Rp)</option>
              <option value="lkr">LKR (Rs)</option>
              <option value="npr">NPR (₨)</option>
              <option value="sek">SEK (kr)</option>
              <option value="nok">NOK (kr)</option>
              <option value="dkk">DKK (kr)</option>
              <option value="pln">PLN (zł)</option>
              <option value="huf">HUF (Ft)</option>
              <option value="czk">CZK (Kč)</option>
              <option value="ars">ARS ($)</option>
              <option value="cop">COP ($)</option>
              <option value="clp">CLP ($)</option>
              <option value="pen">PEN (S/)</option>
              <option value="uyu">UYU ($U)</option>
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
                      <div className="gainerandloser">
                        <p>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency.toUpperCase(),
                          }).format(coin.current_price)}
                        </p>
                        <p
                          style={{
                            color:
                              coin.price_change_percentage_24h >= 0
                                ? "#7CFC00"
                                : "#FF6B6B",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                            marginTop: "0.3em",
                          }}
                        >
                          {coin.price_change_percentage_24h >= 0 ? "⬆️" : "⬇️"}{" "}
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </p>
                      </div>
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
