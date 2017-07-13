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
import store from 'react-native-simple-store';
import * as types from '../constants/ActionTypes';
import ToastUtil from '../utils/ToastUtil';
import {fetchTypeList, receiveTypeList} from '../actions/category';
import * as api from '../helper/api';

export function* requestTypeList() {
    try {
        yield put(fetchTypeList());
        const typeList = yield call(api.getType);
        yield put(receiveTypeList(typeList));
        yield call(store.save, 'typeList', typeList);

    } catch (error) {
        yield put(receiveTypeList([]));
        yield ToastUtil.showShort('Connect Error,please check your network and refresh...');
    }
}

export function* watchRequestTypeList() {
    while (true) {
        yield take(types.REQUEST_TYPE_LIST);
        yield fork(requestTypeList);
    }
}
