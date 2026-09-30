import { useMemo, useState } from 'react'
import './App.css'

const GST_RATE = 0.18

const coupons = {
  SAVE10: 10,
  WELCOME15: 15,
}

const products = [
  {
    id: 'headphones',
    name: 'Studio wireless headphones',
    category: 'Audio',
    price: 7499,
    note: 'Quiet comfort, all day',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    alt: 'Black over-ear headphones on a warm neutral background',
  },
  {
    id: 'watch',
    name: 'Everyday analogue watch',
    category: 'Accessories',
    price: 5299,
    note: 'A little less, but better',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    alt: 'Minimal wristwatch with a light dial',
  },
  {
    id: 'sneakers',
    name: 'Court classic sneakers',
    category: 'Footwear',
    price: 6199,
    note: 'Made for the long way home',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    alt: 'Red athletic sneaker photographed from above',
  },
  {
    id: 'bottle',
    name: 'Insulated steel bottle',
    category: 'Home',
    price: 1499,
    note: 'Cold stays cold for 24 hours',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',
    alt: 'Reusable water bottle in a clean studio setting',
  },
  {
    id: 'backpack',
    name: 'Day trip canvas backpack',
    category: 'Carry',
    price: 3899,
    note: 'Room for the in-between',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    alt: 'Durable backpack ready for a day trip',
  },
  {
    id: 'camera',
    name: 'Pocket film camera',
    category: 'Tech',
    price: 8999,
    note: 'Keep the good bits in focus',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
    alt: 'Compact camera with a lens facing forward',
  },
]

const categories = ['All items', ...new Set(products.map((product) => product.category))]
const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
})

