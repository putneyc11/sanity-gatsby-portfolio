import React, {createContext, useContext, useEffect, useMemo, useState} from 'react'

const STORAGE_KEY = 'lfs-cart-v1'

const CartContext = createContext(null)

export function CartProvider ({children}) {
  const [items, setItems] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch (err) {
      // Corrupt or unavailable storage; start with an empty cart.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      // Storage full or blocked; cart still works for this session.
    }
  }, [items, hydrated])

  const value = useMemo(() => {
    const addItem = (product, quantity = 1, personalization = '') => {
      setItems(prev => {
        const existing = prev.find(item => item.id === product.id && item.personalization === personalization)
        if (existing) {
          return prev.map(item =>
            item === existing ? {...item, quantity: item.quantity + quantity} : item
          )
        }
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            wood: product.wood,
            weightOz: product.weightOz,
            tone: product.tone,
            art: product.art,
            quantity,
            personalization
          }
        ]
      })
    }

    const updateQuantity = (id, personalization, quantity) => {
      setItems(prev =>
        quantity < 1
          ? prev.filter(item => !(item.id === id && item.personalization === personalization))
          : prev.map(item =>
            item.id === id && item.personalization === personalization ? {...item, quantity} : item
          )
      )
    }

    const removeItem = (id, personalization) => {
      setItems(prev => prev.filter(item => !(item.id === id && item.personalization === personalization)))
    }

    const clearCart = () => setItems([])

    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {items, count, subtotal, addItem, updateQuantity, removeItem, clearCart}
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart () {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export function formatPrice (cents) {
  return (cents / 100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
}
