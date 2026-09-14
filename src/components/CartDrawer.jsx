import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCartWhatsAppMessage, openWhatsApp, WHATSAPP_PHONE_DISPLAY } from '../utils/whatsapp';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    rawCartSubtotal,
    cartSubtotal,
    shippingFee,
    cartTotal,
    freeShippingThreshold,
    freeShippingProgress,
    freeShippingDifference,
    navigateTo,
    showToast,
    userLocation,
    openWhatsAppModal
  } = useShop();

  const [copied, setCopied] = useState(false);

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleProceedToWhatsApp = () => {
    if (cart.length === 0) return;

    openWhatsAppModal({
      type: 'cart',
      data: {
        cart,
        rawCartSubtotal,
        cartSubtotal,
        shippingFee,
        formatPrice,
        userLocation
      }
    });
  };

  const handleCopyOrderText = () => {
    if (cart.length === 0) return;

    const message = formatCartWhatsAppMessage({
      cart,
      rawCartSubtotal,
      cartSubtotal,
      shippingFee,
      formatPrice,
      userLocation
    });

    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      showToast('Order summary copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      showToast('Unable to copy order text', 'error');
    });
  };

  return (
    <div className="fixed inset-x-0 top-14 bottom-0 z-[55] overflow-hidden lg:top-16">
      {/* Backdrop — below navbar, not full screen */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 top-14 right-0 bottom-0 max-w-full flex lg:top-16">
        <div className="w-full max-w-[min(100vw,28rem)] bg-white text-[#1E141B] shadow-2xl flex flex-col justify-between animate-slide-in-right border-l border-stone-200 pb-safe font-semibold h-full">
          
          {/* Drawer Header (Solid Luxury Violet Accent) */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#7A0648] text-white">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={1.8} />
              <h2 className="text-sm sm:text-base font-bold tracking-wider text-white uppercase">Your Shopping Bag</h2>
              <span className="text-[10px] sm:text-[11px] bg-white text-[#7A0648] px-2 py-0.5 rounded-none font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-white hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden">

            {/* Items List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-3.5 sm:p-5 space-y-3.5 divide-y divide-stone-200">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-none bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-7 h-7" strokeWidth={1.25} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base uppercase tracking-wider font-bold text-[#1E141B]">Your bag is currently empty</p>
                    <p className="text-xs text-stone-600 font-medium">Explore our luxury abayas and seasonal collections.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('shop');
                    }}
                    className="btn-primary inline-block mt-3 !bg-[#7A0648] !text-white hover:!bg-[#68043D] border border-[#7A0648] font-bold"
                  >
                    Explore Boutique
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="pt-3.5 first:pt-0 flex items-center gap-3 w-full min-w-0">
                    {/* Product Thumbnail with fixed constraints */}
                    <div
                      className="w-16 h-20 sm:w-20 sm:h-24 rounded-none bg-stone-100 overflow-hidden shrink-0 border border-stone-200 relative shadow-xs cursor-pointer"
                      onClick={() => { setIsCartOpen(false); navigateTo('product-detail', item.productId); }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-1.5">
                          <h3
                            className="text-xs sm:text-[13px] uppercase tracking-wide font-bold text-[#1E141B] hover:text-[#7A0648] transition-colors cursor-pointer leading-tight truncate"
                            onClick={() => { setIsCartOpen(false); navigateTo('product-detail', item.productId); }}
                            title={item.name}
                          >
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-red-600 transition-colors p-0.5 shrink-0 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] uppercase text-stone-600 font-semibold">
                          <span className="bg-[#F5EAF1] text-[#7A0648] px-1.5 py-0.5 rounded-none font-bold truncate max-w-[200px] border border-[#7A0648]/20">
                            {item.size}
                          </span>
                          {item.color && (
                            <span className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded-none font-semibold">
                              {item.color}
                            </span>
                          )}
                          {item.style && (
                            <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-none font-medium">
                              {item.style}
                            </span>
                          )}
                          {item.work && (
                            <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-none font-medium">
                              {item.work}
                            </span>
                          )}
                          {item.product?.wholesaleType && (
                            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-none font-bold">
                              Wholesale: {item.product.wholesaleType}
                            </span>
                          )}
                          {item.product?.subcategory && (
                            <span className="bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded-none font-medium">
                              {item.product.subcategory}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-2 gap-2">
                        <div className="flex items-center border border-stone-300 rounded-none bg-white text-[#1E141B] shrink-0">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <span className="px-1.5 text-xs font-bold text-[#1E141B]">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-[#7A0648] tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[9px] text-stone-500 tabular-nums font-medium">
                              {formatPrice(item.price)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & WhatsApp Order Controls */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF8F5] space-y-3 text-[#1E141B] font-semibold">
                
                {/* Pricing Breakdown */}
                <div className="space-y-1 text-xs text-stone-600 uppercase tracking-wide font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1E141B]">{formatPrice(rawCartSubtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <span>Estimated Shipping</span>
                      {userLocation?.country && (
                        <span className="text-[10px] text-stone-700 bg-white px-1.5 py-0.5 rounded-none border border-stone-200 inline-flex items-center gap-1 font-semibold">
                          <span>{userLocation.flag}</span>
                          <span className="truncate max-w-[80px]">{userLocation.countryCode === 'IN' ? 'India' : userLocation.country}</span>
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-[#1E141B]">
                      {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  {shippingFee > 0 && freeShippingDifference > 0 && (
                    <div className="pt-1">
                      <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                        <span>Free delivery progress</span>
                        <span>{freeShippingProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7A0648] transition-all duration-300"
                          style={{ width: `${freeShippingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-bold text-[#7A0648] pt-2 border-t border-stone-200 tabular-nums">
                    <span>Estimated Total</span>
                    <span>
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Proceed to WhatsApp Button */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleProceedToWhatsApp}
                    className="w-full py-3.5 bg-[#7A0648] hover:bg-[#68043D] text-white text-xs uppercase tracking-[0.14em] font-bold transition-all duration-200 flex items-center justify-center gap-2.5 rounded-none active:scale-[0.99] group cursor-pointer shadow-md border border-[#7A0648]"
                  >
                    <svg
                      className="w-4 h-4 fill-current shrink-0 text-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Proceed to WhatsApp Checkout</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 pt-1">
                    <button
                      onClick={handleCopyOrderText}
                      className="inline-flex items-center gap-1 text-[#7A0648] hover:text-[#68043D] transition-colors underline cursor-pointer uppercase tracking-wider text-[10px] font-bold"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" strokeWidth={2} />
                          <span className="text-emerald-600 font-bold">Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" strokeWidth={1.5} />
                          <span>Copy Order Text</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider">WhatsApp: {WHATSAPP_PHONE_DISPLAY}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7A0648]" strokeWidth={1.5} />
                  <span>Bespoke Atelier • Handcrafted Quality</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
