import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SearchBar = ({ setUsers, users }) => {
  const [searchElement, setSearchElement] = useState('');
  const [loading, setLoading] = useState(false);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const searchUser = async (e) => {
    e.preventDefault();

    const query = searchElement.trim();
    if (!query) {
      return toast.error("Please enter a user name.");
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/admin/search`, {
        params: { query },
        withCredentials: true,
      });

      if (data.success) {
        setUsers(data.data);
        toast.success(data.message || "Users found");
        setSearchElement('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mb-8">
      <form onSubmit={searchUser} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search for Users
          </label>
          <input
            id="search"
            type="text"
            value={searchElement}
            onChange={(e) => setSearchElement(e.target.value)}
            placeholder="Enter full or partial name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={loading}
          />
        </div>
        <div className="self-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16z"
                ></path>
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
