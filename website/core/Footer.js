const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="copyright">Copyright © {new Date().getFullYear()} Gotify</section>
      </footer>
    );
  }
}

module.exports = Footer;
