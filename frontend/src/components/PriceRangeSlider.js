import React, { useEffect, useState } from 'react';
import { Range } from 'react-range';
import SummaryApi from '../common';

const PriceRangeSlider = ({onPriceChange }) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

    useEffect(() => {
        // Fetch the min and max prices from the backend
        const fetchPriceRange = async () => {
            try {
                const response = await fetch(SummaryApi.getPriceRange.url, {
                    method: SummaryApi.getPriceRange.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();

                if (data.success) {
                    setMinPrice(data?.data?.minPrice);
                    setMaxPrice(data?.data?.maxPrice);
                    setPriceRange([data?.data?.minPrice, data?.data?.maxPrice]);
                    onPriceChange([data?.data?.minPrice, data?.data?.maxPrice]);
                }
            } catch (error) {
                console.error("Failed to fetch price range", error);
            }
        };

        fetchPriceRange();
    }, []);

    const handlePriceChange = (values) => {
        setPriceRange(values);
        onPriceChange(values); // Notify parent of the price range change
    };

    const handleInputChange = (e, index) => {
        const value = Number(e.target.value);
        const newRange = [...priceRange];
        newRange[index] = value;

        if (index === 0 && value <= maxPrice) {
            setPriceRange(newRange);
        } else if (index === 1 && value >= minPrice) {
            setPriceRange(newRange);
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-2 mt-2">
                <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handleInputChange(e, 0)}
                    min={minPrice}
                    max={maxPrice}
                    className="w-20 border rounded-full p-1 pl-7"
                />
                <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handleInputChange(e, 1)}
                    min={minPrice}
                    max={maxPrice}
                    className="w-20 border rounded-full p-1 pl-5"
                />
            </div>
            <Range
            step={1}
            min={minPrice}
            max={maxPrice}
            values={priceRange}
            onChange={handlePriceChange}
            renderTrack={({ props, children }) => (
                <div
                    {...props}
                    style={{
                        ...props.style,
                        height: '6px', // Slightly taller track
                        background: '#D3D3D3', // Dark green color
                        borderRadius: '4px', // Rounded corners for the track
                        zIndex: 3,
          
                    }}
                >
                    {children}
                </div>
            )}
            renderThumb={({ props }) => (
                <div
                    {...props}
                    style={{
                        ...props.style,
                        height: '16px', // Smaller thumb
                        width: '16px', // Smaller thumb
                        backgroundColor: '#228B22', // Dark green color
                        borderRadius: '50%', // Fully rounded
                        border: '2px solid #ffffff', // White border to make it stand out
                        boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                        zIndex: 3,
                    }}
                />
            )}
        />

        </div>
    );
};

export default PriceRangeSlider;
