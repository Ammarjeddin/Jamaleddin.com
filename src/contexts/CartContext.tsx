"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { Product, CartItem } from "@/lib/types/product";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; variantId?: string } }
  | { type: "REMOVE_ITEM"; payload: { productSlug: string; variantId?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productSlug: string; quantity: number; variantId?: string } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const CART_STORAGE_KEY = "site-template-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, variantId } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.slug === product.slug && item.variantId === variantId
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...state.items, { product, quantity, variantId }],
      };
    }

    case "REMOVE_ITEM": {
      const { productSlug, variantId } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.product.slug === productSlug && item.variantId === variantId)
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productSlug, quantity, variantId } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.product.slug === productSlug && item.variantId === variantId)
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.slug === productSlug && item.variantId === variantId
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "LOAD_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  removeItem: (productSlug: string, variantId?: string) => void;
  updateQuantity: (productSlug: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (productSlug: string, variantId?: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        dispatch({ type: "LOAD_CART", payload: items });
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state.items]);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.pricing.price * item.quantity,
    0
  );

  const addItem = useCallback((product: Product, quantity = 1, variantId?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, variantId } });
  }, []);

  const removeItem = useCallback((productSlug: string, variantId?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productSlug, variantId } });
  }, []);

  const updateQuantity = useCallback((productSlug: string, quantity: number, variantId?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productSlug, quantity, variantId } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: "TOGGLE_CART" });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: "OPEN_CART" });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: "CLOSE_CART" });
  }, []);

  const getItemQuantity = useCallback(
    (productSlug: string, variantId?: string) => {
      const item = state.items.find(
        (i) => i.product.slug === productSlug && i.variantId === variantId
      );
      return item?.quantity ?? 0;
    },
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
