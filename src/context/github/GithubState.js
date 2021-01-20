// initial state, our actions, when we search users and make our request to github, that's going to happen here and not in our App.js

// types 

import React, { useReducer } from 'react';
import axios from 'axios'
import githubContext from './githubContext';
import githubReducer from './githubReducer';

import {
    SEARCH_USERS,
    SET_LOADING,
    CLEAR_USERS,
    GET_USER,
    GET_REPOS
} from '../types';

let githubClientID;
let githubClientSecret;

if (process.env.NODE_ENV !== 'production') {
    githubClientID = process.env.REACT_APP_GITHUB_CLIENT_ID;
    githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
}
else {
    githubClientID = process.env.GITHUB_CLIENT_ID;
    githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}
const GithubState = props => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    }

    // dispatch a types back to our reducer 

    const [state, dispatch] = useReducer(githubReducer, initialState);

    // Search users
    const searchUsers = async (text) => {

        setLoading();

        const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${githubClientID}&client_secret=${githubClientSecret}`);

        dispatch({
            type: SEARCH_USERS,
            payload: res.data.items
        });
    }

    // Get user 
    const getUser = async (username) => {
        setLoading();

        const res = await axios.get(`https://api.github.com/users/${username}?client_id=${githubClientID}&client_secret=${githubClientSecret}`);

        dispatch({
            type: GET_USER,
            payload: res.data
        })
    }

    // Get Repos 
    const getUserRepos = async username => {
        setLoading();
        const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientID}&client_secret=${githubClientSecret}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    }

    // Clear Users 
    const clearUsers = () => dispatch({ type: CLEAR_USERS })

    // Set Loading 
    const setLoading = () => dispatch({ type: SET_LOADING });

    return <githubContext.Provider
        value={{
            users: state.users,
            user: state.user,
            repos: state.repos,
            loading: state.loading,
            searchUsers,
            clearUsers,
            getUser,
            getUserRepos
        }}
    >
        {props.children}
    </githubContext.Provider>
}


export default GithubState;