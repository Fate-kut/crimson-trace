import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const assets = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 118842.40, change: 2.84, icon: '₿' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 4318.72, change: 1.62, icon: 'Ξ' },
  { symbol: 'AAPL', name: 'Apple', price: 229.14, change: -0.38, icon: 'A' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 182.67, change: 3.21, icon: 'N' },
  { symbol: 'TSLA', name: 'Tesla', price: 341.09, change: -1.15, icon: 'T' },
];

const initialOrders = [
  { id: 'CT-1003', symbol: 'BTC/USD', side: 'BUY', units: 0.00841, value: 1000, status: 'Filled', time: '12:42' },
  { id: 'CT-1002', symbol: 'NVDA', side: 'BUY', units: 2.737, value: 500, status: 'Filled', time: '11:18' },
  { id: 'CT-1001', symbol: 'TSLA', side: 'SELL', units: 0.733, value: 250, status: 'Filled', time: 'Yesterday' },
];

function Chart({ asset }) {
  const seed = asset.symbol.length * 9;
  const points = Array.from({ length: 42 }, (_, i) => {
    const wave = Math.sin((i + seed) * 0.65) * 13;
    const trend = (41 - i) * 1.7;
    return `${i * 21.95},${80 + wave + trend}`;
  }).join(' ');
  return (
    <div className="chart-wrap">
      <div className="chart-labels"><span>120k</span><span>118k</span><span>116k</span><span>114k</span><span>112k</span></div>
      <svg viewBox="0 0 900 180" preserveAspectRatio="none" className="chart">
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff3b5c" stopOpacity=".25"/><stop offset="100%" stopColor="#ff3b5c" stopOpacity="0"/></linearGradient></defs>
        <polyline points={points} fill="none" stroke="#ff4968" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <polygon points={`${points} 900,180 0,180`} fill="url(#area)" />
      </svg>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(assets[0]);
  const [watchlist, setWatchlist] = useState(assets.slice(0, 4));
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('1000');
  const [tab, setTab] = useState('Dashboard');
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('ct-balance') || 12450.38));
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('ct-orders') || 'null') || initialOrders);
  const [notice, setNotice] = useState('');

  useEffect(() => localStorage.setItem('ct-balance', balance), [balance]);
  useEffect(() => localStorage.setItem('ct-orders', JSON.stringify(orders)), [orders]);

  const equity = balance + 842.19;
  const openPositions = Math.max(0, orders.filter(o => o.status === 'Filled').length + 4);
  const units = Number(amount || 0) / selected.price;
  const watched = watchlist.some(a => a.symbol === selected.symbol);

  const trade = () => {
    const value = Number(amount);
    if (!value || value <= 0) return setNotice('Enter a valid amount.');
    if (side === 'buy' && value > balance) return setNotice('Insufficient demo buying power.');
    const order = { id: `CT-${1004 + orders.length}`, symbol: selected.symbol, side: side.toUpperCase(), units, value, status: 'Filled', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setBalance(b => side === 'buy' ? b - value : b + value);
    setOrders(o => [order, ...o].slice(0, 12));
    setNotice(`${side === 'buy' ? 'Buy' : 'Sell'} simulated for $${value.toLocaleString()}.`);
  };

  const addFunds = () => {
    setBalance(b => b + 1000);
    setNotice('$1,000 virtual funds added.');
  };

  const toggleWatch = () => setWatchlist(current => watched ? current.filter(a => a.symbol !== selected.symbol) : [...current, selected]);

  const navContent = useMemo(() => ({
    Dashboard: 'Dashboard', Markets: 'Markets', Watchlist: 'Watchlist', Portfolio: 'Portfolio', Orders: 'Orders', Analytics: 'Analytics'
  }[tab] || 'Dashboard'), [tab]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">C</span><span>CRIMSON<br/><b>TRACE</b></span></div>
        <nav>{['Dashboard', 'Markets', 'Watchlist', 'Portfolio', 'Orders', 'Analytics'].map((item, i) => (
          <button key={item} className={tab === item ? 'nav-item active' : 'nav-item'} onClick={() => setTab(item)}><span className="nav-icon">{['⌂','◫','☆','◒','↕','◔'][i]}</span>{item}</button>
        ))}</nav>
        <div className="sidebar-bottom"><button className="nav-item"><span className="nav-icon">⚙</span>Settings</button><div className="account"><div className="avatar">FT</div><div><strong>Demo Trader</strong><small>Paper account</small></div></div></div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="search">⌕ <span>Search markets</span><kbd>Ctrl K</kbd></div><div className="top-actions"><button>◌</button><button>▣</button><div className="market-status"><i/>Market data simulated</div></div></header>
        <section className="content">
          <div className="welcome"><div><p className="eyebrow">PAPER TRADING · CRIMSON TRACE</p><h1>{navContent}</h1><p className="muted">Practice with virtual funds. No real trades are sent to a broker.</p></div><button className="add-funds" onClick={addFunds}>＋ Add virtual funds</button></div>

          {notice && <button className="notice" onClick={() => setNotice('')}>{notice} ×</button>}

          <div className="stats-grid">
            <div className="stat-card"><span>Portfolio value</span><strong>${equity.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><em className="positive">+$842.19 <small>+6.77%</small></em></div>
            <div className="stat-card"><span>Buying power</span><strong>${balance.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><em>Virtual funds</em></div>
            <div className="stat-card"><span>Open positions</span><strong>{openPositions}</strong><em className="positive">Demo portfolio</em></div>
            <div className="stat-card"><span>Today's P&amp;L</span><strong className="positive">+$284.61</strong><em className="positive">+2.31%</em></div>
          </div>

          <div className="grid-main">
            <section className="panel chart-panel">
              <div className="panel-head"><div className="asset-title"><span className="asset-icon">{selected.icon}</span><div><h2>{selected.symbol}</h2><p>{selected.name} · Market</p></div></div><div className="price-block"><strong>${selected.price.toLocaleString(undefined,{minimumFractionDigits:2})}</strong><span className={selected.change >= 0 ? 'positive' : 'negative'}>{selected.change >= 0 ? '+' : ''}{selected.change}%</span></div></div>
              <div className="chart-tabs"><div>{['1H','4H','1D','1W','1M','1Y'].map((t,i)=><button className={i===2?'selected':''} key={t}>{t}</button>)}</div><button onClick={toggleWatch}>{watched ? '★ Watching' : '☆ Watch'}</button></div>
              <Chart asset={selected} />
              <div className="chart-footer"><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span><span>04:00</span><span>08:00</span></div>
            </section>

            <section className="panel order-panel">
              <div className="order-tabs"><button className={side==='buy'?'active-buy':''} onClick={()=>setSide('buy')}>Buy</button><button className={side==='sell'?'active-sell':''} onClick={()=>setSide('sell')}>Sell</button></div>
              <label>Order type</label><div className="select">Market <span>⌄</span></div>
              <label>Amount</label><div className="amount-input"><span>$</span><input inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,''))}/><span>USD</span></div>
              <div className="quick"><button onClick={()=>setAmount('100')}>$100</button><button onClick={()=>setAmount('500')}>$500</button><button onClick={()=>setAmount('1000')}>$1,000</button></div>
              <div className="order-summary"><div><span>Estimated units</span><b>{units.toFixed(5)}</b></div><div><span>Buying power</span><b>${balance.toLocaleString(undefined,{maximumFractionDigits:2})}</b></div><div><span>Fee</span><b>$0.00</b></div></div>
              <button className={side==='buy'?'trade-button buy':'trade-button sell'} onClick={trade}>{side==='buy'?'Buy':'Sell'} {selected.symbol.split('/')[0]}</button>
              <p className="sim-note">Paper trading only · Orders are simulated locally</p>
            </section>
          </div>

          <div className="bottom-grid">
            <section className="panel watch-panel"><div className="section-head"><h2>Watchlist</h2><button onClick={toggleWatch}>{watched ? '− Remove' : '＋ Add'}</button></div><div className="watch-list">{watchlist.map(a=><button className="watch-row" key={a.symbol} onClick={()=>setSelected(a)}><span className="coin">{a.icon}</span><span className="watch-name"><b>{a.symbol}</b><small>{a.name}</small></span><span className="watch-price">${a.price.toLocaleString()}</span><span className={a.change>=0?'positive':'negative'}>{a.change>=0?'+':''}{a.change}%</span></button>)}</div></section>
            <section className="panel activity"><div className="section-head"><h2>Order history</h2><button onClick={()=>setTab('Orders')}>View all →</button></div>{orders.slice(0,4).map(o=><div className="activity-row" key={o.id}><span className="activity-dot"/><div><b>{o.side} {o.symbol}</b><small>{o.time} · {o.units.toFixed(5)} units</small></div><strong>${o.value.toLocaleString()}</strong></div>)}</section>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
