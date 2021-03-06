import { useReducer, createContext } from "react";
import { GithubReducer } from "./GithubReducer";
export const GithubContext = createContext();


const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const GithubProvider =({children})=>{
    const initialState = {
        users: [],
        user: {},
        repos:[],
        loading: false
    }
    
    const [state, dispatch] =useReducer(GithubReducer, initialState);

    const searchUsers = async (text)=>{
        setLoading();

        const params = new URLSearchParams({
            q: text
        })
        const response = await fetch(`${GITHUB_URL}search/users?${params}`)

        const {items} = await response.json()

        console.log("items" + items)

        dispatch({
            type: 'GET_USERS',
            payload: items,
        })

    }
    const getUser = async (login)=>{
        setLoading();
       
        const response = await fetch(`${GITHUB_URL}users/${login}`)

        if(response.status === 404){
            window.location = '/notfound'
        }else{
            const data = await response.json()

        dispatch({
            type: 'GET_USER',
            payload: data,
        })
        }
    }

const getUserRepos = async (login)=>{
    setLoading();

    const params = new URLSearchParams({
        sort: 'created',
        per_page: 10,
    })

    const response = await fetch(`${GITHUB_URL}users/${login}/repos?${params}`)

    const data = await response.json()
    

    dispatch({
        type: 'GET_REPOS',
        payload: data,
    })

}

    const clearUsers = () => dispatch({type:"CLEAR_USERS"})

    const setLoading =()=> dispatch({type: "SET_LOADING"})

    return(
        <GithubContext.Provider value={{users: state.users, user: state.user,  loading: state.loading, searchUsers, getUser, getUserRepos, repos: state.repos, clearUsers}}>
            {children}
        </GithubContext.Provider> 
    )
}

export default GithubProvider;