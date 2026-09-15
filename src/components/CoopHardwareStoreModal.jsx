import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const CoopHardwareStoreModal = ({ isOpen, onClose }) => {
  const { wholesaleCatalog, activeCityConfig, cooperativeInfo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderedItems, setOrderedItems] = useState({});

  if (!isOpen) return null;

  const categories = ['All', 'Electrical', 'Plumbing', 'Tools'];
  const filteredItems = (wholesaleCatalog || []).filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleOrder = (itemId) => {
    setOrderedItems((prev) => ({ ...prev, [itemId]: true }));
    soundEffects.playSuccessChime();
    setTimeout(() => {
      setOrderedItems((prev) => ({ ...prev, [itemId]: false }));
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl w-full max-w-2xl shadow-2xl border border-surface-variant/40 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Cooperative Wholesale Hardware & Tool Depot</h3>
              <p className="text-[11px] text-amber-300">
                Direct Manufacturer Wholesale • Revenue Pillar #2
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Store Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Revenue & Margin Explain Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-amber-700 shrink-0 mt-0.5">
              savings
            </span>
            <div>
              <span className="font-bold block text-xs">
                How SAHYOG Generates Sustainable Revenue Without Taking Worker Commission:
              </span>
              <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                By purchasing certified ISI wires, switches, and power tools in bulk directly from manufacturers (Havells, Polycab, Schneider), the Cooperative passes <strong>20-30% discounts to workers</strong> while earning a <strong>5-10% trade volume margin</strong> to fund operations and mutual insurance.
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-low rounded-2xl p-3 border border-surface-variant/40 flex flex-col justify-between gap-3 shadow-2xs hover:border-primary/40 transition-all"
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-surface-variant/40 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] bg-primary/10 text-primary font-black px-1.5 py-0.2 rounded uppercase">
                      {item.badge}
                    </span>
                    <h4 className="font-bold text-xs text-on-surface line-clamp-2 mt-1">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                      Brand: {item.brand}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-variant/30 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-black text-primary">₹{item.coopPrice}</span>
                      <span className="text-xs text-outline line-through ml-1.5">₹{item.mrp}</span>
                      <span className="text-[10px] text-emerald-700 font-bold ml-1">
                        ({item.discountPercent}% OFF)
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-black">
                      +₹{item.coopMargin} Co-op Margin
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOrder(item.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                      orderedItems[item.id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary hover:bg-primary-container text-white active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {orderedItems[item.id] ? 'check_circle' : 'shopping_bag'}
                    </span>
                    <span>{orderedItems[item.id] ? 'Requisition Dispatched!' : 'Order at Wholesale Rate'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-low border-t border-surface-variant/30 flex items-center justify-between">
          <span className="text-[11px] text-on-surface-variant font-medium">
            Depot: <strong>{activeCityConfig?.name || 'Sultanpur'} Cooperative Central Hub</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface transition-colors"
          >
            Close Store
          </button>
        </div>
      </div>
    </div>
  );
};
