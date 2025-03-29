import { Link } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/home"><h1 className="text-lg font-bold cursor-pointer">Letter Editor</h1></Link>
      <Logout />
    </nav>
  );
};

export default Navbar;
