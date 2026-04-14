import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// TripHack — Premium travel points optimizer
// Apple/Tesla aesthetic + Hormozi offer framing
// Target: People who don't know what points are
// ═══════════════════════════════════════════════════════════════════

// ── Data ──
const DEST_DB=[
  {keys:['tokyo','japan','narita','haneda','osaka','kyoto'],airline:'ANA',code:'NH',color:'#003087',cabin:'Business',route:'Chase UR → ANA Miles',hotels:{budget:{n:'Dormy Inn Asakusa',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Tokyo',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Westin Tokyo',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Tokyo',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['paris','france','cdg'],airline:'Air France',code:'AF',color:'#002157',cabin:'Business',route:'Chase UR → Flying Blue',hotels:{budget:{n:'Ibis Paris',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Paris Opéra',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Paris Marriott Opéra',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Le Bristol Paris',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['london','heathrow','gatwick','england','uk'],airline:'British Airways',code:'BA',color:'#2b5be8',cabin:'Club World',route:'Chase UR → Avios',hotels:{budget:{n:'Ibis London',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton London Bankside',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'London Marriott County Hall',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Hyatt Regency London',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['rome','italy','milan','florence','venice'],airline:'Air France',code:'AF',color:'#002157',cabin:'Business',route:'Amex MR → Flying Blue',hotels:{budget:{n:'Ibis Roma',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Rome',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Marriott Grand Flora',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Milano',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 6'}}},
  {keys:['maldives','male'],airline:'Emirates',code:'EK',color:'#c8102e',cabin:'Business',route:'Amex → Emirates Skywards',hotels:{budget:{n:'Kuredu Island',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Maldives',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Sheraton Maldives',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Maldives',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['bali','indonesia','ubud'],airline:'Singapore Airlines',code:'SQ',color:'#00629b',cabin:'Business',route:'Chase UR → KrisFlyer',hotels:{budget:{n:'Ibis Bali',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Bali',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'W Bali Seminyak',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Four Seasons Sayan',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 6'}}},
  {keys:['hawaii','honolulu','maui'],airline:'United',code:'UA',color:'#0033a0',cabin:'Business',route:'Chase UR → MileagePlus',hotels:{budget:{n:'Hilton Garden Waikiki',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Hawaiian Village',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Westin Maui',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Maui',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['dubai','uae'],airline:'Emirates',code:'EK',color:'#c8102e',cabin:'Business',route:'Amex → Emirates Skywards',hotels:{budget:{n:'Premier Inn Dubai',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Dubai Creek',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'W Dubai',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Dubai',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['cancun','mexico','tulum'],airline:'United',code:'UA',color:'#0033a0',cabin:'Business',route:'Chase UR → United',hotels:{budget:{n:'Ibis Cancun',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Cancun',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Marriott Cancun',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Hyatt Zilara Cancun',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['bangkok','thailand','phuket'],airline:'Thai Airways',code:'TG',color:'#6d2b8c',cabin:'Business',route:'Chase UR → United',hotels:{budget:{n:'Ibis Bangkok',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Bangkok',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Bangkok Marriott',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Bangkok',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['singapore','changi'],airline:'Singapore Airlines',code:'SQ',color:'#00629b',cabin:'Business Suites',route:'Chase UR → KrisFlyer',hotels:{budget:{n:'Ibis Singapore',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Singapore',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Marriott Tang Plaza',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Singapore',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['new york','nyc','manhattan'],airline:'Delta',code:'DL',color:'#e31837',cabin:'Business',route:'Amex → Delta SkyMiles',hotels:{budget:{n:'Hilton Garden Midtown',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Midtown',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'NY Marriott Marquis',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt New York',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
  {keys:['sydney','australia','melbourne'],airline:'Qantas',code:'QF',color:'#e40000',cabin:'Business',route:'Amex → Qantas Points',hotels:{budget:{n:'Ibis Sydney',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton Sydney',c:'#1e8449',code:'HLT',tier:'Hilton Honors'},upscale:{n:'Sydney Marriott',c:'#c0392b',code:'MAR',tier:'Marriott Bonvoy'},luxury:{n:'Park Hyatt Sydney',c:'#1a5276',code:'HYT',tier:'Hyatt Cat 7'}}},
];

const DEST_IMAGES={paris:'photo-1499856871958-5b9627545d1a',tokyo:'photo-1540959733332-eab4deabeeaf',london:'photo-1513635269975-59663e0ac1ad',maldives:'photo-1514282401047-d79a71a590e8',bali:'photo-1537996194471-e657df975ab4',rome:'photo-1552832230-c0197dd311b5',hawaii:'photo-1505852679233-d9fd70aff56d',dubai:'photo-1512453979798-5ea266f8880c',cancun:'photo-1552537376-3abf35237215',bangkok:'photo-1508009603885-50cf7c579365',singapore:'photo-1525625293386-3f8f99389edd','new york':'photo-1496442226666-8d4d0e62e6e9',sydney:'photo-1506973035872-a4ec16b8e8d9'};

const VIBES={tokyo:'ANA business class. Widely considered the best in the sky.',paris:'Air France business. It feels like Paris before you land.',london:'BA Club World. Flat bed, champagne, smoked salmon.',maldives:'Emirates business to paradise. The shower spa alone is worth it.',bali:'Singapore Airlines. Consistently rated the world\'s best.',dubai:'Emirates business. The bar, the suite, the shower.',hawaii:'Direct from the mainland. Easiest award redemption there is.',cancun:'United direct. Easy availability, great Chase value.',bangkok:'Thai Airways business. Generous, comfortable, underrated.',singapore:'SQ Suites. Most private business seat ever built.','new york':'Delta One. Lie-flat, direct, Amex transfers straight in.',sydney:'Qantas business. Australia\'s finest.'};

const FLIGHT_PTS = {economy:45000,'premium economy':60000,business:87500,'first class':140000};
const HOTEL_PTS = {budget:8000,'mid-range':15000,upscale:25000,luxury:40000};

const CARDS = [
  {name:'Chase Sapphire Preferred',bank:'Chase',bonus:75000,minSpend:5000,fee:95,mults:{groceries:3,dining:3,gas:2,streaming:3,other:1},color:'#1a1f71'},
  {name:'Chase Sapphire Reserve',bank:'Chase',bonus:125000,minSpend:6000,fee:795,mults:{groceries:3,dining:3,gas:2,streaming:3,other:1},color:'#0a0f3d'},
  {name:'Amex Platinum',bank:'Amex',bonus:175000,minSpend:12000,fee:895,mults:{groceries:1,dining:1,gas:1,streaming:1,other:1},color:'#007dc5'},
  {name:'Amex Gold',bank:'Amex',bonus:100000,minSpend:6000,fee:325,mults:{groceries:4,dining:4,gas:1,streaming:1,other:1},color:'#b8860b'},
  {name:'Capital One Venture X',bank:'Capital One',bonus:75000,minSpend:4000,fee:395,mults:{groceries:2,dining:2,gas:2,streaming:2,other:2},color:'#003580'},
];

const CATS = [{key:'groceries',label:'Groceries',w:.30},{key:'dining',label:'Dining',w:.22},{key:'gas',label:'Gas & transit',w:.12},{key:'streaming',label:'Streaming',w:.08},{key:'other',label:'Everything else',w:.28}];
const SPEND_MAP = {'Under $1k':700,'$1k–$2.5k':1800,'$2.5k–$5k':3500,'$5k+':6000};

const INSPIRE = [
  {dest:'Tokyo',sub:'Neon, ramen, bullet trains'},
  {dest:'Paris',sub:'Art, croissants, the Seine'},
  {dest:'Bali',sub:'Rice terraces, jungle villas'},
  {dest:'Maldives',sub:'Overwater bungalows'},
  {dest:'Hawaii',sub:'Volcanoes, surf, aloha'},
  {dest:'London',sub:'History, theatre, pubs'},
];

// ── Helpers ──
const cap = s => s ? s.split(' ').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ') : '';
const getDest = d => { const l=d.toLowerCase(); for(const e of DEST_DB) for(const k of e.keys) if(l.includes(k)) return e; return {airline:'Your airline',code:'AIR',color:'#555',cabin:'Business',route:'via transfer partner',hotels:{budget:{n:'Budget Hotel',c:'#888',code:'HTL',tier:'Budget'},'mid-range':{n:'Hilton '+d,c:'#1e8449',code:'HLT',tier:'Hilton'},upscale:{n:'Marriott '+d,c:'#c0392b',code:'MAR',tier:'Marriott'},luxury:{n:'Park Hyatt '+d,c:'#1a5276',code:'HYT',tier:'Hyatt'}}}; };
const getImg = d => { const l=d.toLowerCase(); for(const k in DEST_IMAGES) if(l.includes(k)) return `https://images.unsplash.com/${DEST_IMAGES[k]}?auto=format&fit=crop&w=900&q=80`; return `https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80`; };
const getVibe = d => { const l=d.toLowerCase(); for(const k in VIBES) if(l.includes(k)) return VIBES[k]; return 'Business class on points. Same seat, fraction of the price.'; };

function bestCard(totalPts, mo) {
  let best=CARDS[0], bestMo=Infinity;
  for(const c of CARDS) {
    let ppm=0; CATS.forEach(cat=>{ ppm+=Math.round(mo*cat.w*(c.mults[cat.key]||1)); });
    const msm=c.minSpend>0?Math.ceil(c.minSpend/mo):0;
    const earned=ppm*msm;
    const rem=Math.max(0,totalPts-(c.bonus||0)-earned);
    const months=msm+(rem>0&&ppm>0?Math.ceil(rem/ppm):0);
    if(months<bestMo){bestMo=months;best=c;}
  }
  return best;
}

// ── Styles ──
const FONT_URL = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap";

const css = `

*{box-sizing:border-box;margin:0;padding:0;}

:root{
  --bg:#09090b;--bg2:#18181b;--bg3:#27272a;
  --card:#18181b;--card2:#1f1f23;
  --text:#fafafa;--text2:#a1a1aa;--text3:#71717a;
  --green:#22c55e;--green2:#16a34a;--green-glow:rgba(34,197,94,0.15);
  --amber:#f59e0b;
  --red:#ef4444;
  --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.1);
  --font:'Outfit',sans-serif;
  --display:'Fraunces','Georgia',serif;
  --radius:16px;--radius-sm:12px;--radius-xs:8px;
}

html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}

.app{max-width:480px;margin:0 auto;padding:0 20px 60px;min-height:100vh;position:relative;}
@media(min-width:640px){.app{max-width:520px;padding:0 24px 80px;}}

/* Glow orb */
.orb{position:fixed;top:-200px;left:50%;transform:translateX(-50%);width:600px;height:600px;
  background:radial-gradient(circle,rgba(34,197,94,0.06) 0%,transparent 70%);pointer-events:none;z-index:0;}

/* Animations */
@keyframes up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(34,197,94,0.1)}50%{box-shadow:0 0 40px rgba(34,197,94,0.2)}}
@keyframes count{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}

.animate-up{animation:up .5s cubic-bezier(.16,1,.3,1) both;}
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}
.d5{animation-delay:.25s}.d6{animation-delay:.3s}.d7{animation-delay:.35s}.d8{animation-delay:.4s}

/* Progress */
.progress{height:2px;background:var(--border);border-radius:2px;overflow:hidden;margin:16px 0;}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--green2),var(--green));border-radius:2px;transition:width .6s cubic-bezier(.4,0,.2,1);}

/* Typography */
.hero-text{font-family:var(--display);font-weight:300;font-size:clamp(32px,8vw,44px);line-height:1.1;letter-spacing:-0.02em;color:var(--text);}
.hero-text .accent{color:var(--green);}
.heading{font-family:var(--display);font-weight:400;font-size:22px;line-height:1.2;letter-spacing:-0.01em;}
.subhead{font-size:15px;color:var(--text2);line-height:1.7;font-weight:300;}
.label{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);}
.caption{font-size:12px;color:var(--text3);line-height:1.5;}

/* Inputs */
.input{
  width:100%;padding:16px 18px;font-size:16px;font-family:var(--font);font-weight:400;
  background:var(--card);border:1px solid var(--border2);border-radius:var(--radius-sm);
  color:var(--text);outline:none;transition:all .2s;
  -webkit-appearance:none;
}
.input:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-glow);}
.input::placeholder{color:var(--text3);}

/* Buttons */
.btn{
  width:100%;padding:18px;font-size:16px;font-weight:600;font-family:var(--font);
  border:none;border-radius:var(--radius-sm);cursor:pointer;
  transition:all .2s cubic-bezier(.16,1,.3,1);
  -webkit-tap-highlight-color:transparent;position:relative;overflow:hidden;
}
.btn-primary{
  background:var(--green);color:#000;
  box-shadow:0 0 20px var(--green-glow),0 2px 8px rgba(0,0,0,.3);
}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 30px rgba(34,197,94,0.25),0 8px 24px rgba(0,0,0,.4);}
.btn-primary:active{transform:translateY(0);}
.btn-primary:disabled{opacity:.3;cursor:default;transform:none;box-shadow:none;}

.btn-dark{background:var(--card2);color:var(--text);border:1px solid var(--border2);}
.btn-dark:hover{background:var(--bg3);border-color:rgba(255,255,255,0.15);}
.btn-dark.selected{background:var(--green);color:#000;border-color:var(--green);}

.btn-ghost{background:transparent;color:var(--text3);font-size:14px;padding:12px;}
.btn-ghost:hover{color:var(--text2);}

.back-btn{background:none;border:none;color:var(--text3);font-size:13px;cursor:pointer;
  font-family:var(--font);display:flex;align-items:center;gap:4px;padding:0;transition:color .15s;}
.back-btn:hover{color:var(--text);}

/* Pills */
.pill{
  padding:12px 22px;border-radius:100px;font-size:14px;font-weight:500;
  background:var(--card);border:1px solid var(--border2);color:var(--text);
  cursor:pointer;transition:all .2s;user-select:none;-webkit-tap-highlight-color:transparent;
  white-space:nowrap;
}
.pill:hover{border-color:var(--green);color:var(--green);}
.pill.sel{background:var(--green);border-color:var(--green);color:#000;font-weight:600;
  box-shadow:0 0 16px var(--green-glow);}

/* Toggle */
.toggle{display:flex;background:var(--card);border:1px solid var(--border2);border-radius:var(--radius-sm);overflow:hidden;}
.toggle-opt{
  flex:1;padding:14px 8px;font-size:13px;font-weight:500;text-align:center;
  cursor:pointer;color:var(--text3);background:transparent;border:none;
  font-family:var(--font);transition:all .15s;-webkit-tap-highlight-color:transparent;
}
.toggle-opt.sel{background:var(--green);color:#000;font-weight:600;}

/* Counter */
.counter{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;
  background:var(--card);border:1px solid var(--border2);border-radius:var(--radius-sm);}
.counter-btn{
  width:36px;height:36px;border-radius:50%;background:var(--bg3);border:1px solid var(--border2);
  color:var(--text);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all .15s;-webkit-tap-highlight-color:transparent;
}
.counter-btn:hover:not(:disabled){background:var(--green);color:#000;border-color:var(--green);}
.counter-btn:disabled{opacity:.2;cursor:default;}

/* Card */
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}

/* Choice card */
.choice{
  padding:20px;border-radius:var(--radius-sm);border:1px solid var(--border2);
  background:var(--card);cursor:pointer;text-align:left;transition:all .2s;
  -webkit-tap-highlight-color:transparent;display:flex;gap:16px;align-items:center;
}
.choice:hover{border-color:rgba(255,255,255,0.2);}
.choice.selected{border-color:var(--green);background:rgba(34,197,94,0.05);}

/* Balance row */
.bal-row{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid var(--border);}
.bal-row:last-child{border-bottom:none;}
.bal-logo{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;flex-shrink:0;color:#fff;letter-spacing:.02em;}
.bal-input{
  width:100px;padding:10px 12px;font-size:14px;background:var(--bg);border:1px solid var(--border2);
  border-radius:var(--radius-xs);color:var(--text);text-align:right;font-family:var(--font);
  outline:none;transition:border-color .15s;
}
.bal-input:focus{border-color:var(--green);}

/* Value stack */
.value-stack{background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.02));
  border:1px solid rgba(34,197,94,0.15);border-radius:var(--radius);padding:20px;margin:8px 0;}

/* Error */
.error{padding:12px 16px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);
  border-radius:var(--radius-xs);font-size:14px;color:var(--red);line-height:1.5;}

/* Route pill */
.route-pill{display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px;padding:10px 18px;
  border-radius:100px;background:var(--card);border:1px solid var(--border);
  font-size:12px;color:var(--text2);}
.route-pill b{color:var(--text);font-weight:600;}

/* Spend table */
.spend-table{width:100%;border-collapse:collapse;}
.spend-table th{font-size:10px;color:var(--text3);font-weight:600;padding:0 0 8px;text-align:left;
  letter-spacing:.08em;text-transform:uppercase;}
.spend-table th:last-child,.spend-table td:last-child{text-align:right;}
.spend-table td{font-size:13px;color:var(--text);padding:10px 0;border-top:1px solid var(--border);}

/* Responsive */
@media(max-width:380px){
  .hero-text{font-size:28px;}
  .pill{padding:10px 16px;font-size:13px;}
}
`;

// ── Components ──
const Nav = ({step, total, onBack, label}) => (
  <div className="animate-up">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
      {onBack ? <button className="back-btn" onClick={onBack}>← Back</button> : <span/>}
      <span className="label">{label || `Step ${step} of ${total}`}</span>
    </div>
    <div className="progress"><div className="progress-fill" style={{width:`${(step/total)*100}%`}}/></div>
  </div>
);

const RoutePill = ({origin, dest, adults, children, booking, dates}) => {
  const trav = adults+children === 1 ? '1 traveler' : `${adults+children} travelers`;
  const book = booking==='flight'?'Flight':booking==='hotel'?'Hotel':'Flight + Hotel';
  return <div className="route-pill"><b>{origin}</b> → <b>{dest}</b> · {trav} · {book}</div>;
};

export default function TripHack() {
  const [screen, setScreen] = useState('hero');
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [booking, setBooking] = useState('flight');
  const [cabin, setCabin] = useState('');
  const [hotel, setHotel] = useState('');
  const [nights, setNights] = useState(5);
  const [hasCards, setHasCards] = useState(null);
  const [balances, setBalances] = useState({});
  const [spend, setSpend] = useState('');
  const [error, setError] = useState('');
  const [thinkStep, setThinkStep] = useState(0);
  const [email, setEmail] = useState('');
  const [timeline, setTimeline] = useState('');

  // Load fonts
  useEffect(() => {
    if (!document.querySelector('link[data-triphack-fonts]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_URL;
      link.setAttribute('data-triphack-fonts', '1');
      document.head.appendChild(link);
    }
  }, []);

  const goTo = useCallback((s) => {
    setError('');
    setScreen(s);
    try { window.scrollTo({top:0,behavior:'smooth'}); } catch(e) {}
  },[]);

  // thinking animation
  useEffect(()=>{
    if(screen!=='thinking') return;
    setThinkStep(0);
    const timers = [
      setTimeout(()=>setThinkStep(1),600),
      setTimeout(()=>setThinkStep(2),1200),
      setTimeout(()=>setThinkStep(3),1800),
      setTimeout(()=>goTo('results'),2400),
    ];
    return ()=>timers.forEach(clearTimeout);
  },[screen,goTo]);

  // calculations
  const mo = SPEND_MAP[spend]||1800;
  const fp = (FLIGHT_PTS[cabin]||87500)*adults;
  const hp = booking==='flight'?0:(HOTEL_PTS[hotel]||25000)*nights;
  const totalPts = fp+hp;
  const bestBal = Math.max(...Object.values(balances).map(v=>parseInt(v)||0),0);
  const gap = Math.max(0, totalPts-bestBal);
  const card = bestCard(totalPts, mo);
  let ptsPerMo = 0;
  CATS.forEach(c=>{ ptsPerMo += Math.round(mo*c.w*(card.mults[c.key]||1)); });
  const msm = card.minSpend>0?Math.ceil(card.minSpend/mo):0;
  const earned = ptsPerMo*msm;
  const rem = Math.max(0,(hasCards?gap:totalPts)-(card.bonus||0)-earned);
  const months = Math.max(1, msm+(rem>0&&ptsPerMo>0?Math.ceil(rem/ptsPerMo):0));
  const cashVal = Math.round(fp*0.022 + (booking!=='flight'?hp*0.016:0));
  const di = getDest(dest||'paris');
  const destName = cap(dest||'your destination');

  // ── HERO ──
  if(screen==='hero') return (
    <div className="app" key="hero">
      <style>{css}</style>
      <div className="orb"/>
      <div style={{paddingTop:'clamp(60px,15vh,100px)'}}>
        <div className="animate-up" style={{marginBottom:8}}>
          <span className="label" style={{color:'var(--green)',letterSpacing:'.2em'}}>TRIPHACK</span>
        </div>

        <h1 className="hero-text animate-up d1">
          Your next vacation<br/>could cost <span className="accent">$0.</span>
        </h1>

        <p className="subhead animate-up d2" style={{marginTop:20,maxWidth:380}}>
          The money you already spend on groceries, gas, and dining is quietly earning you free flights and hotels. Most people just don't know how to use it.
        </p>

        <p className="subhead animate-up d3" style={{marginTop:12,maxWidth:380}}>
          Tell us where you want to go. We'll show you exactly how to get there without spending an extra dime.
        </p>

        {/* Value stack - Hormozi style */}
        <div className="value-stack animate-up d4" style={{marginTop:28}}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {[
              ['Your personalized points plan','$297 value'],
              ['Card-by-card spending strategy','$197 value'],
              ['Transfer partner cheat sheet','$97 value'],
              ['Monthly earn timeline','$97 value'],
            ].map(([item,val],i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{color:'var(--green)',fontSize:14}}>✓</span>
                  <span style={{fontSize:14,color:'var(--text)'}}>{item}</span>
                </div>
                <span style={{fontSize:12,color:'var(--text3)',textDecoration:'line-through'}}>{val}</span>
              </div>
            ))}
            <div style={{height:1,background:'var(--border)',margin:'4px 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:16,fontWeight:600,color:'var(--text)'}}>Total value</span>
              <div style={{textAlign:'right'}}>
                <span style={{fontSize:14,color:'var(--text3)',textDecoration:'line-through',marginRight:8}}>$688</span>
                <span style={{fontSize:20,fontWeight:700,color:'var(--green)'}}>FREE</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary animate-up d5" onClick={()=>goTo('s1')} style={{marginTop:24}}>
          Show me my free trip →
        </button>
        <p className="caption animate-up d6" style={{textAlign:'center',marginTop:12}}>
          Free forever · 2 minutes · No credit card needed
        </p>

        {/* Social proof */}
        <div className="animate-up d7" style={{marginTop:40,display:'flex',flexDirection:'column',gap:12}}>
          {[
            {n:'Sarah K.',t:'Booked Tokyo business class. Would have cost $8,400.',s:'3 months'},
            {n:'Marcus T.',t:'Round trip to Bali for the whole family. $0 out of pocket.',s:'5 months'},
          ].map((r,i)=>(
            <div key={i} style={{padding:16,background:'var(--card)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{r.n}</span>
                <span style={{fontSize:11,color:'var(--green)',fontWeight:500}}>{r.s}</span>
              </div>
              <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.5,margin:0}}>{r.t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── S1: Destination ──
  if(screen==='s1') return (
    <div className="app" key="s1"><style>{css}</style><div className="orb"/>
      <div style={{paddingTop:32}}>
        <Nav step={1} total={5}/>
        <h2 className="heading animate-up d1" style={{marginTop:8}}>Where do you want to wake up?</h2>
        <p className="subhead animate-up d2" style={{marginTop:8}}>Pick a dream. We'll reverse-engineer how your everyday spending gets you there.</p>

        <div className="animate-up d3" style={{display:'flex',flexDirection:'column',gap:12,marginTop:24}}>
          <div style={{display:'flex',gap:10}}>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              <span className="label">Flying from</span>
              <input className="input" value={origin} onChange={e=>setOrigin(e.target.value)} placeholder="City or airport"/>
            </div>
            <div style={{color:'var(--text3)',paddingTop:28,fontSize:18,flexShrink:0}}>→</div>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              <span className="label">Flying to</span>
              <input className="input" value={dest} onChange={e=>setDest(e.target.value)} placeholder="City or airport"/>
            </div>
          </div>
        </div>

        <div className="animate-up d4" style={{marginTop:24}}>
          <span className="label" style={{marginBottom:10,display:'block'}}>Or pick a dream</span>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            {INSPIRE.map(d=>(
              <button key={d.dest} onClick={()=>{setDest(d.dest);}} className="btn btn-dark"
                style={{padding:'14px 8px',fontSize:13,display:'flex',flexDirection:'column',alignItems:'center',gap:2,
                  ...(dest===d.dest?{background:'var(--green)',color:'#000',borderColor:'var(--green)'}:{})
                }}>
                <span style={{fontWeight:600}}>{d.dest}</span>
                <span style={{fontSize:10,opacity:.6}}>{d.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-up d5" style={{marginTop:24}}>
          <span className="label" style={{marginBottom:10,display:'block'}}>Travelers</span>
          <div style={{display:'flex',gap:10}}>
            <div className="counter" style={{flex:1}}>
              <div><div style={{fontSize:14,fontWeight:600}}>Adults</div><div className="caption">18+</div></div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button className="counter-btn" disabled={adults<=1} onClick={()=>setAdults(a=>Math.max(1,a-1))}>−</button>
                <span style={{fontSize:16,fontWeight:600,minWidth:20,textAlign:'center'}}>{adults}</span>
                <button className="counter-btn" onClick={()=>setAdults(a=>a+1)}>+</button>
              </div>
            </div>
            <div className="counter" style={{flex:1}}>
              <div><div style={{fontSize:14,fontWeight:600}}>Kids</div><div className="caption">Under 18</div></div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button className="counter-btn" disabled={children<=0} onClick={()=>setChildren(c=>Math.max(0,c-1))}>−</button>
                <span style={{fontSize:16,fontWeight:600,minWidth:20,textAlign:'center'}}>{children}</span>
                <button className="counter-btn" onClick={()=>setChildren(c=>c+1)}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-up d6" style={{marginTop:20}}>
          <span className="label" style={{marginBottom:10,display:'block'}}>What do you need?</span>
          <div className="toggle">
            {['flight','both','hotel'].map(t=>(
              <button key={t} className={`toggle-opt${booking===t?' sel':''}`}
                onClick={()=>setBooking(t)}>
                {t==='flight'?'Flight only':t==='both'?'Flight + Hotel':'Hotel only'}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error animate-up">{error}</div>}
        <button className="btn btn-primary animate-up d7" style={{marginTop:24}}
          onClick={()=>{
            if(!origin.trim()){setError('Where are you flying from?');return;}
            if(!dest.trim()){setError('Where do you want to go?');return;}
            goTo('s2');
          }}>Continue →</button>
        <p className="caption animate-up d8" style={{textAlign:'center',marginTop:10}}>No account needed · Free</p>
      </div>
    </div>
  );

  // ── S2: Cabin & Hotel ──
  if(screen==='s2') return (
    <div className="app" key="s2"><style>{css}</style><div className="orb"/>
      <div style={{paddingTop:32}}>
        <Nav step={2} total={5} onBack={()=>goTo('s1')}/>
        <RoutePill origin={origin} dest={dest} adults={adults} children={children} booking={booking}/>

        {(booking==='flight'||booking==='both') && (
          <div className="animate-up d1" style={{marginTop:20}}>
            <h2 className="heading">How do you want to fly?</h2>
            <p className="caption" style={{marginTop:6,marginBottom:14}}>Business class is where the real value is. A $9,000 seat for free? That's the hack.</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {['Economy','Premium economy','Business','First class'].map(c=>(
                <button key={c} className={`pill${cabin===c.toLowerCase()?' sel':''}`}
                  onClick={()=>setCabin(c.toLowerCase())}>{c}</button>
              ))}
            </div>
          </div>
        )}

        {(booking==='hotel'||booking==='both') && (
          <div className="animate-up d2" style={{marginTop:24}}>
            <h2 className="heading">Hotel tier?</h2>
            <p className="caption" style={{marginTop:6,marginBottom:14}}>Points hotels: Hyatt, Marriott, Hilton. We'll match to your programs.</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {['Budget','Mid-range','Upscale','Luxury'].map(h=>(
                <button key={h} className={`pill${hotel===h.toLowerCase()?' sel':''}`}
                  onClick={()=>setHotel(h.toLowerCase())}>{h}</button>
              ))}
            </div>
            <div className="counter animate-up d3" style={{marginTop:16}}>
              <div><div style={{fontSize:14,fontWeight:600}}>Nights</div></div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button className="counter-btn" disabled={nights<=1} onClick={()=>setNights(n=>Math.max(1,n-1))}>−</button>
                <span style={{fontSize:16,fontWeight:600,minWidth:20,textAlign:'center'}}>{nights}</span>
                <button className="counter-btn" onClick={()=>setNights(n=>n+1)}>+</button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error animate-up">{error}</div>}
        <button className="btn btn-primary animate-up d4" style={{marginTop:24}}
          onClick={()=>{
            if((booking==='flight'||booking==='both')&&!cabin){setError('Pick how you want to fly.');return;}
            if((booking==='hotel'||booking==='both')&&!hotel){setError('Pick a hotel tier.');return;}
            goTo('s3');
          }}>Continue →</button>
      </div>
    </div>
  );

  // ── S3: Has cards? ──
  if(screen==='s3') return (
    <div className="app" key="s3"><style>{css}</style><div className="orb"/>
      <div style={{paddingTop:32}}>
        <Nav step={3} total={5} onBack={()=>goTo('s2')}/>
        <RoutePill origin={origin} dest={dest} adults={adults} children={children} booking={booking}/>
        <h2 className="heading animate-up d1" style={{marginTop:16}}>Do you have any credit cards that earn rewards?</h2>
        <p className="subhead animate-up d2" style={{marginTop:8}}>Think Chase, Amex, Capital One. Any card where you earn "points" or "miles" when you buy stuff. Don't worry if you don't — that's actually the best position to be in.</p>

        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:20}}>
          <button className={`choice animate-up d3${hasCards===true?' selected':''}`} onClick={()=>setHasCards(true)}>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:600}}>Yes, I have rewards cards</div>
              <div className="caption" style={{marginTop:4}}>We'll show how far your current points can take you</div>
            </div>
            {hasCards===true && <span style={{color:'var(--green)',fontSize:20}}>✓</span>}
          </button>
          <button className={`choice animate-up d4${hasCards===false?' selected':''}`} onClick={()=>setHasCards(false)}>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:600}}>Not yet — I'm starting from zero</div>
              <div className="caption" style={{marginTop:4}}>Perfect. We'll find you the exact right card and show you the timeline</div>
            </div>
            {hasCards===false && <span style={{color:'var(--green)',fontSize:20}}>✓</span>}
          </button>
        </div>

        {error && <div className="error animate-up">{error}</div>}
        <button className="btn btn-primary animate-up d5" style={{marginTop:24}}
          onClick={()=>{
            if(hasCards===null){setError('Pick one — no wrong answer here.');return;}
            goTo('s4');
          }}>Continue →</button>
      </div>
    </div>
  );

  // ── S4: Balances + Spend ──
  if(screen==='s4') return (
    <div className="app" key="s4"><style>{css}</style><div className="orb"/>
      <div style={{paddingTop:32}}>
        <Nav step={4} total={5} onBack={()=>goTo('s3')}/>
        <RoutePill origin={origin} dest={dest} adults={adults} children={children} booking={booking}/>

        {hasCards && (
          <>
            <h2 className="heading animate-up d1" style={{marginTop:16}}>Your current points</h2>
            <p className="caption animate-up d2" style={{marginTop:6}}>Enter what you have. Leave blank anything you don't have.</p>
            <div className="card animate-up d3" style={{marginTop:14}}>
              {[
                {id:'chase',label:'Chase (Sapphire / UR)',sub:'Ultimate Rewards',bg:'#1a1f71',ph:'0 pts'},
                {id:'amex',label:'Amex (Gold / Platinum)',sub:'Membership Rewards',bg:'#007dc5',ph:'0 pts'},
                {id:'cap1',label:'Capital One',sub:'Venture Miles',bg:'#003580',ph:'0 pts'},
                {id:'citi',label:'Citi (Premier)',sub:'ThankYou Points',bg:'#003087',ph:'0 pts'},
                {id:'delta',label:'Delta SkyMiles',bg:'#e31837',ph:'0 miles'},
                {id:'united',label:'United MileagePlus',bg:'#0033a0',ph:'0 miles'},
                {id:'hyatt',label:'World of Hyatt',bg:'#1a5276',ph:'0 pts'},
                {id:'marriott',label:'Marriott Bonvoy',bg:'#c0392b',ph:'0 pts'},
                {id:'hilton',label:'Hilton Honors',bg:'#1e8449',ph:'0 pts'},
              ].map(b=>(
                <div className="bal-row" key={b.id}>
                  <div className="bal-logo" style={{background:b.bg}}>{b.id.slice(0,3).toUpperCase()}</div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{b.label}</div>{b.sub&&<div className="caption">{b.sub}</div>}</div>
                  <input className="bal-input" placeholder={b.ph} value={balances[b.id]||''} onChange={e=>setBalances(p=>({...p,[b.id]:e.target.value}))}/>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className={`heading animate-up ${hasCards?'d4':'d1'}`} style={{marginTop:hasCards?24:16}}>
          {hasCards ? 'Monthly spending' : 'How much do you spend per month on everyday stuff?'}
        </h2>
        <p className={`caption animate-up ${hasCards?'d5':'d2'}`} style={{marginTop:6}}>
          Groceries, gas, dining, subscriptions. Money that's leaving your account anyway. This is the fuel that powers your free trip.
        </p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:14}} className={`animate-up ${hasCards?'d6':'d3'}`}>
          {Object.keys(SPEND_MAP).map(s=>(
            <button key={s} className={`pill${spend===s?' sel':''}`} onClick={()=>setSpend(s)}>{s}</button>
          ))}
        </div>

        {error && <div className="error animate-up">{error}</div>}
        <button className={`btn btn-primary animate-up ${hasCards?'d7':'d4'}`} style={{marginTop:24}}
          onClick={()=>{
            if(!spend){setError('Pick your approximate monthly spend.');return;}
            goTo('thinking');
          }}>Build my free trip plan →</button>
      </div>
    </div>
  );

  // ── THINKING ──
  if(screen==='thinking') return (
    <div className="app" key="thinking"><style>{css}</style><div className="orb"/>
      <div style={{paddingTop:32}}>
        <div className="progress"><div className="progress-fill" style={{width:'92%'}}/></div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:32,paddingTop:60}}>
          <div style={{width:56,height:56,position:'relative'}}>
            <svg viewBox="0 0 56 56" fill="none" style={{animation:'spin 2s cubic-bezier(.4,0,.2,1) infinite',width:56,height:56}}>
              <circle cx="28" cy="28" r="24" stroke="var(--border2)" strokeWidth="2.5"/>
              <path d="M28 4a24 24 0 0 1 24 24" stroke="var(--green)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{textAlign:'center'}}>
            <h2 className="heading">Building your {destName} plan...</h2>
            <p className="caption" style={{marginTop:6}}>Crunching the numbers</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:16,width:'100%',maxWidth:320}}>
            {['Checking award availability','Comparing transfer routes','Matching sign-up bonuses'].map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:14,animation:thinkStep>i?'slideIn .3s ease both':'none'}}>
                <div style={{width:22,height:22,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
                  background:thinkStep>i?'var(--green)':'var(--bg3)',border:`1.5px solid ${thinkStep>i?'var(--green)':'var(--border2)'}`,
                  transition:'all .3s'}}>
                  {thinkStep>i && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{fontSize:14,color:thinkStep>i?'var(--text)':'var(--text3)',transition:'color .3s'}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULTS ──
  if(screen==='results') {
    const hotelData = di.hotels[hotel||'upscale']||di.hotels['upscale'];
    const vibe = getVibe(dest);
    const imgUrl = getImg(dest);
    const showHotel = booking !== 'flight';
    const hasPts = hasCards && bestBal > 0;
    const covered = hasPts && gap <= 0;

    return (
      <div className="app" key="results"><style>{css}</style><div className="orb"/>
        <div style={{paddingTop:32}}>
          <Nav step={5} total={5} onBack={()=>goTo('s4')} label="Your plan"/>
          <RoutePill origin={origin} dest={dest} adults={adults} children={children} booking={booking}/>

          {/* Hero image */}
          <div className="animate-up d1" style={{position:'relative',height:220,borderRadius:'var(--radius)',overflow:'hidden',marginTop:16,
            background:'linear-gradient(160deg,#1a2a4a,#0a1628)'}}>
            <img src={imgUrl} alt={destName} crossOrigin="anonymous" style={{width:'100%',height:'100%',objectFit:'cover',opacity:.85}}
              onError={e=>{e.target.style.display='none'}} loading="eager"/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,0) 30%,rgba(0,0,0,.7) 100%)'}}/>
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'18px 20px',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
              <div>
                <div style={{fontFamily:'var(--display)',fontSize:26,fontWeight:600,color:'#fff'}}>{destName}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.7)',marginTop:2}}>{adults+children===1?'1 traveler':`${adults+children} travelers`}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>Cash price</div>
                <div style={{fontSize:22,fontWeight:700,color:'var(--green)'}}>~${cashVal.toLocaleString()}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>Your cost: $0</div>
              </div>
            </div>
          </div>

          {/* Flight leg */}
          <div className="card animate-up d2" style={{marginTop:12}}>
            <div style={{padding:'16px 18px',borderBottom:'1px solid var(--border)'}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:42,height:42,borderRadius:12,background:di.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{di.code}</div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{di.airline} · {cabin?cap(cabin):di.cabin}</div><div className="caption">{cap(origin)} → {destName}</div></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:16,fontWeight:700,color:'var(--green)'}}>{fp.toLocaleString()}</div><div className="caption">points</div></div>
              </div>
              <p style={{fontSize:13,color:'var(--text2)',marginTop:10,paddingLeft:56,lineHeight:1.6}}>{vibe}</p>
            </div>

            {showHotel && (
              <div style={{padding:'16px 18px',borderBottom:'1px solid var(--border)'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div style={{width:42,height:42,borderRadius:12,background:hotelData.c,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{hotelData.code}</div>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{hotelData.n}</div><div className="caption">{hotelData.tier} · {nights} night{nights!==1?'s':''}</div></div>
                  <div style={{textAlign:'right'}}><div style={{fontSize:16,fontWeight:700,color:'var(--green)'}}>{hp.toLocaleString()}</div><div className="caption">points</div></div>
                </div>
              </div>
            )}

            <div style={{padding:'14px 18px',background:'var(--bg)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:14,fontWeight:600}}>{totalPts.toLocaleString()} points total</span>
              <span style={{fontSize:13,color:'var(--green)',fontWeight:600}}>vs ~${cashVal.toLocaleString()} cash</span>
            </div>
          </div>

          {/* The number */}
          <div className="animate-up d3" style={{marginTop:16,padding:'32px 20px',borderRadius:'var(--radius)',textAlign:'center',
            background:'linear-gradient(135deg,rgba(34,197,94,0.06),rgba(34,197,94,0.01))',border:'1px solid rgba(34,197,94,0.12)'}}>
            {covered ? (
              <>
                <div style={{fontSize:28,fontWeight:600,color:'var(--green)',fontFamily:'var(--display)'}}>{"You're covered."}</div>
                <p style={{fontSize:14,color:'var(--text2)',marginTop:8}}>Your current points are enough. Time to book.</p>
              </>
            ) : (
              <>
                <div style={{animation:'count .5s cubic-bezier(.16,1,.3,1) both'}}>
                  <span style={{fontSize:80,fontWeight:700,color:'var(--green)',lineHeight:1,fontFamily:'var(--font)',letterSpacing:'-0.04em'}}>{months}</span>
                </div>
                <div style={{fontSize:18,color:'var(--text)',marginTop:4}}>month{months!==1?'s':''} to {destName}</div>
                <p style={{fontSize:13,color:'var(--text3)',marginTop:10,maxWidth:300,margin:'10px auto 0'}}>
                  Using the {card.name}. {Math.round((card.bonus||0)/1000)}k sign-up bonus + {ptsPerMo.toLocaleString()} pts/month from spending you already do.
                </p>

                {/* Stats row */}
                <div style={{display:'flex',marginTop:20,borderRadius:'var(--radius-xs)',overflow:'hidden',border:'1px solid var(--border)'}}>
                  {[
                    {l:'You need',v:totalPts.toLocaleString(),c:'var(--text)'},
                    {l:'Bonus',v:`+${Math.round((card.bonus||0)/1000)}k`,c:'var(--green)'},
                    {l:'Earn/mo',v:ptsPerMo.toLocaleString(),c:'var(--amber)'},
                  ].map((s,i)=>(
                    <div key={i} style={{flex:1,padding:'14px 8px',textAlign:'center',borderRight:i<2?'1px solid var(--border)':'none',background:'var(--card)'}}>
                      <div className="caption">{s.l}</div>
                      <div style={{fontSize:16,fontWeight:700,color:s.c,marginTop:4}}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* How it works - for beginners */}
          <div className="card animate-up d4" style={{marginTop:16}}>
            <div style={{padding:'20px 18px'}}>
              <h3 style={{fontSize:16,fontWeight:600,marginBottom:14}}>How this actually works</h3>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {[
                  {n:'1',t:'Apply for the right card',d:`We recommend the ${card.name}. Takes 5 minutes online. You get ${Math.round((card.bonus||0)/1000)}k bonus points just for signing up.`},
                  {n:'2',t:'Spend like you normally do',d:`Use the card for groceries, gas, dining. Money you're already spending. You'll earn ~${ptsPerMo.toLocaleString()} points per month automatically.`},
                  {n:'3',t:"We tell you when you're ready",d:`Once you have enough points, transfer them to ${di.airline} and book your ${destName} trip. Same seat. $0 cost.`},
                ].map(s=>(
                  <div key={s.n} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                    <div style={{width:28,height:28,borderRadius:'50%',background:'var(--green)',color:'#000',
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}}>{s.n}</div>
                    <div><div style={{fontSize:14,fontWeight:600}}>{s.t}</div><p style={{fontSize:13,color:'var(--text2)',marginTop:4,lineHeight:1.6}}>{s.d}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email capture - dark premium */}
          <div className="animate-up d5" style={{marginTop:16,borderRadius:'var(--radius)',overflow:'hidden',
            background:'linear-gradient(135deg,#0a0a0a,#1a1a1a)',border:'1px solid rgba(34,197,94,0.15)',
            animation:'glow 4s ease-in-out infinite'}}>
            <div style={{padding:'28px 22px 0'}}>
              <h3 style={{fontFamily:'var(--display)',fontSize:22,fontWeight:400,color:'#fff',lineHeight:1.2}}>
                Your {destName} plan is ready.
              </h3>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:8,lineHeight:1.6}}>
                Get your step-by-step guide: which card, what to spend, exactly when you can book.
              </p>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Your email"
                style={{width:'100%',padding:16,fontSize:15,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:'var(--radius-xs)',color:'#fff',fontFamily:'var(--font)',outline:'none',marginTop:18}}/>
              <button className="btn" onClick={()=>email.includes('@')&&goTo('done')}
                style={{marginTop:10,background:'var(--green)',color:'#000',fontWeight:700}}>
                Send me my plan →
              </button>
              <p style={{fontSize:11,color:'rgba(255,255,255,0.25)',textAlign:'center',margin:'12px 0 0'}}>
                Free. No spam. Unsubscribe with one click.
              </p>
            </div>
            <div style={{padding:'18px 22px 22px',marginTop:16,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              <span className="label" style={{color:'rgba(255,255,255,0.3)'}}>WHAT'S INCLUDED</span>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:10}}>
                {['Best card for your spending + current bonus','Exact timeline + monthly points breakdown',
                  'Transfer guide for your specific route','Application links (refreshed weekly)'].map((t,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'rgba(255,255,255,0.6)'}}>
                    <span style={{color:'var(--green)',flexShrink:0}}>✓</span>{t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-ghost animate-up d6" style={{marginTop:8}} onClick={()=>{
            setScreen('hero');setOrigin('');setDest('');setCabin('');setHotel('');setHasCards(null);
            setBalances({});setSpend('');setEmail('');
          }}>Plan another trip</button>
        </div>
      </div>
    );
  }

  // ── DONE ──
  if(screen==='done') return (
    <div className="app" key="done"><style>{css}</style><div className="orb"/>
      <div style={{paddingTop:'20vh',textAlign:'center'}}>
        <div className="animate-up" style={{width:64,height:64,borderRadius:'50%',background:'var(--green)',margin:'0 auto',
          display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14l6 6 10-11" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="heading animate-up d1" style={{marginTop:24}}>You're all set.</h2>
        <p className="subhead animate-up d2" style={{marginTop:8}}>Your {destName} plan is on its way to {email}.</p>
        <button className="btn btn-dark animate-up d3" style={{marginTop:32,maxWidth:300,margin:'32px auto 0'}}
          onClick={()=>{setScreen('hero');setOrigin('');setDest('');setCabin('');setHotel('');setHasCards(null);setBalances({});setSpend('');setEmail('');}}>
          Plan another trip
        </button>
      </div>
    </div>
  );

  return null;
}
