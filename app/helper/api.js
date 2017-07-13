'use strict';
/**
 * Created by calvin_chen on 2017/6/26.
 */

import axios from 'axios';
import * as URLs from '../constants/Urls';

axios.interceptors.response.use(
    response => {
        // console.warn(JSON.stringify(response.data));
        return response.data;
    },
    error => {
        console.warn(JSON.stringify(error));
        // return Promise.reject(error.response.data);
    });

export const getCategory = params => {return axios.get(URLs.ARTICLE_CATEGORY,{params:params})};
export const getArticleList = params => {return axios.get(URLs.ARTICLE_LIST,{params:params})};
export const getHotList = params => {return axios.get(URLs.HOT_LIST,{params:params})};
export const getSearchResult = params => {return axios.get(URLs.SEARCH,{params:params})};
export const getDropdownList = params => {return axios.get(URLs.SEARCH_DROPDOWN,{params:params})};
export const sendFeedback = params => {return axios.get(URLs.FEEDBACK,{params:params})};

export const getType = params => {return axios.get(URLs.EVENT_TYPE,{params:params})};
export const getEventList = params => {return axios.get(URLs.EVENT_LIST,{params:params})};
