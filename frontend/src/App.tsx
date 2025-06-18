import "./App.css";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Topbar />
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}

export default App;
