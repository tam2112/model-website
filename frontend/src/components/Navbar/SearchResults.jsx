import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ searchQuery, setShowSearch }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (searchQuery.trim() === '') return;

        // Fetch search results from the API
        const fetchResults = async () => {
            const response = await fetch(`http://localhost:5000/search?q=${searchQuery}`);
            const data = await response.json();

            setResults(data.results);
        };

        fetchResults();
    }, [searchQuery]);

    return (
        <div>
            {results.map((result) => (
                <Link to={`/product/${result.id}`} key={result.id} className='py-2 px-4 hover:bg-primary hover:text-white cursor-pointer transition-all duration-75 block' onClick={() => setShowSearch(false)}>
                    <h3>{result.name}</h3>
                </Link>
            ))}
        </div>
    );
};

export default SearchResults;