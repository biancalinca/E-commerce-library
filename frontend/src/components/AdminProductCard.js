import React, { useState } from 'react'
import { MdEdit, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import moment from 'moment';
import { toast } from 'react-toastify';
import SummaryApi from '../common'; // Import the API config
import ConfirmDeleteProduct from './modals/ConfirmDeleteProduct';

function AdminProductCard({
    data,
    fetchdata,
}) {
    //pentru editarea produsului
    const [editProduct, setEditProduct] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // Funcția de ștergere a produsului
    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`${SummaryApi.deleteProduct.url}/${productId}`, {
                method: SummaryApi.deleteProduct.method,
                credentials: 'include'
            });

            const responseData = await response.json();
            console.log("Response Data STERGERE:", responseData); // Adaugă acest log

            if (responseData.success) {
                toast.success('Produsul a fost șters cu succes.');
                fetchdata(); // Reîmprospătează lista de produse după ștergere
            } else {
                toast.error('Eroare la ștergerea produsului.');
            }
        } catch (error) {
            console.error("Delete error:", error); // Adaugă acest log pentru a vedea erorile
            toast.error('A apărut o eroare. Vă rugăm să încercați din nou.');

        } finally {
            setShowConfirmDelete(false); // Închide modalul după ștergere
        }
    };

    const handleDelete = () => {
        setShowConfirmDelete(true); // Afișează modalul de confirmare
    };

    // Verifică dacă produsul a fost adăugat în ultimele 2 ore
    const isNew = moment().diff(moment(data.createdAt), 'hours') < 24;

  return (
    <div className='bg-white p-4 rounded shadow-md relative'>
        {/* Afișează eticheta "NOU" dacă produsul a fost adăugat recent */}
        {isNew && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                NOU
            </div>
        )}
        <div className='w-52'>
            <div className='w-52 h-56 flex justify-center items-center'>
                <img 
                    src = {data?.bookImage[0]} 
                    alt = {data?.title} 
                    className='mx-auto object-fill h-full'
                />
            </div>

            <h1 className='font-bold text-lg'>{data?.title}</h1>
            <h2 className='font-semibold text-md'>{data?.author}</h2>
            <h3 className='font-semibold text-md capitalize'>{data?.category}</h3>
            <p className=''><b>Cantitate disponibila:</b> {data?.stock}</p>


            <div className=''>
                <div className='text-xl font-semibold text-green-700'>
                    {data?.sellingPrice} Lei <s className='text-gray-500'>{data?.price} Lei</s>
                </div>

                <div className='flex gap-1 '>
                    <div className='w-fit ml-auto p-2 rounded-full cursor-pointer text-xl bg-yellow-200 text-black hover:bg-yellow-500 hover:text-white' onClick={() => setEditProduct(true)}>
                        <MdEdit />
                    </div>
                    <div className='w-fit ml-auto p-2 rounded-full cursor-pointer text-xl bg-red-200 text-black hover:bg-red-500 hover:text-white' onClick={handleDelete}>
                        <MdDelete />
                    </div>
                </div>

            </div>

        </div>

        {
            editProduct && <AdminEditProduct productData={data} onClose = {() => setEditProduct(false)} fetchdata = {fetchdata} />
        }
        {showConfirmDelete && (
                <ConfirmDeleteProduct 
                    productName={data?.title} 
                    onConfirm={() => deleteProduct(data._id)} 
                    onCancel={() => setShowConfirmDelete(false)} 
                />
        )}
    </div>
  )
}

export default AdminProductCard
