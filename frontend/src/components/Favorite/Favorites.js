import React, { useState, useEffect } from 'react';
import { getFavorites, deleteFavorite } from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Sidebar from '../Nav/Sidebar';
import Cookies from 'js-cookie';
import FavoriteEdite from './FavoriteEdite';
import { PencilIcon } from '@heroicons/react/outline';
import FavoriteReport from './FavoriteReport';
import { SearchIcon, CalendarIcon, FilterIcon } from '@heroicons/react/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Favorites = ({ handleLogout }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); //item count per page
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isPopUpOpenReport, setIsPopUpOpenReport] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch the current user ID when the component loads
  const currentUserId = Cookies.get('userId');

  // Fetch favorites from the API when the component loads
  const fetchFavorites = async () => {
    try {
      const response = await getFavorites();
      // Filter favorites by the current user ID
      const userFavorites = response.data.filter(
        (fav) => fav.user === currentUserId
      );
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      toast.error('Error geting favorites!', {
        position: 'top-right',
        autoClose: 3000, // Auto close after 3 seconds
      });
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchFavorites();
    }
  }, [currentUserId]);

  // Handle select and deselect of an individual item
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle select/deselect all items
  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]); // Deselect all
    } else {
      const allItemIds = filteredFavorites.map((fav) => fav._id);
      setSelectedItems(allItemIds); // Select all
    }
  };

  // Handle delete selected items
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedItems.map((id) => deleteFavorite(id)));
      setFavorites(favorites.filter((fav) => !selectedItems.includes(fav._id)));
      setSelectedItems([]);
      toast.success('Delete favorites successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Failed to delete selected items:', error);
      alert('Failed to delete selected items. Please try again.');
    }
  };

  // Handle search filtering
 const filteredFavorites = favorites.filter((fav) => {
   const matchesSearchTerm1 = fav.text
     .toLowerCase()
     .includes(searchTerm.toLowerCase());

   const matchesSearchTerm2 = fav.translatedText
     .toLowerCase()
     .includes(searchTerm.toLowerCase());

   const matchesSearchTerm = matchesSearchTerm1 || matchesSearchTerm2; // Match either text or translated text

   const matchesDateRange =
     (!startDate || new Date(fav.createdAt) >= startDate) &&
     (!endDate || new Date(fav.createdAt) <= endDate);

   return matchesSearchTerm && matchesDateRange; // Both search and date range must match
 });


  const handleCardClick = (favorite) => {
    setSelectedFavorite(favorite); // Set the clicked card's data
    setIsPopUpOpen(true); // Open the popup
  };

  const handleReport = () => {
    setIsPopUpOpenReport(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopUpOpenReport(false);
    setIsPopUpOpen(false); // Close the popup
    setSelectedFavorite(null); // Clear the selected favorite
    fetchFavorites();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFavorites.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 px-8 pt-3 bg-gray-100 overflow-auto ml-60 mt-16">
        <div className="min-h-60 bg-gray-100 text-black p-4 ml-10">
          <h2 className="text-3xl font-bold mb-2 text-center">
            Manage Favorites
          </h2>

          {/* Combined Search Bar and Filter Icon */}
          <div className="flex items-center justify-between mb-4 space-x-4 ml-16">
            {/* Search Bar with Icon */}
            <div className="relative w-5/12">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-2 border border-gray-300 rounded-lg w-full text-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              />
            </div>

            {/* Filter Button with Icon */}
            <button
              onClick={() => setShowFilters(!showFilters)} // Toggle filter visibility
              className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FilterIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-md text-gray-700">Filter</span>
            </button>
          </div>

          {/* Date Picker Filter (Visible when 'showFilters' is true) */}
          {showFilters && (
            <div className="flex items-center space-x-4 mb-4 ml-16">
              {/* Start Date */}
              <div className="relative w-2/12">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="pl-10 p-2 border border-gray-300 rounded-lg w-full text-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                  isClearable
                  placeholderText="Start date"
                />
              </div>

              {/* End Date */}
              <div className="relative w-2/12">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="pl-10 p-2 border border-gray-300 rounded-lg w-full text-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                  isClearable
                  placeholderText="End date"
                />
              </div>
            </div>
          )}

          {/* Select All and Delete Selected Buttons */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleSelectAll}
              className="p-2 px-4  bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              {selectedItems.length !== currentItems.length
                ? 'Select All'
                : 'DeSelect All'}
            </button>

            <button
              onClick={handleReport}
              className="p-2 px-4 left-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Report
            </button>

            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="p-2 px-4  bg-red-500 text-white rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
              >
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>

          X

          {/* Favorites Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-4xl">
            {favorites.length === 0 ? (
              // Modern Loading Indicator
              <div className="flex justify-center items-center w-full h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
              </div>
              
            ) : (
              // Display items if available
              currentItems.map((fav) => (
                // Favorites card
                <div
                  key={fav._id}
                  className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative group border-l-8 border-yellow-500 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="absolute top-3 left-3 w-5 h-5 text-blue-600 focus:ring-0 group-hover:scale-110 transition-transform duration-200"
                    checked={selectedItems.includes(fav._id)}
                    onChange={() => handleSelectItem(fav._id)}
                  />

                  <PencilIcon
                    className="absolute bottom-3 right-4 w-6 h-6 text-yellow-900"
                    onClick={() => handleCardClick(fav)}
                  />

                  <div
                    className="flex flex-col space-y-2 p-2 m-2"
                    onClick={() => handleCardClick(fav)}
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {fav.text} -{' '}
                      <span className="text-gray-600">
                        {fav.translatedText}
                      </span>
                    </span>

                    <span className="text-sm text-gray-600">
                      Added on {moment(fav.createdAt).format('MMMM Do, YYYY')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Popup Component */}
          <FavoriteEdite
            isOpen={isPopUpOpen}
            onClose={handleClosePopup}
            favorite={selectedFavorite}
          />

          <FavoriteReport
            isOpen={isPopUpOpenReport}
            onClose={handleClosePopup}
            favorite={favorites}
          />

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`p-3 rounded-lg focus:outline-none ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                } transition-transform transform hover:scale-105`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Favorites;
