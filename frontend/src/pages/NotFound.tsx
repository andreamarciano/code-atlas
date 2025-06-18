import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotFound() {
  return (
    <>
      <Topbar />
      <Navbar />
      <div className="flex flex-col gap-4 m-4">
        <h1 className="text-3xl">404 - Page Not Found</h1>
        <p>Oops! The page you are looking for does not exist.</p>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
