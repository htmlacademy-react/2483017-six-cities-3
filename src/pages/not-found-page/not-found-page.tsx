function NotFoundPage(): JSX.Element {
  return (
    <div className="page page--gray">
      <main className="page__main">
        <div className="container">
          <h1>404 Not Found</h1>
          <p>Page not found.</p>
          <a href="/">Go to main page</a>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
