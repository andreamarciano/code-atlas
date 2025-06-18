import { useParams } from "react-router-dom";

function LanguagePage() {
  const { name } = useParams<{ name: string }>();

  return (
    <>
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold">Language: {name}</h2>
      </div>
    </>
  );
}

export default LanguagePage;
