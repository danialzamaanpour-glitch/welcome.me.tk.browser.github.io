import SiteHeader from './components/SiteHeader';
import HeroBranded from './components/HeroBranded';
import CinematicScroll from './components/CinematicScroll';
import Services from './components/Services';
import Featured from './components/Featured';
import About from './components/About';
import OrderSection from './components/OrderSection';
import SiteFooter from './components/SiteFooter';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#services">
        رفتن به محتوای اصلی
      </a>
      <div className="grain" aria-hidden="true" />
      <SiteHeader />
      <main id="home">
        <HeroBranded />
        <CinematicScroll />
        <Services />
        <Featured />
        <About />
        <OrderSection />
      </main>
      <SiteFooter />
    </>
  );
}
