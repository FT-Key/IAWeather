import '../css/Navbar.css';

function Navbar({ onClear }) {
  return (
    <header className="App-header">
      <h1>🤖 KeyAI</h1>
      <button onClick={onClear}>
        🗑️ Limpiar Chat
      </button>
    </header>
  );
}

export default Navbar;