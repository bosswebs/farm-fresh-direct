import { useEffect, useState } from "react";
import { ShoppingBag, Trash2, X, Plus, Minus, Send, MessageCircle } from "lucide-react";
import { listCart, removeFromCart, updateCartQuantity, clearCart, subscribeCart, type CartItem } from "@/lib/cart-store";
import { formatRWF, WHATSAPP_LINK } from "@/lib/products-store";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type OrderType = "Retail" | "Wholesale" | "Institutional" | "Subscription";

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("Retail");
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    setCart(listCart());
    return subscribeCart(() => {
      setCart(listCart());
    });
  }, []);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    let message = `Hello Deacomart Ltd! I would like to place an order.\n\n`;
    message += `*Order Details:*\n`;
    message += `• Type: ${orderType}\n`;
    if (customerName) message += `• Name: ${customerName}\n`;
    if (address) message += `• Delivery Location: ${address}\n`;
    message += `\n*Items:*\n`;

    cart.forEach((item) => {
      message += `- ${item.quantity}x ${item.product.name} (${formatRWF(item.product.price)} / ${item.product.unit}) - Subtotal: ${formatRWF(item.product.price * item.quantity)}\n`;
    });

    message += `\n*Total Value: ${formatRWF(total)}*\n\n`;
    message += `Please confirm the order and arrange delivery. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`${WHATSAPP_LINK}?text=${encoded}`, "_blank");
    clearCart();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-[var(--shadow-glow)] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-leaf" />
            <h2 className="font-display font-bold text-lg text-foreground">Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-4 font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Browse our shop to add fresh items.</p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 rounded-xl border border-border bg-background">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatRWF(item.product.price)} / {item.product.unit}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md border border-border bg-card flex items-center justify-center hover:border-leaf text-xs font-semibold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md border border-border bg-card flex items-center justify-center hover:border-leaf text-xs font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-sm text-primary">{formatRWF(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Options Form */}
              <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider">Order Preferences</h3>
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Order Type</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {(["Retail", "Wholesale", "Institutional", "Subscription"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                          orderType === type
                            ? "bg-primary/15 border-primary text-primary"
                            : "border-border hover:border-leaf bg-card"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input mt-1.5"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Delivery District & Address</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Nyarugenge District, Kigali, Gitega Sector"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input resize-none mt-1.5"
                  />
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-border bg-secondary/40 rounded-b-3xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display font-bold text-xl text-primary">{formatRWF(total)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={!customerName || !address}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-5 h-5" />
              Checkout via WhatsApp
            </button>
            <p className="text-[11px] text-muted-foreground text-center mt-2.5">
              Generates a WhatsApp message to complete verification. Payment instructions will follow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
