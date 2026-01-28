import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, FileText, DollarSign, MessageCircle, Mail, Download, Save, FolderOpen, Users } from 'lucide-react';

export default function TilingEstimator() {
  const [page, setPage] = useState('estimate');
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '', email: '' });
  const [rooms, setRooms] = useState([{ id: 1, name: 'Room 1', length: '', width: '', surfaceType: 'floor', trowelSize: '6', useCementBoard: false, useAntiCrack: false, useTanking: false, useGroutCalc: false, tileWidth: '', tileHeight: '', groutWidth: '3', tileThickness: '10', useTrim: false, trimLength: '', notes: '', notesPrice: '' }]);
  const [labour, setLabour] = useState({ type: 'm2', m2Rate: '50', dayRate: '250', daysEstimate: '1', prepWork: false, prepRate: '30', prepHours: '0' });
  const [pricing, setPricing] = useState({ adhesivePrice: '15', groutPrice: '8', cementBoardPrice: '12', antiCrackPrice: '5', tankingPrice: '35', trimPrice: '8', profitMargin: '20', wastePercentage: '20' });
  const [savedCustomers, setSavedCustomers] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [currentQuoteId, setCurrentQuoteId] = useState(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showQuoteList, setShowQuoteList] = useState(false);

  useEffect(() => {
    const c = localStorage.getItem('tilingCustomers');
    if (c) setSavedCustomers(JSON.parse(c));
    const q = localStorage.getItem('tilingQuotes');
    if (q) setSavedQuotes(JSON.parse(q));
    const p = localStorage.getItem('tilingPricing');
    if (p) setPricing(JSON.parse(p));
  }, []);

  const adhesiveCoverage = { '3': 8, '6': 5.5, '10': 3.3, '12': 3.3 };

  const calculateTotals = () => {
    let area = 0, adhesive = 0, grout = 0, cement = 0, antiCrack = 0, tank = 0, trim = 0, notesTotal = 0;
    rooms.forEach(r => {
      const a = parseFloat(r.length || 0) * parseFloat(r.width || 0);
      area += a;
      if (a > 0) {
        adhesive += a / adhesiveCoverage[r.trowelSize];
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
      }
      // Add up additional costs from room notes
      if (r.notesPrice) {
        notesTotal += parseFloat(r.notesPrice || 0);
      }
    });
    const adhesiveBags = Math.ceil(adhesive * 1.2);
    const groutBags = Math.ceil((grout / 2.5) * 1.2);
    const cementBoards = Math.ceil(cement * 1.2);
    const tankingTubs = Math.ceil(tank * 1.2);
    const trimLengths = Math.ceil(trim / 2.5);
    
    // Calculate labour based on type (m2 or day rate)
    const labourCost = labour.type === 'm2' 
      ? area * parseFloat(labour.m2Rate || 0) 
      : parseFloat(labour.dayRate || 0) * parseFloat(labour.daysEstimate || 1);
    
    // Calculate prep work cost
    const prepCost = labour.prepWork ? parseFloat(labour.prepRate || 0) * parseFloat(labour.prepHours || 0) : 0;
    
    const baseMat = (adhesiveBags * parseFloat(pricing.adhesivePrice || 0)) + (groutBags * parseFloat(pricing.groutPrice || 0)) + (cementBoards * parseFloat(pricing.cementBoardPrice || 0)) + (antiCrack * 1.2 * parseFloat(pricing.antiCrackPrice || 0)) + (tankingTubs * parseFloat(pricing.tankingPrice || 0)) + (trimLengths * parseFloat(pricing.trimPrice || 0));
    const matCost = baseMat * (1 + parseFloat(pricing.profitMargin || 0) / 100);
    
    // Total labour includes prep work
    const totalLabourCost = labourCost + prepCost;
    
    // Final total includes materials, labour, prep, and additional costs
    const totalCost = matCost + totalLabourCost + notesTotal;
    
    return { 
      totalArea: area.toFixed(2), 
      adhesiveBags, 
      groutBags, 
      cementBoards, 
      antiCrackMembrane: antiCrack.toFixed(2), 
      tankingTubs, 
      trimLengths, 
      labourCost: labourCost.toFixed(2), 
      prepCost: prepCost.toFixed(2),
      totalLabourCost: totalLabourCost.toFixed(2),
      notesTotal: notesTotal.toFixed(2),
      materialsCost: matCost.toFixed(2), 
      profitAmount: (matCost - baseMat).toFixed(2), 
      totalCost: totalCost.toFixed(2) 
    };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded shadow mb-4">
          <div className="flex border-b">
            {[['estimate', Calculator], ['pricing', DollarSign], ['quote', FileText]].map(([p, Icon]) => (
              <button key={p} onClick={() => setPage(p)} className={`flex-1 px-4 py-3 ${page === p ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}>
                <Icon className="w-5 h-5 inline mr-2" />{p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded shadow p-3 mb-4 flex gap-2">
          <button onClick={() => { setCustomer({ name: '', address: '', phone: '', email: '' }); setRooms([{ id: 1, name: 'Room 1', length: '', width: '', surfaceType: 'floor', trowelSize: '6', useCementBoard: false, useAntiCrack: false, useTanking: false, useGroutCalc: false, tileWidth: '', tileHeight: '', groutWidth: '3', tileThickness: '10', useTrim: false, trimLength: '', notes: '', notesPrice: '' }]); setCurrentQuoteId(null); }} className="px-3 py-2 bg-green-600 text-white rounded text-sm">
            <Plus className="w-4 h-4 inline mr-1" />New
          </button>
          <button onClick={() => { if (!customer.name) return alert('Enter name'); const q = { id: currentQuoteId || Date.now(), customer, rooms, labour, pricing, totals, date: new Date().toISOString() }; const u = currentQuoteId ? savedQuotes.map(sq => sq.id === currentQuoteId ? q : sq) : [...savedQuotes, q]; setSavedQuotes(u); localStorage.setItem('tilingQuotes', JSON.stringify(u)); if (!currentQuoteId) setCurrentQuoteId(q.id); alert('Saved!'); }} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">
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
                  <button onClick={() => { if (confirm('Delete?')) { const u = savedQuotes.filter(sq => sq.id !== q.id); setSavedQuotes(u); localStorage.setItem('tilingQuotes', JSON.stringify(u)); }}} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCustomerList && (
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-bold mb-3">Saved Customers</h2>
            {savedCustomers.map(c => (
              <div key={c.id} className="flex justify-between p-2 bg-gray-50 rounded mb-2">
                <div><div className="font-medium text-sm">{c.name}</div><div className="text-xs text-gray-600">{c.phone}</div></div>
                <div className="flex gap-2">
                  <button onClick={() => { setCustomer(c); setShowCustomerList(false); }} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Load</button>
                  <button onClick={() => { if (confirm('Delete?')) { const u = savedCustomers.filter(sc => sc.id !== c.id); setSavedCustomers(u); localStorage.setItem('tilingCustomers', JSON.stringify(u)); }}} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {page === 'estimate' && (
          <div className="space-y-4">
            <div className="bg-white rounded shadow p-4">
              <h2 className="font-semibold mb-3">Customer Details</h2>
              <div className="grid gap-3">
                <div><label className="block text-sm mb-1">Name</label><input type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} className="w-full px-2 py-1.5 border rounded" /></div>
                <div><label className="block text-sm mb-1">Address</label><input type="text" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} className="w-full px-2 py-1.5 border rounded" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-sm mb-1">Phone</label><input type="tel" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full px-2 py-1.5 border rounded" /></div>
                  <div><label className="block text-sm mb-1">Email</label><input type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} className="w-full px-2 py-1.5 border rounded" /></div>
                </div>
                <button onClick={() => { if (!customer.name) return alert('Enter name'); const c = {...customer, id: Date.now()}; const u = [...savedCustomers, c]; setSavedCustomers(u); localStorage.setItem('tilingCustomers', JSON.stringify(u)); alert('Customer saved!'); }} className="px-3 py-2 bg-orange-600 text-white rounded text-sm w-full">Save Customer</button>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h2 className="font-semibold mb-3">Labour Pricing</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-2">Pricing Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        checked={labour.type === 'm2'} 
                        onChange={() => setLabour({...labour, type: 'm2'})} 
                      />
                      <span className="text-sm">Per m²</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        checked={labour.type === 'day'} 
                        onChange={() => setLabour({...labour, type: 'day'})} 
                      />
                      <span className="text-sm">Day Rate</span>
                    </label>
                  </div>
                </div>

                {labour.type === 'm2' ? (
                  <div>
                    <label className="block text-sm mb-1">Rate per m²</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">£</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={labour.m2Rate} 
                        onChange={(e) => setLabour({...labour, m2Rate: e.target.value})} 
                        className="w-full px-2 py-1.5 border rounded" 
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Total area: {totals.totalArea}m² = £{totals.labourCost}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Day Rate</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">£</span>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={labour.dayRate} 
                          onChange={(e) => setLabour({...labour, dayRate: e.target.value})} 
                          className="w-full px-2 py-1.5 border rounded" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Estimated Days</label>
                      <input 
                        type="number" 
                        step="0.5" 
                        value={labour.daysEstimate} 
                        onChange={(e) => setLabour({...labour, daysEstimate: e.target.value})} 
                        className="w-full px-2 py-1.5 border rounded" 
                      />
                      <p className="text-xs text-gray-600 mt-1">{labour.daysEstimate} days × £{labour.dayRate} = £{totals.labourCost}</p>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t">
                  <label className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      checked={labour.prepWork} 
                      onChange={(e) => setLabour({...labour, prepWork: e.target.checked})} 
                    />
                    <span className="text-sm">Add Prep Work</span>
                  </label>
                  {labour.prepWork && (
                    <div className="bg-blue-50 p-3 rounded space-y-2">
                      <div>
                        <label className="block text-xs mb-1">Hourly Rate (£)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={labour.prepRate} 
                          onChange={(e) => setLabour({...labour, prepRate: e.target.value})} 
                          className="w-full px-2 py-1 border rounded text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Estimated Hours</label>
                        <input 
                          type="number" 
                          step="0.5" 
                          value={labour.prepHours} 
                          onChange={(e) => setLabour({...labour, prepHours: e.target.value})} 
                          className="w-full px-2 py-1 border rounded text-sm" 
                        />
                      </div>
                      <p className="text-xs text-gray-600">Total prep: £{totals.prepCost}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Rooms</h2>
                <button onClick={() => setRooms([...rooms, { id: Date.now(), name: `Room ${rooms.length + 1}`, length: '', width: '', surfaceType: 'floor', trowelSize: '6', useCementBoard: false, useAntiCrack: false, useTanking: false, useGroutCalc: false, tileWidth: '', tileHeight: '', groutWidth: '3', tileThickness: '10', useTrim: false, trimLength: '', notes: '', notesPrice: '' }])} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">
                  <Plus className="w-4 h-4 inline mr-1" />Add Room
                </button>
              </div>
              {rooms.map(r => (
                <div key={r.id} className="border rounded p-3 mb-3 bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <input type="text" value={r.name} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, name: e.target.value} : rm))} className="font-medium px-2 py-1 border rounded text-sm" />
                    {rooms.length > 1 && <button onClick={() => setRooms(rooms.filter(rm => rm.id !== r.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div><label className="text-xs">Length (m)</label><input type="number" step="0.01" value={r.length} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, length: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" /></div>
                    <div><label className="text-xs">Width (m)</label><input type="number" step="0.01" value={r.width} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, width: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm" /></div>
                  </div>
                  <div className="mb-2">
                    <label className="text-xs">Surface</label>
                    <select value={r.surfaceType} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, surfaceType: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm">
                      <option value="floor">Floor</option>
                      <option value="wall">Wall</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="text-xs">Trowel Size</label>
                    <select value={r.trowelSize} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, trowelSize: e.target.value} : rm))} className="w-full px-2 py-1 border rounded text-sm">
                      <option value="3">3mm</option>
                      <option value="6">6mm</option>
                      <option value="10">10mm</option>
                      <option value="12">12mm</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    {r.surfaceType === 'floor' && (
                      <>
                        <label className="flex items-center gap-2 text-xs">
                          <input type="checkbox" checked={r.useCementBoard} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useCementBoard: e.target.checked} : rm))} />
                          Cement Board
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <input type="checkbox" checked={r.useAntiCrack} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useAntiCrack: e.target.checked} : rm))} />
                          Anti-Crack Membrane
                        </label>
                      </>
                    )}
                    {r.surfaceType === 'wall' && (
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={r.useTanking} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useTanking: e.target.checked} : rm))} />
                        Tanking
                      </label>
                    )}
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={r.useGroutCalc} onChange={(e) => setRooms(rooms.map(rm => rm.id === r.id ? {...rm, useGroutCalc: e.target.checked} : rm))} />
                      Advanced Grout Calculation
                    </label>
                    {r.useGroutCalc && (
                      <div className="bg-yellow-50 p-2 rounded">
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
                {parseFloat(totals.prepCost) > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Prep Work</div><div className="font-bold">£{totals.prepCost}</div></div>}
                {parseFloat(totals.notesTotal) > 0 && <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Extra Work</div><div className="font-bold">£{totals.notesTotal}</div></div>}
                <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Materials</div><div className="font-bold">£{totals.materialsCost}</div></div>
                <div className="bg-white p-2 rounded"><div className="text-xs text-gray-600">Labour</div><div className="font-bold">£{totals.totalLabourCost}</div></div>
                <div className="bg-white p-2 rounded col-span-2"><div className="text-xs text-gray-600">Total</div><div className="font-bold text-green-600 text-lg">£{totals.totalCost}</div></div>
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
              {[['adhesivePrice', 'Adhesive (20kg)'], ['groutPrice', 'Grout (2.5kg)'], ['cementBoardPrice', 'Cement Board'], ['antiCrackPrice', 'Anti-Crack (m²)'], ['tankingPrice', 'Tanking (tub)'], ['trimPrice', 'Tile Trim (2.5m)'], ['wastePercentage', 'Waste % (10-30)'], ['profitMargin', 'Profit Margin (%)']].map(([k, l]) => (
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
${totals.cementBoards > 0 ? `Cement Boards: ${totals.cementBoards} @ £${pricing.cementBoardPrice}\n` : ''}${parseFloat(totals.antiCrackMembrane) > 0 ? `Anti-Crack: ${totals.antiCrackMembrane}m² @ £${pricing.antiCrackPrice}\n` : ''}${totals.tankingTubs > 0 ? `Tanking: ${totals.tankingTubs} tubs @ £${pricing.tankingPrice}\n` : ''}${totals.trimLengths > 0 ? `Tile Trim: ${totals.trimLengths} x 2.5m @ £${pricing.trimPrice}\n` : ''}
Materials: £${totals.materialsCost}
${labour.type === 'm2' ? `Tiling Labour: ${totals.totalArea}m² @ £${labour.m2Rate}/m² = £${totals.labourCost}` : `Tiling Labour: ${labour.daysEstimate} days @ £${labour.dayRate}/day = £${totals.labourCost}`}
${parseFloat(totals.prepCost) > 0 ? `Prep Work: ${labour.prepHours} hours @ £${labour.prepRate}/hr = £${totals.prepCost}\n` : ''}${parseFloat(totals.notesTotal) > 0 ? `Extra Work: £${totals.notesTotal}\n` : ''}Total Labour: £${totals.totalLabourCost}

TOTAL: £${totals.totalCost}

${rooms.filter(r => r.notes).map(r => `${r.name}: ${r.notes}${r.notesPrice ? ` (£${r.notesPrice})` : ''}`).join('\n')}

(Includes ${pricing.wastePercentage}% waste allowance)`}</div>
            <div className="flex gap-2">
              <button onClick={() => window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Quote: £${totals.totalCost}`)}`, '_blank')} className="px-4 py-2 bg-green-600 text-white rounded text-sm"><MessageCircle className="w-4 h-4 inline mr-1" />WhatsApp</button>
              <button onClick={() => window.location.href = `mailto:${customer.email}?subject=Quote&body=${encodeURIComponent(`Total: £${totals.totalCost}`)}`} className="px-4 py-2 bg-blue-600 text-white rounded text-sm"><Mail className="w-4 h-4 inline mr-1" />Email</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
