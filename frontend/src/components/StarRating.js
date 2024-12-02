import React, { useEffect, useState } from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import SummaryApi from '../common';

const StarRating = ({ productId, size = 24 }) => {
    // State pentru totalReviews, totalRating, averageRating
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(SummaryApi.viewReview.url.replace(':productId', productId), {
                method: SummaryApi.viewReview.method,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log("Fetched data:", data); // Verifică structura datelor

            if (data?.success) {
                setTotalReviews(data.totalReviews || 0);
                setTotalRating(data.totalRating || 0);
                setAverageRating(data.averageRating || 0);
            } else {
                console.error('Failed to fetch reviews:', data.message);
            }
        } catch (err) {
            console.error('An error occurred while fetching reviews:', err);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(averageRating)) {
                // Stele pline
                stars.push(<FaStar key={i} color="#FFD700" size={size} />);
            } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
                // Stea pe jumătate
                stars.push(<FaStarHalfAlt key={i} color="#FFD700" size={size} />);
            } else {
                // Stele goale
                stars.push(<FaRegStar key={i} color="#FFEC8B" size={size} />);
            }
        }
        return stars;
    };

    return (
        <div className="star-rating ">
            <div className="stars flex py-3">
                {renderStars()}
            </div>
        </div>
    );
};

export default StarRating;
