import axios from "axios";
const api_url = import.meta.env.API_URL ||'http://localhost:4000/api';

const api = axios.create({
     baseURL:api_url
});
// interceptor
api.interceptors.request.use((config)=>{
     try{
        const token = localStorage.getItem("authToken");
        console.log('token',token)
        if(token){
             config.headers.Authorization = `Bearer ${token}`
        }
        return config 
     }catch(err){
         console.log("error happen in this interceptor request",err.message)
     }
})
// userSignUp
const userSignUp = async (form)=>{
     const resData = await api.post('/auth/signUp ',form);
    //  if(resData.statusText !==  "ok"){
    //       throw new Error('something went wrong')
    //  }
     console.log('res',resData)
     return resData.data;
};
// userSignIn
const userSignIn = async (form)=>{
     const resData = await api.post('/auth/signIn',form)
     console.log("res Data from login",resData)
     return resData.data;
};

const loginUserData = async ()=>{
     const resData = await api.get('/auth/loginUser')
     console.log("res Data from login",resData)
     return resData.data;
};

// auction

const addAuctionitemAsync = async (form)=>{
     const resData = await api.post('/auction/addAuctionItem',form)
     console.log("res Data from login",resData)
     return resData.data;
};


const startAuctionAsync  = async (form)=>{
     const resData = await api.patch('/auction/startAuction',form)
     console.log("res Data from login",resData)
     return resData.data;
};

const liveAuctionAsync  = async ()=>{
     const resData = await api.get('/auction/liveAuction')
     console.log("res Dataoflive auction",resData)
     return resData.data;
};

const userAuctionItem = async ()=>{
     const resData = await api.get('/auction/auctionItem')
     console.log("res auctionUseritem auction",resData)
     return resData.data;
};


export {
     userSignUp,
     userSignIn,
     loginUserData,
     addAuctionitemAsync,
     liveAuctionAsync,
     startAuctionAsync,
     userAuctionItem
}