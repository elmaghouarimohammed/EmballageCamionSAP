import { Link, useLocation } from 'react-router-dom';

const titles = {
  '/emballages': 'EmballageCamionSAP — Calcul poids emballages',
  '/difference': 'EmballageCamionSAP — Calcul de différence de poids',
};

export default function Navbar() {
  const { pathname } = useLocation();
  const title = titles[pathname] || 'EmballageCamionSAP';

  return (
    <div className="sap-title-bar sap-title-bar-with-back">
      <Link to="/" className="sap-back-btn" title="Retour à l'accueil">
        &lt;
      </Link>
      <span>{title}</span>
    </div>
  );
}
