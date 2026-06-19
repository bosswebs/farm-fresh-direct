import { type Product } from "./products-store";

export type CartItem = {
  product: Product;
  quantity: number;
};

const CART_KEY = "deacomart.cart.v1";

export function listCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) as CartItem[] : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("agrimarket:cart-changed"));
}

export function addToCart(product: Product, quantity = 1) {
  const cart = listCart();
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  saveCart(cart);
}

export function removeFromCart(productId: string) {
  const cart = listCart().filter((item) => item.product.id !== productId);
  saveCart(cart);
}

export function updateCartQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = listCart().map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function subscribeCart(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("agrimarket:cart-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("agrimarket:cart-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
