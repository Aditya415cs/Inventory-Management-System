import "./customer.css";

import React, { useState } from "react";

const products = [
  { id: 1, name: "Solar Mount Frame", price: 5000 },
  { id: 2, name: "Rooftop Solar Kit", price: 25000 },
  { id: 3, name: "Ground Mount Structure", price: 40000 },
];

const CustomerStore = () => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // ➕ Add to cart
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // ➖ Remove
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // 💰 Total
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 🛒 Checkout
  const checkout = () => {
    if (cart.length === 0) return;

    setOrders([...orders, ...cart]);
    setCart([]);
    alert("Order placed successfully!");
  };

  return (
    <div className="store-layout">
      {/* LEFT PROFILE */}
      <div className="profile">
        <h2>👤 Profile</h2>
        <p>Name: Aditya</p>
        <p>Email: user@email.com</p>
        <p>Orders: {orders.length}</p>
      </div>

      {/* MAIN STORE */}
      <div className="store">
        <h1>🌞 SunMount Store</h1>

        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>

              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CART */}
      <div className="cart">
        <h2>🛒 Cart</h2>

        {cart.length === 0 ? (
          <p>No items</p>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <p>{item.name}</p>
                <p>Qty: {item.qty}</p>
                <p>₹{item.price * item.qty}</p>

                <button onClick={() => removeFromCart(item.id)}>❌</button>
              </div>
            ))}

            <h3>Total: ₹{total}</h3>

            <button className="checkout" onClick={checkout}>
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerStore;
