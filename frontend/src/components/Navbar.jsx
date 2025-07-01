import '../css/Navbar.css';

function Navbar({ onClear }) {
  return (
    <header className="App-header">
      <img className='navImg' src="logoKeyAI1-nobg.png" alt="logoKeyAI" />
      <button onClick={onClear}>
        🗑️ Limpiar Chat
      </button>
    </header>
  );
}

export default Navbar;