import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, FileText, PoundSterling, MessageCircle, Mail, Download, Save, FolderOpen, Users, Camera, X, Search, Settings, HelpCircle } from 'lucide-react';

export default function TilingEstimator() {
  const [page, setPage] = useState('estimate');
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '', email: '' });
  const [rooms, setRooms] = useState([{ id: 1, name: 'Room 1', length: '', width: '', surfaceType: 'floor', trowelSize: '10', useCementBoard: false, useAntiCrack: false, useTanking: false, useGroutCalc: false, tileWidth: '', tileHeight: '', groutWidth: '3', tileThickness: '10', useTrim: false, trimLength: '', notes: '', notesPrice: '', isNaturalStone: false, useSealant: false, sealantTubes: '1', useLevelingCompound: false, levelingDepth: '2', photos: [] }]);
  const [addressSearch, setAddressSearch] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [labour, setLabour] = useState({ type: 'm2', m2Rate: '50', m2Area: '0', dayRate: '250', daysEstimate: '1', prepWork: false, prepRate: '30', prepHours: '0' });
  const [pricing, setPricing] = useState({ adhesivePrice: '15', groutPrice: '8', cementBoardPrice: '12', antiCrackPrice: '5', tankingPrice: '35', trimPrice: '8', sealerPrice: '25', sealantPrice: '5', levelingCompoundPrice: '18', profitMargin: '20', wastePercentage: '20' });
  const [savedCustomers, setSavedCustomers] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [currentQuoteId, setCurrentQuoteId] = useState(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showQuoteList, setShowQuoteList] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [companyInfo, setCompanyInfo] = useState({ name: '', logo: '' });
  const [showFloatingHelp, setShowFloatingHelp] = useState(true);

  const themes = {
    blue: { primary: 'bg-blue-600', secondary: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', name: 'Professional Blue' },
    green: { primary: 'bg-green-600', secondary: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', name: 'Fresh Green' },
    purple: { primary: 'bg-purple-600', secondary: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', name: 'Royal Purple' },
    orange: { primary: 'bg-orange-600', secondary: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', name: 'Vibrant Orange' },
    slate: { primary: 'bg-slate-600', secondary: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', name: 'Modern Slate' },
    red: { primary: 'bg-red-600', secondary: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', name: 'Bold Red' }
  };

  const theme = themes[currentTheme];

  useEffect(() => {
    const c = localStorage.getItem('tilingCustomers');
    if (c) setSavedCustomers(JSON.parse(c));
    const q = localStorage.getItem('tilingQuotes');
    if (q) setSavedQuotes(JSON.parse(q));
    const p = localStorage.getItem('tilingPricing');
    if (p) setPricing(JSON.parse(p));
    const t = localStorage.getItem('tilingTheme');
    if (t) setCurrentTheme(t);
    const co = localStorage.getItem('tilingCompanyInfo');
    if (co) setCompanyInfo(JSON.parse(co));
    const lr = localStorage.getItem('tilingLabourRates');
    if (lr) setLabour({...labour, ...JSON.parse(lr)});
  }, []);

  const adhesiveCoverage = { '3': 8, '6': 5.5, '10': 3.3, '12': 3.3 };

  const searchAddress = async () => {
    if (!addressSearch.trim()) return;
    setSearchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}&countrycodes=gb&limit=5`,
        { headers: { 'User-Agent': 'TilingEstimator/1.0' } }
      );
      const data = await response.json();
      setAddressResults(data);
    } catch (error) {
      alert('Address search failed');
    }
    setSearchingAddress(false);
  };

  const handlePhotoCapture = (roomId, event) => {
    const files = Array.from(event.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ data: e.target.result, name: file.name });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(photos => {
      setRooms(rooms.map(r => 
        r.id === roomId ? { ...r, photos: [...(r.photos || []), ...photos] } : r
      ));
    });
  };

  const removePhoto = (roomId, photoIndex) => {
    setRooms(rooms.map(r => 
      r.id === roomId ? { ...r, photos: r.photos.filter((_, i) => i !== photoIndex) } : r
    ));
  };

  const calculateTotals = () => {
    let area = 0, adhesive = 0, grout = 0, cement = 0, antiCrack = 0, tank = 0, trim = 0, notesTotal = 0, sealerArea = 0, sealantTubes = 0, levelingCompound = 0;
    rooms.forEach(r => {
      const a = parseFloat(r.length || 0) * parseFloat(r.width || 0);
      area += a;
      if (a > 0) {
        adhesive += a / adhesiveCoverage[r.trowelSize];
        
        // Extra adhesive for anti-crack membrane: 2kg/m² = 10m² per 20kg bag
        if (r.useAntiCrack) {
          adhesive += a / 10;
        }
        
        // Extra adhesive for cement board: 2kg/m² = 10m² per 20kg bag
        if (r.useCementBoard) {
          adhesive += a / 10;
        }
        
        if (r.useGroutCalc && r.tileWidth && r.tileHeight) {
          const A = parseFloat(r.tileWidth) + parseFloat(r.tileHeight);
          const B = parseFloat(r.groutWidth) * parseFloat(r.tileThickness);
          const E = (A * B * 1.2) / (parseFloat(r.tileWidth) * parseFloat(r.tileHeight));
          grout += E * a;
        } else grout += a;
        if (r.surfaceType === 'floor') {
          if (r.useCementBoard) cement += a / 0.76;
          if (r.useAntiCrack) antiCrack += a;
        }
        if (r.surfaceType === 'wall' && r.useTanking) tank += a / 4;
        if (r.useTrim && r.trimLength) trim += parseFloat(r.trimLength);
        if (r.isNaturalStone) sealerArea += a;
        
        // Leveling compound calculation: 2mm = 4m² per 20kg, 3mm = 2.7m² per 20kg, 4mm = 2m² per 20kg
        if (r.useLevelingCompound) {
          const coverage = { '2': 4, '3': 2.7, '4': 2 };
          levelingCompound += a / coverage[r.levelingDepth || '2'];
        }
      }
      if (r.useSealant && r.sealantTubes) sealantTubes += parseFloat(r.sealantTubes || 0);
      if (r.notesPrice) notesTotal += parseFloat(r.notesPrice || 0);
    });
    const adhesiveBags = Math.ceil(adhesive * 1.2);
    const groutBags = Math.ceil((grout / 2.5) * 1.2);
    const cementBoards = Math.ceil(cement * 1.2);
    const tankingTubs = Math.ceil(tank * 1.2);
    const trimLengths = Math.ceil(trim / 2.5);
    const sealerBottles = Math.ceil((sealerArea / 10) * 2); // 2 coats, 10m² per bottle
    const levelingBags = Math.ceil(levelingCompound * 1.2);
    
    // Calculate labour cost based on type
    let labourCost = 0;
    let m2Cost = 0;
    let dayCost = 0;
    
    if (labour.type === 'm2') {
      labourCost = area * parseFloat(labour.m2Rate || 0);
      m2Cost = labourCost;
    } else if (labour.type === 'day') {
      labourCost = parseFloat(labour.dayRate || 0) * parseFloat(labour.daysEstimate || 0);
      dayCost = labourCost;
    } else if (labour.type === 'both') {
      m2Cost = parseFloat(labour.m2Area || 0) * parseFloat(labour.m2Rate || 0);
      dayCost = parseFloat(labour.dayRate || 0) * parseFloat(labour.daysEstimate || 0);
      labourCost = m2Cost + dayCost;
    }
    
    const prepCost = labour.prepWork ? parseFloat(labour.prepRate || 0) * parseFloat(labour.prepHours || 0) : 0;
    const baseMat = (adhesiveBags * parseFloat(pricing.adhesivePrice || 0)) + (groutBags * parseFloat(pricing.groutPrice || 0)) + (cementBoards * parseFloat(pricing.cementBoardPrice || 0)) + (antiCrack * 1.2 * parseFloat(pricing.antiCrackPrice || 0)) + (tankingTubs * parseFloat(pricing.tankingPrice || 0)) + (trimLengths * parseFloat(pricing.trimPrice || 0)) + (sealerBottles * parseFloat(pricing.sealerPrice || 0)) + (sealantTubes * parseFloat(pricing.sealantPrice || 0)) + (levelingBags * parseFloat(pricing.levelingCompoundPrice || 0));
    const matCost = baseMat * (1 + parseFloat(pricing.profitMargin || 0) / 100);
    const totalLabourCost = labourCost + prepCost;
    const totalCost = matCost + totalLabourCost + notesTotal;
    return { totalArea: area.toFixed(2), adhesiveBags, groutBags, cementBoards, antiCrackMembrane: antiCrack.toFixed(2), tankingTubs, trimLengths, sealerBottles, sealerArea: sealerArea.toFixed(2), sealantTubes: Math.round(sealantTubes), levelingBags, labourCost: labourCost.toFixed(2), m2Cost: m2Cost.toFixed(2), dayCost: dayCost.toFixed(2), prepCost: prepCost.toFixed(2), totalLabourCost: totalLabourCost.toFixed(2), notesTotal: notesTotal.toFixed(2), materialsCost: matCost.toFixed(2), profitAmount: (matCost - baseMat).toFixed(2), totalCost: totalCost.toFixed(2) };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {companyInfo.logo && (
          <div className="bg-white rounded shadow p-4 mb-4 flex items-center gap-3">
            <img src={companyInfo.logo} alt={companyInfo.name} className="h-12 object-contain" />
            {companyInfo.name && <h1 className="text-xl font-bold">{companyInfo.name}</h1>}
          </div>
        )}
        <div className="bg-white rounded shadow mb-4">
          <div className="flex border-b overflow-x-auto">
            {[['estimate', Calculator], ['pricing', PoundSterling], ['quote', FileText], ['settings', Settings]].map(([p, Icon]) => (
              <button key={p} onClick={() => setPage(p)} className={`flex-1 min-w-[80px] px-2 sm:px-4 py-3 ${page === p ? `${theme.text} border-b-2 ${theme.primary.replace('bg-', 'border-')}` : ''}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                <span className="text-xs sm:text-base">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded shadow p-3 mb-4 flex gap-2">
          <button onClick={() => { setCustomer({ name: '', address: '', phone: '', email: '' }); setRooms([{ id: 1, name: 'Room 1', length: '', width: '', surfaceType: 'floor', trowelSize: '10', useCementBoard: false, useAntiCrack: false, useTanking: false, useGroutCalc: false, tileWidth: '', tileHeight: '', groutWidth: '3', tileThickness: '10', useTrim: false, trimLength: '', notes: '', notesPrice: '', isNaturalStone: false, useSealant: false, sealantTubes: '1', useLevelingCompound: false, levelingDepth: '2', photos: [] }]); setCurrentQuoteId(null); }} className="px-3 py-2 bg-green-600 text-white rounded text-sm">
            <Plus className="w-4 h-4 inline mr-1" />New
          </button>
          <button onClick={() => { if (!customer.name) return alert('Enter name'); const q = { id: currentQuoteId || Date.now(), customer, rooms, labour, pricing, totals, date: new Date().toISOString() }; const u = currentQuoteId ? savedQuotes.map(sq => sq.id === currentQuoteId ? q : sq) : [...savedQuotes, q]; setSavedQuotes(u); localStorage.setItem('tilingQuotes', JSON.stringify(u)); if (!currentQuoteId) setCurrentQuoteId(q.id); alert('Saved!'); }} className={`px-3 py-2 ${theme.primary} text-white rounded text-sm`}>
            <Save className="w-4 h-4 inline mr-1" />{currentQuoteId ? 'Update' : 'Save'}
          </button>
          <button onClick={() => setShowQuoteList(!showQuoteList)} className="px-3 py-2 bg-purple-600 text-white rounded text-sm">
            <FolderOpen className="w-4 h-4 inline mr-1" />Quotes ({savedQuotes.length})
          </button>
          <button onClick={() => setShowCustomerList(!showCustomerList)} className="px-3 py-2 bg-orange-600 text-white rounded text-sm">
            <Users className="w-4 h-4 inline mr-1" />Customers ({savedCustomers.length})
          </button>
        </div>

        {showQuoteList && (
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-bold mb-3">Saved Quotes</h2>
            {savedQuotes.map(q => (
              <div key={q.id} className="flex justify-between p-2 bg-gray-50 rounded mb-2">
                <div><div className="font-medium text-sm">{q.customer.name}</div><div className="text-xs text-gray-600">£{q.totals.totalCost}</div></div>
                <div className="flex gap-2">
                  <button onClick={() => { setCustomer(q.customer); setRooms(q.rooms); setLabour(q.labour); setPricing(q.pricing); setCurrentQuoteId(q.id); setShowQuoteList(false); setPage('estimate'); }} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Load</button>
                  <button onClick={() => { if (confirm('Delete?')) { const u = savedQuotes.filter(sq => sq.id !== q.id); setSavedQuotes(u); localStorage.setItem('tilingQuotes', JSON.stringify(u)); if (currentQuoteId === q.id) setCurrentQuoteId(null); }}} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCustomerList && (
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-bold mb-3">Customers</h2>
            {savedCustomers.map(c => (
              <div key={c.id} className="flex justify-between p-2 bg-gray-50 rounded mb-2">
                <div><div className="font-medium text-sm">{c.name}</div><div className="text-xs">{c.phone}</div></div>
                <div className="flex gap-2">
                  <button onClick={() => { setCustomer(c); setShowCustomerList(false); }} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Load</button>
                  <button onClick={() => { if (confirm('Delete?')) { const u = savedCustomers.filter(sc => sc.id !== c.id); setSavedCustomers(u); localStorage.setItem('tilingCustomers', JSON.stringify(u)); }}} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {page === 'estimate' && (
          <div className="bg-white rounded shadow p-4">
            <h1 className="text-2xl font-bold mb-4">Estimate</h1>
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <h2 className="text-lg font-semibold">Customer</h2>
                <button onClick={() => { if (!customer.name) return alert('Enter name'); setSavedCustomers([...savedCustomers, { ...customer, id: Date.now() }]); localStorage.setItem('tilingCustomers', JSON.stringify([...savedCustomers, { ...customer, id: Date.now() }])); alert('Saved!'); }} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Save</button>
              </div>
              <div className="space-y-3">
                <div><label className="block text-xs mb-1">Name</label><input type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm" /></div>
                <div>
                  <label className="block text-xs mb-1">Address</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={addressSearch} 
                      onChange={(e) => setAddressSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                      placeholder="Search UK address..." 
                      className="flex-1 px-2 py-1.5 border rounded text-sm" 
                    />
                    <button 
                      onClick={searchAddress}
                      disabled={searchingAddress}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                    >
                      <Search className="w-4 h-4" />
                      {searchingAddress ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  {addressResults.length > 0 && (
                    <div className="border rounded mb-2 max-h-40 overflow-y-auto">
                      {addressResults.map((result, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setCustomer({...customer, address: result.display_name});
                            setAddressSearch('');
                            setAddressResults([]);
                          }}
                          className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 text-xs"
                        >
                          {result.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                  <input 
                    type="text" 
                    value={customer.address} 
                    onChange={(e) => setCustomer({...customer, address: e.target.value})} 
                    placeholder="Or type address manually"
                    className="w-full px-2 py-1.5 border rounded text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs mb-1">Phone</label><input type="text" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm" /></div>
                  <div><label className="block text-xs mb-1">Email</label><input type="text" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} className="w-full px-2 py-1.5 border rounded text-sm" /></div>
                </div>
              </div>
            </div>

            {/* Labour Pricing Method */}
            <div className="bg-white rounded shadow p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Labour Pricing for This Job</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-2 text-gray-600">Choose pricing method:</label>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={labour.type === 'm2'} 
                        onChange={() => setLabour({...labour, type: 'm2'})} 
                      />
                      <span className="text-sm font-medium">Per m²</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={labour.type === 'day'} 
                        onChange={() => setLabour({...labour, type: 'day'})} 
                      />
                      <span className="text-sm font-medium">Day Rate</span>
                    </label>
                  </div>
                </div>

                {labour.type === 'm2' && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-blue-900 font-medium mb-1">m² Pricing</p>
                    <p className="text-xs text-blue-800">
                      Total area: <strong>{totals.totalArea}m²</strong> × £{labour.m2Rate}/m² = <strong>£{totals.labourCost}</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Rate from Settings: £{labour.m2Rate}/m²</p>
                  </div>
                )}

                {labour.type === 'day' && (
                  <div className="bg-green-50 p-3 rounded space-y-2">
                    <p className="text-sm text-green-900 font-medium">Day Rate Pricing</p>
                    <div>
                      <label className="block text-xs mb-1">Estimated Days</label>
                      <input 
                        type="number" 
                        step="0.5" 
                        value={labour.daysEstimate} 
                        onChange={(e) => setLabour({...labour, daysEstimate: e.target.value})} 
                        className="w-full px-2 py-1.5 border rounded text-sm" 
                        placeholder="1"
                      />
                      <p className="text-xs text-green-800 mt-1">
                        <strong>{labour.daysEstimate}</strong> day(s) × £{labour.dayRate}/day = <strong>£{totals.labourCost}</strong>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Rate from Settings: £{labour.dayRate}/day</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <h2 className="text-lg font-semibold">Rooms</h2>
                <button onClick={() => setRooms([...rooms, { id: rooms.length + 1, name: `Room ${rooms.length + 1}`, length: '', width: '', surfaceType: 'floor', trowelSize: '10', useCementBoard: false, useAntiCrack: false, useTanking: false, useGroutCalc: false, tileWidth: '', tileHeight: '', groutWidth: '3', tileThickness: '10', useTrim: false, trimLength: '', notes: '', notesPrice: '', isNaturalStone: false, useSealant: false, sealantTubes: '1', useLevelingCompound: false, levelingDepth: '2', photos: [] }])} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Add</button>
              </div>
              {rooms.map(r => (
                <div key={r.id} className="bg-gray-50 p-3 rounded mb-3">
                  <div className="flex justify-between mb-2">
                    <input value={r.name} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, name: e.target.value} : rm))} className="px-2 py-1 border rounded text-sm" />
                    {rooms.length > 1 && <button onClick={() => setRooms(rooms.filter(rm => rm.id !== r.id))}><Trash2 className="w-4 h-4 text-red-600" /></button>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div><label className="text-xs">Length</label><input type="number" step="0.01" value={r.length} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, length: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" /></div>
                    <div><label className="text-xs">Width</label><input type="number" step="0.01" value={r.width} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, width: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" /></div>
                    <div><label className="text-xs">Area</label><input value={(parseFloat(r.length || 0) * parseFloat(r.width || 0)).toFixed(2)} disabled className="w-full px-2 py-1 border rounded bg-gray-100 text-sm" /></div>
                  </div>
                  <div className="flex gap-4 mb-2">
                    {['floor', 'wall'].map(t => (
                      <label key={t} className="flex items-center gap-1 text-sm">
                        <input type="radio" checked={r.surfaceType === t} onChange={() => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, surfaceType: t} : rm))} />
                        {t}
                      </label>
                    ))}
                  </div>
                  {r.surfaceType === 'floor' && (
                    <div className="bg-blue-50 p-2 rounded text-xs space-y-1 mb-2">
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={r.useCementBoard} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useCementBoard: e.target.checked} : rm))} />
                        Cement Board {r.useCementBoard && <span className="text-blue-700 font-medium">(+2kg/m² adhesive)</span>}
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={r.useAntiCrack} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useAntiCrack: e.target.checked} : rm))} />
                        Anti-Crack Membrane {r.useAntiCrack && <span className="text-blue-700 font-medium">(+2kg/m² adhesive)</span>}
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={r.useLevelingCompound} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useLevelingCompound: e.target.checked} : rm))} />
                        Leveling Compound
                      </label>
                      {r.useLevelingCompound && (
                        <div className="bg-white p-2 rounded ml-4 mt-1">
                          <label className="block text-xs mb-1">Depth</label>
                          <select 
                            value={r.levelingDepth} 
                            onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, levelingDepth: e.target.value} : rm))} 
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="2">2mm (4m² per bag)</option>
                            <option value="3">3mm (2.7m² per bag)</option>
                            <option value="4">4mm (2m² per bag)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                  {r.surfaceType === 'wall' && (
                    <div className="bg-green-50 p-2 rounded text-xs space-y-1 mb-2">
                      <label className="flex items-center gap-1">
                        <input type="checkbox" checked={r.useTanking} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useTanking: e.target.checked} : rm))} />
                        Tanking Membrane (4m² per tub)
                      </label>
                    </div>
                  )}
                  <div className="mb-2">
                    <label className="block text-xs mb-1">Trowel Size</label>
                    <select value={r.trowelSize} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, trowelSize: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm">
                      {[['3', '3mm'], ['6', '6mm'], ['10', '10mm'], ['12', '12mm']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <label className="flex items-center gap-2 text-xs mb-2">
                      <input type="checkbox" checked={r.useGroutCalc} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useGroutCalc: e.target.checked} : rm))} />
                      Calculate Grout by Tile Size
                    </label>
                    {r.useGroutCalc && (
                      <div className="bg-yellow-50 p-2 rounded space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div><label className="text-xs">Tile W (mm)</label><input type="number" value={r.tileWidth} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, tileWidth: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" placeholder="600" /></div>
                          <div><label className="text-xs">Tile H (mm)</label><input type="number" value={r.tileHeight} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, tileHeight: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" placeholder="600" /></div>
                          <div><label className="text-xs">Grout W (mm)</label><input type="number" value={r.groutWidth} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, groutWidth: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" placeholder="3" /></div>
                          <div><label className="text-xs">Thickness (mm)</label><input type="number" value={r.tileThickness} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, tileThickness: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" placeholder="10" /></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <label className="flex items-center gap-2 text-xs mb-2">
                      <input type="checkbox" checked={r.useTrim} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useTrim: e.target.checked} : rm))} />
                      Add Tile Trim
                    </label>
                    {r.useTrim && (
                      <div className="bg-purple-50 p-2 rounded">
                        <label className="text-xs">Trim Length (m)</label>
                        <input type="number" step="0.1" value={r.trimLength} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, trimLength: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" placeholder="meters" />
                        <p className="text-xs text-gray-600 mt-1">2.5m @ £{pricing.trimPrice}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <label className="flex items-center gap-2 text-xs mb-2">
                      <input type="checkbox" checked={r.isNaturalStone} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, isNaturalStone: e.target.checked} : rm))} />
                      Natural Stone (requires sealer)
                    </label>
                    {r.isNaturalStone && (
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-800">Sealer required: {Math.ceil((parseFloat(r.length || 0) * parseFloat(r.width || 0) / 10) * 2)} bottles (2 coats, 10m² per bottle)</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <label className="flex items-center gap-2 text-xs mb-2">
                      <input type="checkbox" checked={r.useSealant} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useSealant: e.target.checked} : rm))} />
                      Add Sealant (silicone)
                    </label>
                    {r.useSealant && (
                      <div className="bg-cyan-50 p-2 rounded">
                        <label className="text-xs">Number of Tubes</label>
                        <input 
                          type="number" 
                          step="1" 
                          min="1"
                          value={r.sealantTubes} 
                          onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, sealantTubes: e.target.value} : rm))} 
                          className="w-full px-2 py-1 border rounded text-sm mt-1" 
                          placeholder="1" 
                        />
                        <p className="text-xs text-cyan-800 mt-1">{r.sealantTubes || 1} tube(s) @ £{pricing.sealantPrice} each</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <label className="text-xs mb-1 block">Job Photos</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      multiple
                      onChange={(e) => handlePhotoCapture(r.id, e)}
                      className="hidden"
                      id={`photo-${r.id}`}
                    />
                    <label 
                      htmlFor={`photo-${r.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      Take/Upload Photos
                    </label>
                    {r.photos && r.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {r.photos.map((photo, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={photo.data} 
                              alt={`Room photo ${idx + 1}`} 
                              className="w-full h-20 object-cover rounded border"
                            />
                            <button 
                              onClick={() => removePhoto(r.id, idx)}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <label className="text-xs mb-1 block">Room Notes / Extra Work</label>
                    <textarea value={r.notes} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, notes: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-xs mb-2" rows="2" placeholder="e.g., Remove old tiles, repair subfloor, special access"></textarea>
                    <div>
                      <label className="text-xs mb-1 block">Additional Cost (£) - Optional</label>
                      <input type="number" step="0.01" value={r.notesPrice} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, notesPrice: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" placeholder="0.00" />
                      <p className="text-xs text-gray-500 mt-1">Add cost for extra work mentioned in notes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded p-4">
              <h2 className="font-semibold mb-3">Summary</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Area</div><div className="font-bold">{totals.totalArea}m²</div></div>
                <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Adhesive</div><div className="font-bold">{totals.adhesiveBags} bags</div></div>
                <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Grout</div><div className="font-bold">{totals.groutBags} bags</div></div>
                {totals.cementBoards > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Cement Boards</div><div className="font-bold">{totals.cementBoards}</div></div>}
                {parseFloat(totals.antiCrackMembrane) > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Anti-Crack</div><div className="font-bold">{totals.antiCrackMembrane}m²</div></div>}
                {totals.tankingTubs > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Tanking</div><div className="font-bold">{totals.tankingTubs} tubs</div></div>}
                {totals.trimLengths > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Trim</div><div className="font-bold">{totals.trimLengths} x 2.5m</div></div>}
                {totals.levelingBags > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Leveling Compound</div><div className="font-bold">{totals.levelingBags} bags</div></div>}
                {totals.sealerBottles > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Stone Sealer</div><div className="font-bold">{totals.sealerBottles} bottles</div></div>}
                {totals.sealantTubes > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Sealant</div><div className="font-bold">{totals.sealantTubes} tubes</div></div>}
                {parseFloat(totals.prepCost) > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Prep Work</div><div className="font-bold">£{totals.prepCost}</div></div>}
                {parseFloat(totals.notesTotal) > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Extra Work</div><div className="font-bold">£{totals.notesTotal}</div></div>}
                <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Total</div><div className="font-bold text-green-600">£{totals.totalCost}</div></div>
              </div>
            </div>
          </div>
        )}

        {page === 'pricing' && (
          <div className="bg-white rounded shadow p-4">
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">Pricing</h1>
              <button onClick={() => { localStorage.setItem('tilingPricing', JSON.stringify(pricing)); alert('Saved!'); }} className="px-3 py-2 bg-green-600 text-white rounded text-sm">Save Prices</button>
            </div>
            <div className="space-y-3">
              {[['adhesivePrice', 'Adhesive (20kg)'], ['groutPrice', 'Grout (2.5kg)'], ['cementBoardPrice', 'Cement Board'], ['antiCrackPrice', 'Anti-Crack (m²)'], ['tankingPrice', 'Tanking (tub)'], ['trimPrice', 'Tile Trim (2.5m)'], ['levelingCompoundPrice', 'Leveling Compound (20kg)'], ['sealerPrice', 'Stone Sealer (bottle)'], ['sealantPrice', 'Sealant (tube)'], ['wastePercentage', 'Waste % (10-30)'], ['profitMargin', 'Profit Margin (%)']].map(([k, l]) => (
                <div key={k}><label className="block text-sm mb-1">{l}</label><input type="number" step="0.01" value={pricing[k]} onChange={(e) => setPricing({...pricing, [k]: e.target.value})} className="w-full px-2 py-1.5 border rounded" /></div>
              ))}
            </div>
          </div>
        )}

        {page === 'quote' && (
          <div className="bg-white rounded shadow p-4">
            <h1 className="text-2xl font-bold mb-4">Quote</h1>
            <div className="bg-gray-50 p-4 rounded mb-4 text-xs whitespace-pre-wrap">{`Customer: ${customer.name}
Phone: ${customer.phone}

Total Area: ${totals.totalArea}m²
Adhesive: ${totals.adhesiveBags} bags @ £${pricing.adhesivePrice}
Grout: ${totals.groutBags} bags @ £${pricing.groutPrice}
${totals.cementBoards > 0 ? `Cement Boards: ${totals.cementBoards} @ £${pricing.cementBoardPrice}\n` : ''}${parseFloat(totals.antiCrackMembrane) > 0 ? `Anti-Crack: ${totals.antiCrackMembrane}m² @ £${pricing.antiCrackPrice}\n` : ''}${totals.tankingTubs > 0 ? `Tanking: ${totals.tankingTubs} tubs @ £${pricing.tankingPrice}\n` : ''}${totals.trimLengths > 0 ? `Tile Trim: ${totals.trimLengths} x 2.5m @ £${pricing.trimPrice}\n` : ''}${totals.levelingBags > 0 ? `Leveling Compound: ${totals.levelingBags} bags @ £${pricing.levelingCompoundPrice}\n` : ''}${totals.sealerBottles > 0 ? `Stone Sealer: ${totals.sealerBottles} bottles @ £${pricing.sealerPrice}\n` : ''}${totals.sealantTubes > 0 ? `Sealant: ${totals.sealantTubes} tubes @ £${pricing.sealantPrice}\n` : ''}
Materials: £${totals.materialsCost}
Tiling Labour: £${totals.labourCost}
${parseFloat(totals.prepCost) > 0 ? `Prep Work: £${totals.prepCost}\n` : ''}${parseFloat(totals.notesTotal) > 0 ? `Extra Work: £${totals.notesTotal}\n` : ''}Total Labour: £${totals.totalLabourCost}

TOTAL: £${totals.totalCost}

${rooms.filter(r => r.notes).map(r => `${r.name}: ${r.notes}${r.notesPrice ? ` (£${r.notesPrice})` : ''}`).join('\n')}

(Includes ${pricing.wastePercentage}% waste allowance)`}</div>
            <div className="flex gap-2">
              <button onClick={() => {
                const quoteMessage = `${companyInfo.name ? companyInfo.name + '\n' : ''}TILING QUOTE\n\nCustomer: ${customer.name}\n${customer.address ? 'Address: ' + customer.address + '\n' : ''}Phone: ${customer.phone}\n${customer.email ? 'Email: ' + customer.email + '\n' : ''}\n--- PROJECT OVERVIEW ---\nTotal Area: ${totals.totalArea}m²\n${rooms.length} Room(s):\n${rooms.map(r => `• ${r.name}: ${(parseFloat(r.length || 0) * parseFloat(r.width || 0)).toFixed(2)}m² (${r.surfaceType}${r.isNaturalStone ? ', natural stone' : ''}${r.useLevelingCompound ? ', leveling ' + r.levelingDepth + 'mm' : ''})`).join('\n')}\n\n--- MATERIALS ---\nAdhesive: ${totals.adhesiveBags} bags @ £${pricing.adhesivePrice} = £${(totals.adhesiveBags * parseFloat(pricing.adhesivePrice)).toFixed(2)}\nGrout: ${totals.groutBags} bags @ £${pricing.groutPrice} = £${(totals.groutBags * parseFloat(pricing.groutPrice)).toFixed(2)}\n${totals.cementBoards > 0 ? `Cement Boards: ${totals.cementBoards} @ £${pricing.cementBoardPrice} = £${(totals.cementBoards * parseFloat(pricing.cementBoardPrice)).toFixed(2)}\n` : ''}${parseFloat(totals.antiCrackMembrane) > 0 ? `Anti-Crack Membrane: ${totals.antiCrackMembrane}m² @ £${pricing.antiCrackPrice} = £${(parseFloat(totals.antiCrackMembrane) * 1.2 * parseFloat(pricing.antiCrackPrice)).toFixed(2)}\n` : ''}${totals.tankingTubs > 0 ? `Tanking: ${totals.tankingTubs} tubs @ £${pricing.tankingPrice} = £${(totals.tankingTubs * parseFloat(pricing.tankingPrice)).toFixed(2)}\n` : ''}${totals.trimLengths > 0 ? `Tile Trim: ${totals.trimLengths} x 2.5m @ £${pricing.trimPrice} = £${(totals.trimLengths * parseFloat(pricing.trimPrice)).toFixed(2)}\n` : ''}${totals.levelingBags > 0 ? `Leveling Compound: ${totals.levelingBags} bags @ £${pricing.levelingCompoundPrice} = £${(totals.levelingBags * parseFloat(pricing.levelingCompoundPrice)).toFixed(2)}\n` : ''}${totals.sealerBottles > 0 ? `Stone Sealer: ${totals.sealerBottles} bottles @ £${pricing.sealerPrice} = £${(totals.sealerBottles * parseFloat(pricing.sealerPrice)).toFixed(2)}\n` : ''}${totals.sealantTubes > 0 ? `Sealant: ${totals.sealantTubes} tubes @ £${pricing.sealantPrice} = £${(totals.sealantTubes * parseFloat(pricing.sealantPrice)).toFixed(2)}\n` : ''}\nMaterials Subtotal: £${totals.materialsCost}\n\n--- LABOUR ---\nLabour: £${totals.totalLabourCost}\n\n--- TOTAL QUOTE ---\n£${totals.totalCost}\n\n${rooms.filter(r => r.notes).length > 0 ? '--- NOTES ---\n' + rooms.filter(r => r.notes).map(r => `${r.name}: ${r.notes}${r.notesPrice ? ' (£' + r.notesPrice + ')' : ''}`).join('\n') + '\n\n' : ''}(Includes ${pricing.wastePercentage}% waste allowance)`;
                // Format phone number for WhatsApp - add UK country code if missing
                let phoneNumber = customer.phone.replace(/\D/g, '');
                // If number doesn't start with country code (assume UK +44 if 10-11 digits)
                if (phoneNumber.length === 10 || phoneNumber.length === 11) {
                  // Remove leading 0 if present (UK format)
                  if (phoneNumber.startsWith('0')) {
                    phoneNumber = phoneNumber.substring(1);
                  }
                  // Add UK country code
                  phoneNumber = '44' + phoneNumber;
                }
                window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(quoteMessage)}`, '_blank');
              }} className="px-4 py-2 bg-green-600 text-white rounded text-sm"><MessageCircle className="w-4 h-4 inline mr-1" />WhatsApp</button>
              <button onClick={() => {
                const quoteMessage = `${companyInfo.name ? companyInfo.name + '\n' : ''}TILING QUOTE\n\nCustomer: ${customer.name}\n${customer.address ? 'Address: ' + customer.address + '\n' : ''}Phone: ${customer.phone}\n${customer.email ? 'Email: ' + customer.email + '\n' : ''}\n--- PROJECT OVERVIEW ---\nTotal Area: ${totals.totalArea}m²\n${rooms.length} Room(s):\n${rooms.map(r => `• ${r.name}: ${(parseFloat(r.length || 0) * parseFloat(r.width || 0)).toFixed(2)}m² (${r.surfaceType}${r.isNaturalStone ? ', natural stone' : ''}${r.useLevelingCompound ? ', leveling ' + r.levelingDepth + 'mm' : ''})`).join('\n')}\n\n--- MATERIALS ---\nAdhesive: ${totals.adhesiveBags} bags @ £${pricing.adhesivePrice} = £${(totals.adhesiveBags * parseFloat(pricing.adhesivePrice)).toFixed(2)}\nGrout: ${totals.groutBags} bags @ £${pricing.groutPrice} = £${(totals.groutBags * parseFloat(pricing.groutPrice)).toFixed(2)}\n${totals.cementBoards > 0 ? `Cement Boards: ${totals.cementBoards} @ £${pricing.cementBoardPrice} = £${(totals.cementBoards * parseFloat(pricing.cementBoardPrice)).toFixed(2)}\n` : ''}${parseFloat(totals.antiCrackMembrane) > 0 ? `Anti-Crack Membrane: ${totals.antiCrackMembrane}m² @ £${pricing.antiCrackPrice} = £${(parseFloat(totals.antiCrackMembrane) * 1.2 * parseFloat(pricing.antiCrackPrice)).toFixed(2)}\n` : ''}${totals.tankingTubs > 0 ? `Tanking: ${totals.tankingTubs} tubs @ £${pricing.tankingPrice} = £${(totals.tankingTubs * parseFloat(pricing.tankingPrice)).toFixed(2)}\n` : ''}${totals.trimLengths > 0 ? `Tile Trim: ${totals.trimLengths} x 2.5m @ £${pricing.trimPrice} = £${(totals.trimLengths * parseFloat(pricing.trimPrice)).toFixed(2)}\n` : ''}${totals.levelingBags > 0 ? `Leveling Compound: ${totals.levelingBags} bags @ £${pricing.levelingCompoundPrice} = £${(totals.levelingBags * parseFloat(pricing.levelingCompoundPrice)).toFixed(2)}\n` : ''}${totals.sealerBottles > 0 ? `Stone Sealer: ${totals.sealerBottles} bottles @ £${pricing.sealerPrice} = £${(totals.sealerBottles * parseFloat(pricing.sealerPrice)).toFixed(2)}\n` : ''}${totals.sealantTubes > 0 ? `Sealant: ${totals.sealantTubes} tubes @ £${pricing.sealantPrice} = £${(totals.sealantTubes * parseFloat(pricing.sealantPrice)).toFixed(2)}\n` : ''}\nMaterials Subtotal: £${totals.materialsCost}\n\n--- LABOUR ---\nLabour: £${totals.totalLabourCost}\n\n--- TOTAL QUOTE ---\n£${totals.totalCost}\n\n${rooms.filter(r => r.notes).length > 0 ? '--- NOTES ---\n' + rooms.filter(r => r.notes).map(r => `${r.name}: ${r.notes}${r.notesPrice ? ' (£' + r.notesPrice + ')' : ''}`).join('\n') + '\n\n' : ''}(Includes ${pricing.wastePercentage}% waste allowance)`;
                window.location.href = `mailto:${customer.email}?subject=${encodeURIComponent('Tiling Quote - £' + totals.totalCost)}&body=${encodeURIComponent(quoteMessage)}`;
              }} className="px-4 py-2 bg-blue-600 text-white rounded text-sm"><Mail className="w-4 h-4 inline mr-1" />Email</button>
            </div>
          </div>
        )}

        {page === 'settings' && (
          <div className="bg-white rounded shadow p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Company Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={companyInfo.name} 
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})} 
                    className="w-full px-2 py-1.5 border rounded text-sm" 
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Company Logo URL</label>
                  <input 
                    type="text" 
                    value={companyInfo.logo} 
                    onChange={(e) => setCompanyInfo({...companyInfo, logo: e.target.value})} 
                    className="w-full px-2 py-1.5 border rounded text-sm" 
                    placeholder="https://example.com/logo.png"
                  />
                  {companyInfo.logo && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <img src={companyInfo.logo} alt="Company Logo" className="h-16 object-contain" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => { 
                    localStorage.setItem('tilingCompanyInfo', JSON.stringify(companyInfo)); 
                    alert('Company info saved!'); 
                  }} 
                  className={`w-full px-3 py-2 ${theme.primary} text-white rounded text-sm`}
                >
                  Save Company Info
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Default Labour Rates</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">m² Rate (£)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={labour.m2Rate} 
                    onChange={(e) => setLabour({...labour, m2Rate: e.target.value})} 
                    className="w-full px-2 py-1.5 border rounded text-sm" 
                    placeholder="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default rate per square meter for tiling</p>
                </div>
                <div>
                  <label className="block text-xs mb-1">Day Rate (£)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={labour.dayRate} 
                    onChange={(e) => setLabour({...labour, dayRate: e.target.value})} 
                    className="w-full px-2 py-1.5 border rounded text-sm" 
                    placeholder="250"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default daily rate for tiling work</p>
                </div>
                <div>
                  <label className="block text-xs mb-1">Prep Work Hourly Rate (£)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={labour.prepRate} 
                    onChange={(e) => setLabour({...labour, prepRate: e.target.value})} 
                    className="w-full px-2 py-1.5 border rounded text-sm" 
                    placeholder="30"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hourly rate for prep work (removal, floor prep, etc.)</p>
                </div>
                <button 
                  onClick={() => { 
                    localStorage.setItem('tilingLabourRates', JSON.stringify(labour)); 
                    alert('Labour rates saved!'); 
                  }} 
                  className={`w-full px-3 py-2 ${theme.primary} text-white rounded text-sm`}
                >
                  Save Labour Rates
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Color Theme</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentTheme(key);
                      localStorage.setItem('tilingTheme', key);
                    }}
                    className={`p-4 rounded border-2 ${currentTheme === key ? `${t.border} ${t.secondary}` : 'border-gray-200'}`}
                  >
                    <div className={`w-full h-8 rounded mb-2 ${t.primary}`}></div>
                    <div className="text-sm font-medium">{t.name}</div>
                    {currentTheme === key && <div className={`text-xs ${t.text} mt-1`}>✓ Active</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === 'help' && (
          <div className="bg-white rounded shadow p-4">
            <h1 className="text-2xl font-bold mb-4">How to Use This App</h1>
            
            <div className="space-y-6 text-sm">
              <section>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Creating an Estimate
                </h2>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li><strong>Customer Details:</strong> Enter customer name, address, phone, and email. Use the address search to find UK addresses quickly.</li>
                  <li><strong>Add Rooms:</strong> Click "Add" to create multiple rooms. Each room can be customized separately.</li>
                  <li><strong>Room Dimensions:</strong> Enter length and width in meters. Area is calculated automatically.</li>
                  <li><strong>Surface Type:</strong> Choose Floor or Wall to show relevant options.</li>
                  <li><strong>Trowel Size:</strong> Select 3mm, 6mm, 10mm, or 12mm (default: 10mm).</li>
                </ol>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Floor Options</h2>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Cement Board:</strong> Adds boards + 2kg/m² adhesive for bonding</li>
                  <li><strong>Anti-Crack Membrane:</strong> Adds membrane + 2kg/m² adhesive</li>
                  <li><strong>Leveling Compound:</strong> Choose depth (2mm, 3mm, or 4mm) - bags calculated automatically</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Additional Options</h2>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Natural Stone:</strong> Auto-calculates stone sealer (2 coats, 10m² per bottle)</li>
                  <li><strong>Tile Trim:</strong> Enter length in meters (sold in 2.5m lengths)</li>
                  <li><strong>Sealant:</strong> Specify number of silicone tubes needed</li>
                  <li><strong>Advanced Grout Calc:</strong> Uses tile dimensions for precise grout quantity</li>
                  <li><strong>Job Photos:</strong> Take/upload photos directly from your phone for reference</li>
                  <li><strong>Room Notes:</strong> Add special instructions and optional extra costs per room</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <PoundSterling className="w-5 h-5" />
                  Labour Pricing
                </h2>
                <p className="mb-2"><strong>Step 1:</strong> Set your default rates in <strong>Settings</strong> tab:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>m² Rate:</strong> Default rate per square meter (e.g., £50/m²)</li>
                  <li><strong>Day Rate:</strong> Default daily rate (e.g., £250/day)</li>
                  <li><strong>Prep Work Rate:</strong> Hourly rate for preparation work (e.g., £30/hr)</li>
                </ul>
                <p className="mt-3 mb-2"><strong>Step 2:</strong> Choose pricing method per job in <strong>Estimate</strong> page:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Per m²:</strong> Uses total area × m² rate. Automatic calculation.</li>
                  <li><strong>Day Rate:</strong> Enter estimated days. Calculates days × day rate.</li>
                </ul>
                <div className="mt-2 text-xs bg-blue-50 p-2 rounded space-y-1">
                  <p>💡 <strong>How It Works:</strong></p>
                  <p>• Set rates once in Settings</p>
                  <p>• Choose m² or day rate for each quote</p>
                  <p>• m² uses total room area automatically</p>
                  <p>• Day rate requires you to enter number of days</p>
                  <p>• Both methods use your saved rates from Settings</p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <PoundSterling className="w-5 h-5" />
                  Pricing Setup
                </h2>
                <p className="mb-2">Go to the <strong>Pricing</strong> tab to set default prices for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Adhesive, Grout, Cement Board, Anti-Crack, Tanking</li>
                  <li>Tile Trim, Leveling Compound, Stone Sealer, Sealant</li>
                  <li>Waste Percentage (10-30%, typically 20%)</li>
                  <li>Profit Margin (% markup on materials)</li>
                </ul>
                <p className="mt-2 text-xs text-gray-600">💡 Tip: Click "Save Prices" to keep your defaults for future quotes</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Saving & Sending Quotes
                </h2>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li><strong>Save:</strong> Click "Save" button to store quote (updates if already saved)</li>
                  <li><strong>Load:</strong> Click "Quotes" to view and load previous quotes</li>
                  <li><strong>Send:</strong> Go to Quote tab, then click WhatsApp or Email to send a comprehensive professional quote with:
                    <ul className="list-disc list-inside ml-6 mt-1 text-xs">
                      <li>Company name and branding (if set)</li>
                      <li>Customer details and address</li>
                      <li>Project overview: total area and room-by-room breakdown with features</li>
                      <li>Complete materials list: quantity @ unit price = line total for each item</li>
                      <li>Materials subtotal with profit margin applied</li>
                      <li>Labour total (no breakdown shown to customer)</li>
                      <li>Final quote amount</li>
                      <li>Room notes and additional work</li>
                      <li>Waste allowance percentage note</li>
                    </ul>
                  </li>
                </ol>
                <p className="mt-2 text-xs bg-green-50 p-2 rounded">✅ <strong>Professional Quotes:</strong> Customers receive complete transparency on materials while labour remains as a single total, protecting your pricing strategy.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings & Customization
                </h2>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Company Info:</strong> Add your company name and logo URL</li>
                  <li><strong>Default Labour Rates:</strong> Set your m² rate, day rate, and prep work hourly rate</li>
                  <li><strong>Color Themes:</strong> Choose from 6 professional color schemes</li>
                  <li>Your logo and company name appear on all pages and in quotes</li>
                  <li>All settings save to your browser and persist between sessions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Quick Tips</h2>
                <div className="bg-blue-50 p-3 rounded space-y-2 text-xs">
                  <p>✅ <strong>Set labour rates in Settings</strong> - then choose m² or day rate per job</p>
                  <p>✅ <strong>m² pricing is automatic</strong> - uses total room area, no extra input needed</p>
                  <p>✅ <strong>Use the floating Help button</strong> - click the orange button at bottom-center anytime</p>
                  <p>✅ <strong>Save customers separately</strong> - reuse their details for future quotes</p>
                  <p>✅ <strong>All data saves in your browser</strong> - no internet needed after loading</p>
                  <p>✅ <strong>Use address search</strong> - saves time and ensures accuracy</p>
                  <p>✅ <strong>Take photos on-site</strong> - attach to specific rooms for reference</p>
                  <p>✅ <strong>Check the summary</strong> - review totals before sending quote</p>
                  <p>✅ <strong>Cement board + Anti-crack</strong> = 4kg/m² extra adhesive total</p>
                  <p>✅ <strong>Natural stone</strong> automatically adds sealer to materials</p>
                  <p>✅ <strong>Professional quotes</strong> - detailed material breakdown, labour shown as total only</p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-2">Material Coverage Rates</h2>
                <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                  <p><strong>Adhesive (trowel size):</strong> 3mm=8m², 6mm=5.5m², 10mm=3.3m², 12mm=3.3m² per 20kg bag</p>
                  <p><strong>Cement Board/Anti-Crack:</strong> +2kg/m² adhesive (10m² per 20kg bag)</p>
                  <p><strong>Leveling Compound:</strong> 2mm=4m², 3mm=2.7m², 4mm=2m² per 20kg bag</p>
                  <p><strong>Grout:</strong> 2.5kg covers ~1m² (varies with joint width)</p>
                  <p><strong>Stone Sealer:</strong> 10m² per bottle, 2 coats required</p>
                  <p><strong>Waste:</strong> All materials include configurable waste allowance (default 20%)</p>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* Floating Help Button */}
      {showFloatingHelp && page !== 'help' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="relative">
            <button
              onClick={() => setShowFloatingHelp(false)}
              className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg"
            >
              ✕
            </button>
            <button
              onClick={() => setPage('help')}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Need Help?</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}