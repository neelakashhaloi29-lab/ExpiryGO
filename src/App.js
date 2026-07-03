function App() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Expiry Tracker</h1>

      <input
        type="text"
        placeholder="Product name"
      />

      <br /><br />

      <input type="date" />

      <br /><br />

      <button>Add Product</button>
    </div>
  )
}

export default App