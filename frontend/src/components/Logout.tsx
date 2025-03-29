const Logout = () => {
    const handleLogout = () => {
      window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, "_self");
    };
  
    return (
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Logout
      </button>
    );
  };
  
  export default Logout;
  