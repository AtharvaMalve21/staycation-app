import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SearchBar = ({ setUsers, users }) => {
  const [searchElement, setSearchElement] = useState('');
  const URI = import.meta.env.VITE_BACKEND_URI;

  const searchUser = async (ev) => {
    ev.preventDefault();

    if (!searchElement.trim()) {
      return toast.error("Please enter a user name.");
    }

    try {
      const { data } = await axios.get(`${URI}/api/admin/search`, {
        params: { query: searchElement.trim() },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        setUsers(data.data);
        setSearchElement('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
      <form onSubmit={searchUser} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search for Users
          </label>
          <input
            type="text"
            id="search"
            value={searchElement}
            onChange={(ev) => setSearchElement(ev.target.value)}
            placeholder="Enter user name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="self-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-md transition duration-200"
          >
            Find
          </button>
        </div>
      </form>  
    </div>
  );
};

export default SearchBar;
