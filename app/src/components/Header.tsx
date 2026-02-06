import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>AsP</h1>
          <span className="tagline">Achin Smart Payment</span>
        </div>
        <nav className="nav">
          <a href="https://github.com/achinsahu" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
