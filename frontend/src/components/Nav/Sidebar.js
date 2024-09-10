import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100 fixed">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Translator App</h1>
        </div>

        <nav className="mt-10">
          <ul>
            {/* Translator Link */}
            <li className="mb-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-6 py-3 bg-blue-500 text-white'
                    : 'flex items-center px-6 py-3 hover:bg-blue-500 hover:text-white text-gray-800 transition-colors duration-200'
                }
              >
                <span className="text-xl mr-4">🌐</span>
                <span className="text-lg">Translator</span>
              </NavLink>
            </li>

            {/* Favorites Link */}
            <li className="mb-6">
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-6 py-3 bg-blue-500 text-white'
                    : 'flex items-center px-6 py-3 hover:bg-blue-500 hover:text-white text-gray-800 transition-colors duration-200'
                }
              >
                <span className="text-xl mr-4">⭐</span>
                <span className="text-lg">Favorites</span>
              </NavLink>
            </li>

            {/* History Link */}
            <li className="mb-6">
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-6 py-3 bg-blue-500 text-white'
                    : 'flex items-center px-6 py-3 hover:bg-blue-500 hover:text-white text-gray-800 transition-colors duration-200'
                }
              >
                <span className="text-xl mr-4">📜</span>
                <span className="text-lg">History</span>
              </NavLink>
            </li>

            {/* Image Translator Link */}
            <li className="mb-6">
              <NavLink
                to="/imageTranslator"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-6 py-3 bg-blue-500 text-white'
                    : 'flex items-center px-6 py-3 hover:bg-blue-500 hover:text-white text-gray-800 transition-colors duration-200'
                }
              >
                <span className="text-xl mr-4">📷</span>
                <span className="text-lg">Save Images</span>
              </NavLink>
            </li>
          </ul>

          {/* Logout Button */}
          <div className="mt-52 ml-10">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300"
            >
              <span className="text-lg">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
