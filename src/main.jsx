import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const assets = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 118842.40, change: 2.84, icon: '₿' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 4318.72, change: 1.62, icon: 'Ξ' },
  { symbol: 'AAPL', name: 'Apple', price: 229.14, change: -0.38, icon: 'A' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 182.67, change: 3.21, icon: 'N' },
  { symbol: 'TSLA', name: 'Tesla', price: 341.09, change: -1.15, icon: 'T' },
];

function Chart() {
  const points = '0,160 25,150 48,158 72,128 96,139 120,112 145,120 170,92 194,108 218,76 242,86 266,59 291,70 316,42 340,55 365,32 390,45 415,20 440,34 465,14 490,25 515,8 540,20 565,2 590,14 615,5 640,12 665,0 690,10 715,3 740,18 765,7 790,24 815,12 840,30 865,17 890,38';
  return (
    <div className="chart-wrap">
      <div className="chart-labels"><span>120k</span><span>118k</span><span>116k</span><span>114k</span><span>112k</span></div>
      <svg viewBox="0 0 900 180" preserveAspectRatio="none" className="chart">
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff3b5c" stopOpacity=".25"/><stop offset="100%" stopColor="#ff3b5c" stopOpacity="0"/></linearGradient></defs>
        <polyline points={points} fill="none" stroke="#ff4968" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <polygon points={`${points} 890,180 0,180`} fill="url(#area)" />
      </svg>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(assets[0]);
  const [watchlist, setWatchlist] = useState(assets.slice(0, 4));
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('1000');
  const [tab, setTab] = useState('Overview');
  const total = 12450.38;
  const equity = useMemo(() => total + 842.19, [total]);

  const toggleWatch = () => {
    setWatchlist((current) => current.some(a => a.symbol === selected.symbol)
      ? current.filter(a => a.symbol !== selected.symbol)
      : [...current, selected]);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">C</span><span>CRIMSON<br/><b>TRACE</b></span></div>
        <nav>
          {['Dashboard', 'Markets', 'Watchlist', 'Portfolio', 'Orders', 'Analytics'].map((item, i) => (
            <button key={item} className={tab === item || (i === 0 && tab === 'Overview') ? 'nav-item active' : 'nav-item'} onClick={() => setTab(item)}>
              <span className="nav-icon">{['⌂','◫','☆','◒','↕','◔'][i]}</span>{item}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><span className="nav-icon">⚙</span>Settings</button><div className="account"><div className="avatar">FT</div><div><strong>Fate</strong><small>Demo account</small></div><span>⋮</span></div></div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="search">⌕ <span>Search markets</span><kbd>⌘ K</kbd></div><div className="top-actions"><button>◌</button><button>▣</button><div className="market-status"><i/>Markets open</div></div></header>

        <section className="content">
          <div className="welcome"><div><p className="eyebrow">TUESDAY, AUGUST 18</p><h1>Good afternoon, Fate.</h1><p className="muted">Here’s what’s happening in your portfolio.</p></div><button className="add-funds">＋ Add virtual funds</button></div>

          <div className="stats-grid">
            <div className="stat-card"><span>Portfolio value</span><strong>${equity.toLocaleString()}</strong><em className="positive">+$842.19 <small>+6.77%</small></em></div>
            <div className="stat-card"><span>Available balance</span><strong>${total.toLocaleString()}</strong><em>Virtual funds</em></div>
            <div className="stat-card"><span>Open positions</span><strong>7</strong><em className="positive">3 profitable</em></div>
            <div className="stat-card"><span>Today's P&amp;L</span><strong className="positive">+$284.61</strong><em className="positive">+2.31%</em></div>
          </div>

          <div className="grid-main">
            <section className="panel chart-panel">
              <div className="panel-head"><div><div className="asset-title"><span className="asset-icon">₿</span><div><h2>{selected.symbol}</h2><p>{selected.name} · Crypto</p></div></div></div><div className="price-block"><strong>${selected.price.toLocaleString(undefined,{minimumFractionDigits:2})}</strong><span className="positive">+2.84%</span></div></div>
              <div className="chart-tabs"><div>{['1H','4H','1D','1W','1M','1Y'].map((t,i)=><button className={i===2?'selected':''} key={t}>{t}</button>)}</div><button>Indicators ⌄</button></div>
              <Chart />
              <div className="chart-footer"><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span><span>04:00</span><span>08:00</span></div>
            </section>

            <section className="panel order-panel">
              <div className="order-tabs"><button className={side==='buy'?'active-buy':''} onClick={()=>setSide('buy')}>Buy</button><button className={side==='sell'?'active-sell':''} onClick={()=>setSide('sell')}>Sell</button></div>
              <label>Order type</label><div className="select">Market <span>⌄</span></div>
              <label>Amount</label><div className="amount-input"><span>$</span><input value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,''))}/><span>USD</span></div>
              <div className="quick"><button onClick={()=>setAmount('100')}>$100</button><button onClick={()=>setAmount('500')}>$500</button><button onClick={()=>setAmount('1000')}>$1,000</button></div>
              <div className="order-summary"><div><span>Estimated units</span><b>{(Number(amount||0)/selected.price).toFixed(5)}</b></div><div><span>Available</span><b>${total.toLocaleString()}</b></div><div><span>Fee</span><b>$0.00</b></div></div>
              <button className={side==='buy'?'trade-button buy':'trade-button sell'} onClick={()=>alert(`${side.toUpperCase()} simulated for $${amount || 0}`)}>{side==='buy'?'Buy':'Sell'} {selected.symbol.split('/')[0]}</button>
              <p className="sim-note">Demo trading · No real money is used</p>
            </section>
          </div>

          <div className="bottom-grid">
            <section className="panel watch-panel"><div className="section-head"><h2>Watchlist</h2><button onClick={toggleWatch}>＋ Add</button></div><div className="watch-list">{watchlist.map(a=><button className="watch-row" key={a.symbol} onClick={()=>setSelected(a)}><span className="coin">{a.icon}</span><span className="watch-name"><b>{a.symbol}</b><small>{a.name}</small></span><span className="watch-price">${a.price.toLocaleString()}</span><span className={a.change>=0?'positive':'negative'}>{a.change>=0?'+':''}{a.change}%</span></button>)}</div></section>
            <section className="panel activity"><div className="section-head"><h2>Recent activity</h2><button>View all →</button></div>{[['BTC/USD','Bought','+$1000.00','12:42'],['NVDA','Bought','+$500.00','11:18'],['TSLA','Sold','-$250.00','Yesterday']].map(([a,b,c,d])=><div className="activity-row" key={d+a}><span className="activity-dot"/><div><b>{b} {a}</b><small>{d}</small></div><strong>{c}</strong></div>)}</section>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
