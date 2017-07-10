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
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Main from '../pages/Main';
import * as readCreators from '../actions/read';

class MainContainer extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Home',
        drawerIcon:({tintColor}) => (
            <Icon name="md-home" size={25} color={tintColor}/>
        ),
        header:null
    });

    static componentDidMount() {
    }

    render() {
        return <Main {...this.props} />;
    }
}

const mapStateToProps = (state) => {
    const {read} = state;
    return {
        read
    };
};

const mapDispatchToProps = (dispatch) => {
    const readActions = bindActionCreators(readCreators, dispatch);
    return {
        readActions
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
