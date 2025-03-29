import { useEffect, useState } from "react";
import { getLettersFromDrive } from "../utils/driveUtils";
import { Link } from "react-router-dom";

const Home = () => {
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLetters() {
      setLoading(true);
      try {
        const savedLetters = await getLettersFromDrive();
        setLetters(savedLetters);
      } catch (error) {
        console.error("Error fetching letters:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLetters();
  }, []);

  return (

    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-2xl rounded-lg">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        📄 Saved Letters
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center text-lg">Loading letters...</p>
      ) : letters.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No letters found in your Google Drive.</p>
      ) : (
        <ul className="space-y-4">
          {letters.map((letter) => (
            <li key={letter.id} className="p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100">
              <a
                href={`https://docs.google.com/document/d/${letter.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-lg font-medium"
              >
                {letter.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/editor"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow-md"
      >
        ➕ Create New Letter
      </Link>
    </div>
  );
};

export default Home;
