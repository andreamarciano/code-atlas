import { useParams } from "react-router-dom";

import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LanguagePage() {
  const { name } = useParams<{ name: string }>();

  return (
    <>
      <Topbar />
      <Navbar />
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold">Language: {name}</h2>
      </div>
      <Footer />
    </>
  );
}

export default LanguagePage;
