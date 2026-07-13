import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import Header from '../../components/header/header';

function NotFoundPage() {
  return (
    <div className="page page--gray">
      <Header />
      <main className="page__main">
        <div className="container">
          <h1>404 Not Found</h1>
          <p>Page not found.</p>
          <Link to={AppRoute.Main}>Go to main page</Link>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
