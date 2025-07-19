import React, { useEffect, useState, useRef } from 'react';
import { debounce, truncate } from 'lodash-es';
import { FaHistory, FaSearch, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store/store';
import { ServiceErrorManager } from '@/helpers/service';
import { AnonymousSearchProductService } from '@/services/products';
import RenderDriveFile from '../appComponets/fileupload/RenderDriveFile';
import { IProduct } from '@/types/products';
import { useRouter } from 'next/navigation';
import PriceFormatter from '../appComponets/PriceFormatter/PriceFormatter';

const LoadingSkeleton = () => (
  <div className='px-4 py-3 animate-pulse'>
    <div className='flex items-center space-x-3'>
      <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg'></div>
      <div className='flex-1'>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
        <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3'></div>
      </div>
    </div>
  </div>
);

const SearchInput = () => {
  const router = useRouter();
  const theme = useSelector((state: RootState) => state.theme);
  const [query, setQuery] = useState('');
  const [autosuggestHistory, setAutosuggestHistory] = useState<IProduct[]>([]);
  const [suggestions, setSuggestions] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchSuggestions = debounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setShowDropdown(true);

    const [err, data] = await ServiceErrorManager(
      AnonymousSearchProductService({
        params: { keyword: searchTerm, limit: 5 },
      }),
      {}
    );

    setSuggestions(data?.docs || []);
    if (err) setSuggestions([]);

    setLoading(false);
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  useEffect(() => {
    const stored = localStorage.getItem('autosuggestHistory');
    if (stored) {
      setAutosuggestHistory(JSON.parse(stored));
    }
  }, []);

  const updateAutosuggestHistory = (term: IProduct) => {
    setAutosuggestHistory((prev) => {
      const filtered = prev.filter((item) => item._id !== term._id);
      const updated = [term, ...filtered].slice(0, 15);
      if (typeof window !== 'undefined') {
        localStorage.setItem('autosuggestHistory', JSON.stringify(updated));
      }

      return updated;
    });
  };

  const handleSelect = (item: IProduct) => {
    setQuery('');
    setShowDropdown(false);
    updateAutosuggestHistory(item);
    router.push(
      `/product-details/${item._id}?name=${item.name}&description=${item.description}`
    );
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!query) {
      setShowDropdown(true);
    } else if (query && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    setTimeout(() => setShowDropdown(false), 150);
  };

  const isDark = theme.mode === 'DARK';

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className='relative w-full max-w-2xl mx-auto'>
        <div
          className={`
          relative flex items-center
          ${isDark ? 'bg-darkBgbutton text-white' : 'bg-white text-black'}
          border-2 rounded-2xl
          
          transition-all duration-300 ease-in-out
          ${
            isFocused
              ? 'border-[#FFE5B4] dark:border-[#FFE5B4] shadow-blue-200/50 dark:shadow-blue-900/50'
              : isDark
              ? 'border-gray-600'
              : 'border-gray-200'
          }
          ${showDropdown ? 'rounded-b-none' : ''}
        `}
        >
          <div className='pl-6 pr-2'>
            <FaSearch
              className={`
                w-5 h-5 transition-colors duration-200
                ${
                  isFocused
                    ? 'text-[#FFE5B4] dark:text-[#FFE5B4]'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }
              `}
            />
          </div>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              flex-1 px-2 py-2 
              bg-transparent 
              ${
                isDark
                  ? 'text-white placeholder-gray-400'
                  : 'text-black placeholder-gray-500'
              }
              outline-none
              text-lg
            `}
            placeholder='Search for products, brands, and more...'
          />

          {loading && (
            <div className='pr-2'>
              <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
            </div>
          )}

          {query && !loading && (
            <button
              onClick={clearSearch}
              className={`
                pr-6 pl-2 py-2
                ${
                  isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }
                transition-colors duration-200
              `}
            >
              <FaTimes className='w-4 h-4' />
            </button>
          )}
        </div>

        {showDropdown && (
          <div
            className={`
            absolute z-50 w-full
            ${isDark ? 'bg-darkBgbutton text-white' : 'bg-white text-black'}
            border-2 border-t-0 
            ${isDark ? 'border-gray-600' : 'border-gray-200'}
            rounded-b-2xl
            shadow-xl
            max-h-96 overflow-y-auto
            backdrop-blur-sm
          `}
          >
            {loading ? (
              <div className='py-2'>
                {[...Array(3)].map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))}
              </div>
            ) : !query && autosuggestHistory.length > 0 ? (
              <div className='py-2'>
                {autosuggestHistory.map((term, index) => (
                  <div
                    key={term._id || index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(term.name);
                    }}
                    className={`px-6 py-4 cursor-pointer text-sm flex justify-between items-center`}
                  >
                    <div className='flex items-center space-x-2'>
                      <FaHistory />

                      <span>{truncate(term.name, { length: 70 })}</span>
                    </div>
                    <span
                      className='text-xs text-gray-400 hover:text-red-500'
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const updated = autosuggestHistory.filter(
                          (item) => item._id !== term._id
                        );
                        setAutosuggestHistory(updated);
                        localStorage.setItem(
                          'autosuggestHistory',
                          JSON.stringify(updated)
                        );
                      }}
                    >
                      <FaTimes className='w-3 h-3' />
                    </span>
                  </div>
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <div className='px-6 py-8 text-center'>
                <div
                  className={`text-lg mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  🔍
                </div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  No products found for "{query}"
                </p>
              </div>
            ) : (
              <div className='py-2'>
                {suggestions.map((item, index) => (
                  <div
                    key={item._id || index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                    className={`
                      px-6 py-4 cursor-pointer
                      transition-all duration-200
                      border-l-4 border-transparent
                      hover:border-[#FFE5B4]
                      group
                      ${
                        isDark
                          ? 'hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-purple-900/20'
                          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                      }
                    `}
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='relative flex-shrink-0'>
                        <div
                          className='
                          w-16 h-16 rounded-xl overflow-hidden
                          shadow-md group-hover:shadow-lg
                          transition-all duration-200
                          group-hover:scale-105
                        '
                        >
                          <RenderDriveFile
                            file={item?.thumbnail as any}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <div
                          className='
                          absolute inset-0 rounded-xl
                          bg-gradient-to-r from-transparent to-blue-500/10
                          group-hover:to-blue-500/20
                          transition-all duration-200
                        '
                        ></div>
                      </div>

                      <div className='flex-1 min-w-0'>
                        <h3
                          className={`
                          font-semibold truncate
                          group-hover:text-blue-600 dark:group-hover:text-blue-400
                          transition-colors duration-200
                          ${isDark ? 'text-white' : 'text-gray-800'}
                        `}
                        >
                          {item.name}
                        </h3>
                        <div className='flex items-center mt-1'>
                          <PriceFormatter value={item?.variants?.[0]?.price} />

                          {item?.variants?.[0]?.price && (
                            <span
                              className={`ml-2 text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Free Shipping
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`
                        group-hover:text-blue-500
                        transition-all duration-200
                        group-hover:translate-x-1
                        ${isDark ? 'text-gray-400' : 'text-gray-500'}
                      `}
                      >
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showDropdown && !loading && suggestions.length > 0 && (
        <div
          className={`
          mt-1 text-center text-xs animate-fade-in
          ${isDark ? 'text-gray-400' : 'text-gray-500'}
        `}
        >
          Press Enter to search or click on a product
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchInput;
