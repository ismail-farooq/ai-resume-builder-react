import axios from 'axios';
 
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

const axiosClient = axios.create({
    baseURL:'http://localhost:1337/api',
    headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${API_KEY}`
    }    
});

const getUserResumes=(userEmail)=>axiosClient.get('/user-resumes?filters[userEmail][$eq]='+userEmail);
const CreateNewResume=(data)=>axiosClient.post('/user-resumes', data); 
const updateResumeData=(id, data)=>axiosClient.put('/user-resumes/'+id, data);
const getResumeData=(id)=>axiosClient.get('user-resumes/'+id+'?populate=*');
const deleteResume=(id)=>axiosClient.delete('user-resumes/'+id);

    
export default {
    CreateNewResume,
    updateResumeData,
    getResumeData,
    getUserResumes,
    deleteResume
}