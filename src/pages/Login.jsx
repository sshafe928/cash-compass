import lock from '../assets/images/lockbg.webp';
import background from '../assets/images/img1.jfif';

const Login = () => {
    return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-cover bg-no-repeat filter blur-lg" style={{ backgroundImage: `url(${background})` }}></div>

        <div className="relative flex w-11/12 max-w-4xl bg-white bg-opacity-10 border border-white/20 rounded-xl shadow-lg overflow-hidden">
            {/* Form Container */}
            <div className="flex-1 p-10 flex flex-col justify-center items-center text-center">
                <h2 className="mb-5 text-2xl text-dark-blue font-semibold uppercase">Login</h2>
                <form className="w-80">
                    <label htmlFor="email" className="block text-sm text-gray-700 font-semibold text-left mb-1">Email:</label>
                    <input type="email" id="email" name="email" required placeholder="Enter your email" className="w-full py-2 px-3 mb-4 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"/>

                    <label htmlFor="password" className="block text-sm text-gray-700 font-semibold text-left mb-1">Password:</label>
                    <input type="password" id="password" name="password" required placeholder="Enter your password" className="w-full py-2 px-3 mb-4 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"/>

                    <button type="submit" className="w-full p-2 mt-6 bg-dark-blue text-white rounded-full hover:bg-hl-blue hover:text-dark-blue transition">Login</button>
                </form>

                <p className="mt-4 text-sm text-gray-600">
                    Don't have an account?
                    <a href="/signup" className="text-blue-500 hover:underline"> Sign up here</a>
                </p>
            </div>

            {/* Image Container (Hidden on Small Screens) */}
            <div className="hidden md:flex flex-1 bg-blue-50 justify-center items-center">
                <img src={lock} alt="Secure Login" className="w-full h-full object-cover rounded-r-xl" />
            </div>
        </div>
    </div>
    );
};

export default Login;
