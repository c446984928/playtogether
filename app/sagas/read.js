/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import {put, take, call, fork} from 'redux-saga/effects';

import * as types from '../constants/ActionTypes';
import ToastUtil from '../utils/ToastUtil';
import {fetchArticleList, receiveArticleList} from '../actions/read';
import * as api from '../helper/api';

export function* requestArticleList(isRefreshing,
                                    loading,
                                    typeId,
                                    isLoadMore,
                                    page) {
    try {
        yield put(fetchArticleList(isRefreshing, loading, isLoadMore));
        const articleList = yield call(api.getArticleList, {typeId: typeId, page: page - 1});
        yield put(
            receiveArticleList(
                articleList,
                typeId
            )
        );

    } catch (error) {
        yield put(receiveArticleList([], typeId));
        ToastUtil.showShort('Connect Error,please check your network and refresh...');
    }
}

export function* watchRequestArticleList() {
    while (true) {
        const {isRefreshing, loading, typeId, isLoadMore, page} = yield take(
            types.REQUEST_ARTICLE_LIST
        );
        yield fork(
            requestArticleList,
            isRefreshing,
            loading,
            typeId,
            isLoadMore,
            page
        );
    }
}
