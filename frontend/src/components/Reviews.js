import React, { useEffect, useState } from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom'; 
import SummaryApi from '../common';
import { useSelector } from 'react-redux';
import ROLE from '../common/role';

const Reviews = ({ productId: propProductId, product }) => {

    const user = useSelector((state) => state?.user?.user);
    const isAdmin = user?.role === ROLE.ADMIN;
    const { id: urlProductId } = useParams(); 
    const productId = propProductId || urlProductId; 

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    const [totalReviews, setTotalReviews] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]); // Distribuția ratingurilor

    // Stări pentru gestionarea editării recenziilor
    const [editingReview, setEditingReview] = useState(null); // Recenzia curentă în editare
    const [editForm, setEditForm] = useState({ rating: 5, comment: '' }); // Valorile din formularul de editare
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Pentru modalul de confirmare ștergere
    const [reviewToDelete, setReviewToDelete] = useState(null); // ID-ul recenziei de șters

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const calculateRatingStats = (reviews) => {
        if (reviews.length === 0) {
            // Dacă nu există recenzii, resetează toate statisticile
            resetRatingStats();
            return;
        }

        const total = reviews.length;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avg = total > 0 ? sum / total : 0;
        const distribution = [0, 0, 0, 0, 0];

        reviews.forEach(review => {
            distribution[review.rating - 1]++;
        });

        setTotalReviews(total);
        setTotalRating(sum);
        setAverageRating(avg);
        setRatingDistribution(distribution);
    };

    const resetRatingStats = () => {
        setTotalReviews(0);
        setTotalRating(0);
        setAverageRating(0);
        setRatingDistribution([0, 0, 0, 0, 0]);
    };

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.viewReview.url.replace(':productId', productId), {
                method: SummaryApi.viewReview.method,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data?.success) {
                setReviews(data?.data); 
                calculateRatingStats(data?.data); // Recalculează statistici
            } else {
                console.error('Failed to fetch reviews:', data.message);
                setReviews([]);
                resetRatingStats(); // Resetează statistici la valori inițiale
            }
        } catch (err) {
            console.error('An error occurred while fetching reviews:', err);
            setReviews([]);
            resetRatingStats(); // Resetează statistici la valori inițiale
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(SummaryApi.addReview.url, {
                method: SummaryApi.addReview.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId: productId,
                    rating: newReview.rating,
                    comment: newReview.comment,
                }),
            });

            const data = await response.json();

            if (data.success) {
                fetchReviews();
                setNewReview({ rating: 5, comment: '' });
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }
    };

    //editarea unei recenzii
    const handleReviewEdit = async (reviewId, updatedReview) => {
        try {
            const response = await fetch(SummaryApi.editReview.url, {
                method: SummaryApi.editReview.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    reviewId: reviewId,
                    rating: updatedReview.rating,
                    comment: updatedReview.comment,
                }),
            });

            const data = await response.json();
            if (data.success) {
                fetchReviews();  // Reîncarcă recenziile
                setEditingReview(null); // Resetează formularul de editare
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('A apărut o eroare la editarea recenziei:', err);
        }
    };

    // Gestionarea deschiderii formularului de editare
    const openEditForm = (review) => {
        setEditingReview(review._id);
        setEditForm({ rating: review.rating, comment: review.comment });
    };

    // Gestionarea trimiterea formularului de editare
    const submitEditForm = (e) => {
        e.preventDefault();
        handleReviewEdit(editingReview, editForm);
    };

    // Funcția pentru ștergerea unei recenzii
    const handleReviewDelete = async () => {
        if (!reviewToDelete) return;
        try {
            const response = await fetch(SummaryApi.deleteReview.url, {
                method: SummaryApi.deleteReview.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ reviewId: reviewToDelete }),
            });

            const data = await response.json();
            if (data.success) {
                fetchReviews();  // Reîncarcă recenziile după ștergere
                setShowDeleteModal(false);
                setReviewToDelete(null);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('A apărut o eroare la ștergerea recenziei:', err);
        }
    };

    // Funcția pentru ștergerea recenziilor de către administratori
    const handleReviewDeleteAdmin = async () => {
        if (!reviewToDelete) return;
        try {
            const response = await fetch(SummaryApi.deleteReviewAdmin.url.replace(':id', reviewToDelete), {
                method: SummaryApi.deleteReviewAdmin.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();
            if (data.success) {
                fetchReviews();  // Reîncarcă recenziile după ștergere
                setShowDeleteModal(false);
                setReviewToDelete(null);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('A apărut o eroare la ștergerea recenziei de către administrator:', err);
        }
    };


    const openDeleteModal = (reviewId) => {
        setReviewToDelete(reviewId);
        setShowDeleteModal(true);
    };


    //randarea stelutelor
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(averageRating)) {
                stars.push(<FaStar key={i} color="#FFD700" size={24} />);
            } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
                stars.push(<FaStarHalfAlt key={i} color="#FFD700" size={24} />);
            } else {
                stars.push(<FaRegStar key={i} color="#FFEC8B" size={24} />);
            }
        }
        return stars;
    };

    if (!productId) {
        return <p>Loading product information...</p>;
    }

    return (
        <div className="review-section text-gray-900 flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 space-y-6">
                <div className="general-rating">
                    <h3 className="text-xl font-semibold mb-2">Rating general al produsului</h3>
                    <div className="stars flex items-center mb-2">
                        {renderStars()}
                    </div>
                    <p className="text-lg">
                        {averageRating ? averageRating.toFixed(1) : '0.0'} ({totalReviews} reviews)
                    </p>
                    <div className="rating-distribution mt-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="rating-bar flex items-center mb-2">
                                <span className="text-sm w-16">{5 - index} stele</span>
                                <div className="bar bg-gray-300 h-3 w-full mx-2 rounded relative">
                                    <div
                                        className="fill h-full rounded"
                                        style={{
                                            width: `${totalReviews > 0 ? (ratingDistribution[4 - index] / totalReviews) * 100 : 0}%`,
                                            backgroundColor: '#4CAF50',
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm">{ratingDistribution[4 - index]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="add-review">
                    <h3 className="text-xl font-semibold mb-4">Te rog adaugă o recenzie pentru a-i inspira pe ceilalți cititori!</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="rating-input flex items-center">
                            {[...Array(5)].map((star, index) => (
                                <FaStar
                                    key={index}
                                    color={index < newReview.rating ? "#FFD700" : "#e4e5e9"}
                                    size={20}
                                    className="cursor-pointer"
                                    onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                                />
                            ))}
                        </div>
                        <textarea
                            placeholder="Adauga un review..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            required
                            className="w-full p-3 border border-pink-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-lg hover:bg-green-700 transition duration-300"
                        >
                            Trimite recenzia
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:w-2/3">
            <div className="reviews-list">
                <h3 className="text-xl font-semibold mb-4">Recenzii</h3>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review?._id} className="review p-4 mb-4 bg-gray-100 rounded-md shadow relative">
                            {editingReview === review._id ? (
                                // Formularul de editare
                                <form onSubmit={submitEditForm}>
                                    <div className="rating-input flex items-center mb-2">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index}
                                                color={index < editForm.rating ? "#FFD700" : "#e4e5e9"}
                                                size={20}
                                                className="cursor-pointer"
                                                onClick={() => setEditForm({ ...editForm, rating: index + 1 })}
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        value={editForm.comment}
                                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-md mb-2"
                                    ></textarea>
                                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">Salvează</button>
                                    <button onClick={() => setEditingReview(null)} className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md">Anulează</button>
                                </form>
                            ) : (
                                <>
                                    <div className="review-header flex justify-between items-center mb-2">
                                        <span className="flex items-center text-lg">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    color={index < review.rating ? "#FFD700" : "#e4e5e9"}
                                                    size={20}
                                                />
                                            ))}
                                            <span className="ml-2">{review.user?.name} {review.user?.lastname}</span>
                                        </span>
                                        <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700">{review?.comment}</p>
                                    {(user && (review.user?._id === user._id || isAdmin)) && (
                                        <div className="absolute bottom-2 right-2 flex space-x-2">
                                            {review.user?._id === user._id && (
                                                <button onClick={() => openEditForm(review)} className="text-pink-500 hover:underline flex items-center">
                                                    <FaEdit className="mr-1" />
                                                    <span>Editează</span>
                                                </button>
                                            )}
                                            <button onClick={() => openDeleteModal(review._id)} className="text-red-500 hover:underline flex items-center">
                                                <FaTrashAlt className="mr-1" />
                                                <span>Șterge</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
            </div>

        {/* Modal de confirmare ștergere */}
        {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Ești sigur că vrei să ștergi această recenzie?</h2>
                        <div className="flex justify-end">
                            <button onClick={isAdmin ? handleReviewDeleteAdmin : handleReviewDelete} className="bg-red-600 text-white px-4 py-2 rounded-md mr-2">Șterge</button>
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Anulează</button>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
};

export default Reviews;
