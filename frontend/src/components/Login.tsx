const Login = () => {
  const handleGoogleLogin = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/callback`, "_self");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex justify-center items-center relative">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

      <div className="bg-gray-300 p-8 rounded-xl shadow-2xl max-w-sm w-full z-10">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">Welcome Back!</h1>
        <p className="text-gray-500 text-center mb-6">Sign in to continue to your dashboard.</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg cursor-pointer"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
