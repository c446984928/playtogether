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
import {
    StyleSheet,
    Dimensions,
    View,
    Text, RefreshControl, ListView, ScrollView, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import ToastUtil from '../utils/ToastUtil';
import LoadingView from '../components/LoadingView';
import {formatStringWithHtml} from "../utils/FormatUtil";
import TimeAgo from "react-native-timeago";
import * as api from '../helper/api';


class SearchResultPage extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.searchContent,
        tabBarIcon: ({tintColor}) => (
            <Icon name="md-home" size={25} color={tintColor}/>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            articleList:[],
            loading:true
        };
        this.renderItem = this.renderItem.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this._searchResult = this._searchResult.bind(this);

    }

    componentDidMount() {
        const searchContent = this.props.navigation.state.params.searchContent||'';
        this._searchResult(searchContent);
    }

    _searchResult(searchContent){
        this.setState({loading: true});
        api.getSearchResult({keyword:searchContent}).then(resData => {
            this.setState({loading: false});
            this.setState({articleList:(resData||[])});
        }).catch(err => {
            this.setState({loading: false});
            this.setState({articleList:[]});
            console.warn(err.message,err.stack);
            ToastUtil.showShort(`Connect Error,please check your network and refresh...`);
        });
    }

    _onPress(article) {
        const {navigate} = this.props.navigation;
        navigate('Web', {article});
    }

    renderItem(article) {
        return (
            <TouchableOpacity onPress={() => this._onPress(article)}>
                <View style={styles.containerItem}>
                    <Image style={styles.itemImg}
                           source={article.contentImg ? {uri: article.contentImg} : require('../img/news_default_image.png')}/>
                    <View style={styles.itemRightContent}>
                        <Text style={styles.title} numberOfLines={2}>
                            {formatStringWithHtml(article.title.trim())}
                        </Text>
                        <View style={styles.itemRightBottom}>
                            <Text style={styles.userName}>
                                {article.userName}
                            </Text>
                            <TimeAgo style={styles.timeAgo} time={article.date} hideAgo={true}/>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderContent(dataSource) {
        if (this.state.loading) {
            return <LoadingView />;
        }
        const isEmpty = this.state.articleList === undefined || this.state.articleList.length === 0;
        if (isEmpty) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:'#fcfcfc',flex:1 }}>
                    <Image style={{width:70,height:70,opacity:0.3}} source={require('../img/Oops.png')}/>
                    <Text style={{fontSize: 16,opacity:0.5}}>
                        Found Nothing
                    </Text>
                </View>
            );
        }
        return (
            <ListView
                initialListSize={1}
                dataSource={dataSource}
                renderRow={this.renderItem}
                style={styles.listView}
                onEndReached={() => ''}
                onEndReachedThreshold={10}
                // renderFooter={this.renderFooter}
            />
        );
    }

    render() {
        const {params} = this.props.navigation.state;
        return  (
            <View style={styles.base}>
                {this.renderContent(
                    this.state.dataSource.cloneWithRows(
                        this.state.articleList === undefined ? [] : this.state.articleList
                    )
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    base: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    containerItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fcfcfc',
        padding: 10,
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 1
    },
    title: {
        fontSize: 15,
        textAlign: 'left',
        color: 'black'
    },
    listView: {
        backgroundColor: '#eeeeec'
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    drawerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    drawerTitleContent: {
        height: 120,
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: '#3e9ce9'
    },
    drawerIcon: {
        width: 30,
        height: 30,
        marginLeft: 5
    },
    drawerTitle: {
        fontSize: 20,
        textAlign: 'left',
        color: '#fcfcfc'
    },
    drawerText: {
        fontSize: 18,
        marginLeft: 15,
        textAlign: 'center',
        color: 'black'
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    footerText: {
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 10
    },
    itemImg: {
        width: 88,
        height: 66,
        marginRight: 10
    },
    itemRightContent: {
        flex: 1,
        flexDirection: 'column'
    },
    itemRightBottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    userName: {
        flex: 1,
        fontSize: 14,
        color: '#aaaaaa',
        marginTop: 5,
        marginRight: 5
    },
    timeAgo: {
        fontSize: 14,
        color: '#aaaaaa',
        marginTop: 5
    },
    refreshControlBase: {
        backgroundColor: 'transparent'
    },
    tab: {
        paddingBottom: 0
    },
    tabText: {
        fontSize: 16
    },
    tabBarUnderline: {
        backgroundColor: '#3e9ce9',
        height: 2
    }
});

export default SearchResultPage;
