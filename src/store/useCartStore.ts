import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    store_name?: string;
}

interface CartStore {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string | number) => void;
    updateQuantity: (itemId: string | number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);
                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, item] });
                }
            },
            removeFromCart: (itemId) => {
                set({ items: get().items.filter((i) => i.id !== itemId) });
            },
            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(itemId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'traemelo-cart',
        }
    )
);