function App() {
  const [cart, setCart] = useState({})
  const [activeCategory, setActiveCategory] = useState('All items')
  const [search, setSearch] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponMessage, setCouponMessage] = useState('')
  const [orderMessage, setOrderMessage] = useState('')

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All items' || product.category === activeCategory
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({ ...product, quantity: cart[product.id] }))
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = appliedCoupon ? subtotal * (appliedCoupon.percent / 100) : 0
  const taxableTotal = subtotal - discount
  const gst = taxableTotal * GST_RATE
  const grandTotal = taxableTotal + gst

  function addToCart(productId) {
    setCart((currentCart) => ({
      ...currentCart,
      [productId]: (currentCart[productId] || 0) + 1,
    }))
    setOrderMessage('')
  }

  function updateQuantity(productId, quantity) {
    setCart((currentCart) => {
      const nextCart = { ...currentCart }
      if (quantity < 1) delete nextCart[productId]
      else nextCart[productId] = quantity
      return nextCart
    })
    setOrderMessage('')
  }

  function applyCoupon(event) {
    event.preventDefault()
    const code = couponInput.trim().toUpperCase()
    if (!code) {
      setCouponMessage('Enter a coupon code to apply it.')
      return
    }
    if (!coupons[code]) {
      setAppliedCoupon(null)
      setCouponMessage('That code is not valid. Try SAVE10 or WELCOME15.')
      return
    }
    setAppliedCoupon({ code, percent: coupons[code] })
    setCouponInput(code)
    setCouponMessage(`${code} applied: ${coupons[code]}% off your items.`)
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponMessage('Coupon removed.')
  }

  function placeDemoOrder() {
    if (!itemCount) return
    setOrderMessage('Order placed. Thanks for shopping with Common Goods.')
    setCart({})
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponMessage('')
  }

  return (
    <div className="storefront">
      <div className="announcement">
        <span>Thoughtful things for everyday living</span>
        <span>Free delivery on orders over ₹5,000</span>
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Common Goods home">
          <span className="brand-mark" aria-hidden="true">c.</span>
          <span>common goods</span>
        </a>
        <label className="search-box">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="visually-hidden">Search products</span>
          <input
            type="search"
            placeholder="Search the collection"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <a className="header-cart" href="#your-cart">
          Your bag <span className="cart-count">{itemCount}</span>
        </a>
      </header>

      <main id="top" className="page-content">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">The considered collection / No. 05</p>
            <h1 id="page-title">Good things, chosen well.</h1>
            <p className="intro-copy">Useful objects, made to be used. Find your next everyday favourite.</p>
          </div>
          <p className="collection-count">{visibleProducts.length} considered essentials</p>
        </section>

        <div className="shop-layout">
          <section className="catalog" aria-label="Product catalog">
            <div className="catalog-toolbar">
              <div className="category-list" aria-label="Filter by category">
                {categories.map((category) => (
                  <button
                    className={`category-button${activeCategory === category ? ' is-active' : ''}`}
                    key={category}
                    type="button"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <span className="catalog-label">AUTUMN / WINTER 2026</span>
            </div>

            {visibleProducts.length ? (
              <div className="product-grid">
                {visibleProducts.map((product, index) => (
                  <article className="product-card" key={product.id}>
                    <div className={`product-image image-tone-${index % 4}`}>
                      <img src={product.image} alt={product.alt} loading="lazy" />
                      <span className="product-category">{product.category}</span>
                    </div>
                    <div className="product-details">
                      <div className="product-heading">
                        <h2>{product.name}</h2>
                        <span className="product-price">{currency.format(product.price)}</span>
                      </div>
                      <p>{product.note}</p>
                      <button className="add-button" type="button" onClick={() => addToCart(product.id)}>
                        <span aria-hidden="true">+</span> Add to bag
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-search">
                <h2>No items found</h2>
                <p>Try another search or choose a different category.</p>
                <button className="text-button" type="button" onClick={() => { setSearch(''); setActiveCategory('All items') }}>
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <aside className="cart-panel" id="your-cart" aria-labelledby="cart-title">
            <div className="cart-heading">
              <div>
                <p className="eyebrow">Your selection</p>
                <h2 id="cart-title">Your bag <span>({itemCount})</span></h2>
              </div>
              <span className="bag-icon" aria-hidden="true">▱</span>
            </div>

            {cartItems.length ? (
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li className="cart-item" key={item.id}>
                    <img src={item.image} alt="" />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>{currency.format(item.price)}</p>
                      <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                        <button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-end">
                      <strong>{currency.format(item.price * item.quantity)}</strong>
                      <button className="remove-button" type="button" aria-label={`Remove ${item.name} from bag`} onClick={() => updateQuantity(item.id, 0)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-cart">
                <span className="empty-bag-icon" aria-hidden="true">▱</span>
                <p>Your bag is waiting for something good.</p>
                <a href="#top">Explore the collection <span aria-hidden="true">→</span></a>
              </div>
            )}

            <form className="coupon-form" onSubmit={applyCoupon}>
              <label htmlFor="coupon-code">Have a coupon?</label>
              <div className="coupon-control">
                <input
                  id="coupon-code"
                  type="text"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  disabled={Boolean(appliedCoupon)}
                />
                {appliedCoupon ? (
                  <button type="button" onClick={removeCoupon}>Remove</button>
                ) : (
                  <button type="submit">Apply</button>
                )}
              </div>
              <p className={`coupon-message${appliedCoupon ? ' is-success' : ''}`} aria-live="polite">
                {couponMessage || 'Try SAVE10 or WELCOME15'}
              </p>
            </form>

            <div className="totals" aria-live="polite">
              <div className="total-row"><span>Subtotal</span><span>{currency.format(subtotal)}</span></div>
              {appliedCoupon && (
                <div className="total-row discount-row">
                  <span>Discount ({appliedCoupon.percent}%)</span><span>−{currency.format(discount)}</span>
                </div>
              )}
              <div className="total-row"><span>GST (18%)</span><span>{currency.format(gst)}</span></div>
              <div className="total-row grand-total"><strong>Total</strong><strong>{currency.format(grandTotal)}</strong></div>
              <p className="tax-note">GST is calculated after discounts.</p>
            </div>

            {orderMessage && <p className="order-message" role="status">{orderMessage}</p>}
            <button className="checkout-button" type="button" disabled={!itemCount} onClick={placeDemoOrder}>
              {itemCount ? 'Place demo order' : 'Your bag is empty'}
              {Boolean(itemCount) && <span>{currency.format(grandTotal)} <span aria-hidden="true">→</span></span>}
            </button>
            <p className="secure-note">A considered choice. A lighter footprint.</p>
          </aside>
        </div>
      </main>
      <footer className="site-footer">
        <span>common goods</span>
        <span>Made for the everyday, since 2026</span>
      </footer>
    </div>
  )
}

export default App