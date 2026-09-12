import { Link } from 'react-router-dom';

const tiles = [
  { to: '/emballages', title: 'Calcul emballages' },
  { to: '/difference', title: 'Différence de poids' },
];

export default function Launchpad() {
  return (
    <main className="fiori-page flex-1">
      <div className="fiori-page-header">
        <h1 className="fiori-page-title">EmballageCamionSAP</h1>
        <p className="fiori-page-subtitle">Gestion des poids camion</p>
      </div>

      <section className="fiori-section">
        <div className="fiori-tile-grid">
          {tiles.map((tile) => (
            <Link key={tile.to} to={tile.to} className="fiori-tile">
              <span className="fiori-tile-title">{tile.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
