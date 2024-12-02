import SummaryApi from '../common';

const fetchCategoryAll = async(category) => {
    const response = await fetch(SummaryApi.getCategoryProductAll.url, 
        {method :
            SummaryApi.getCategoryProductAll.method,
            headers : {
                'content-type' : 'application/json'
            },
            body : JSON.stringify({category : category})
        } 
    )
    const dataResponse = await response.json()
    return dataResponse
}

export default fetchCategoryAll