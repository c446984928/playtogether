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
import React, {PropTypes} from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    InteractionManager,
    ActivityIndicator,
    Image,
    View,
    DeviceEventEmitter, TouchableHighlight,Platform
} from 'react-native';
import iosStatusBar from '../components/iosStatusBar';
import TimeAgo from 'react-native-timeago';
import ScrollableTabView, {
    ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import store from 'react-native-simple-store';
import LoadingView from '../components/LoadingView';
import ToastUtil from '../utils/ToastUtil';
import Icon from 'react-native-vector-icons/Ionicons';
import {formatStringWithHtml} from '../utils/FormatUtil';

require('moment/locale/en-gb');

const propTypes = {
    readActions: PropTypes.object,
    read: PropTypes.object.isRequired
};

const pages = [];
let loadMoreTime = 0;
let currentLoadMoreTypeId;

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            typeIds: [],
            typeList: {}
        };
        this.renderItem = this.renderItem.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onIconClicked = this.onIconClicked.bind(this);
        this.renderScrollTab = this.renderScrollTab.bind(this);
        this.renderAddCateButton = this.renderAddCateButton.bind(this);
    }

    componentWillMount() {
        const {readActions} = this.props;
        store.get('typeIds').then((typeIds) => {
            if (!typeIds) {
                return;
            }
            store.get('typeList').then(typeList => {
                    this.setState({
                        typeIds,
                        typeList
                    });
                }
            );
            typeIds.forEach((typeId) => {
                readActions.requestArticleList(false, true, typeId);
                pages.push(1);
            });
        });
    }

    componentDidMount() {
        const {readActions} = this.props;
        DeviceEventEmitter.addListener('changeCategory', (typeIds) => {
            typeIds.forEach((typeId) => {
                readActions.requestArticleList(false, true, typeId);
                pages.push(1);
            });
            this.setState({
                typeIds
            });
            setTimeout(()=>this.tabView.goToPage(0),0);
        });
        DeviceEventEmitter.addListener('gotoCategory', (index) => {
            this.tabView.goToPage(index)
        });


        // InteractionManager.runAfterInteractions(() => {
        //
        // });
    }

    componentWillReceiveProps(nextProps) {
        const {read} = this.props;
        if (
            read.isLoadMore &&
            !nextProps.read.isLoadMore &&
            !nextProps.read.isRefreshing
        ) {
            if (nextProps.read.noMore) {
                // ToastUtil.showShort('No more data...');
                const index = this.state.typeIds.indexOf(currentLoadMoreTypeId);
                if (index >= 0) {
                    pages[index] -= 1;
                }
            }
        }
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('changeCategory');
    }

    onRefresh(typeId) {
        const {readActions} = this.props;
        readActions.requestArticleList(true, false, typeId);
        const index = this.state.typeIds.indexOf(typeId);
        if (index >= 0) {
            pages[index] = 1;
        }
    }

    onPress(article) {
        const {navigate} = this.props.navigation;
        navigate('Web', {article});
    }

    onIconClicked() {
        this.drawer.openDrawer();
    }

    onEndReached(typeId) {
        currentLoadMoreTypeId = typeId;
        const time = Date.parse(new Date()) / 1000;
        const index = this.state.typeIds.indexOf(typeId);
        if (index < 0) {
            return;
        }
        if (time - loadMoreTime > 1) {
            pages[index] += 1;
            const {readActions} = this.props;
            readActions.requestArticleList(false, false, typeId, true, pages[index]);
            loadMoreTime = Date.parse(new Date()) / 1000;
        }
    }

    renderFooter() {
        const {read} = this.props;
        if (read.isLoadMore) {
            return (
                <View style={styles.footerContainer}>
                    <ActivityIndicator size="small" color="#3e9ce9"/>
                    <Text style={styles.footerText}>
                        Loading...
                    </Text>
                </View>
            );
        }
        return <View />;
    }

    renderItem(article) {
        return (
            <TouchableOpacity onPress={() => this.onPress(article)}>
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

    renderContent(dataSource, typeId) {
        const {read} = this.props;
        if (read.loading) {
            return <LoadingView />;
        }
        const isEmpty =
            read.articleList[typeId] === undefined ||
            read.articleList[typeId].length === 0;
        if (isEmpty) {
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={styles.base}
                    refreshControl={
                        <RefreshControl
                            style={styles.refreshControlBase}
                            refreshing={read.isRefreshing}
                            onRefresh={() => this.onRefresh(typeId)}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{alignItems: 'center'}}>
                        <Image style={{width:70,height:70,opacity:0.3}} source={require('../img/Oops.png')}/>
                        <Text style={{fontSize: 16,opacity:0.5}}>
                            Found Nothing
                        </Text>
                    </View>
                </ScrollView>
            );
        }
        return (
            <ListView
                initialListSize={1}
                dataSource={dataSource}
                renderRow={this.renderItem}
                style={styles.listView}
                onEndReached={() => this.onEndReached(typeId)}
                onEndReachedThreshold={10}
                renderFooter={this.renderFooter}
                refreshControl={
                    <RefreshControl
                        style={styles.refreshControlBase}
                        refreshing={read.isRefreshing}
                        onRefresh={() => this.onRefresh(typeId)}
                        title="Loading..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                }
            />
        );
    }

    renderScrollTab(){
        const {read} = this.props;
        if (this.state.typeIds.length>0){
            return (
                <ScrollableTabView
                    ref={(tabView) => {
                        this.tabView = tabView;
                    }}
                    initialPage={0}
                    renderTabBar={() => <ScrollableTabBar style={styles.topTabBar}/>}
                    tabBarBackgroundColor="#fcfcfc"
                    tabBarUnderlineStyle={styles.tabBarUnderline}
                    tabBarActiveTextColor="#11acba"
                    tabBarInactiveTextColor="#aaaaaa"
                >
                    {this.state.typeIds.map((typeId) => {
                        let name = '';
                        if (this.state.typeList === null) {
                            return null;
                        }
                        for (let i = 0, l = this.state.typeList.length; i < l; i++) {
                            if (typeId === this.state.typeList[i].id) {
                                name = this.state.typeList[i].name;
                                break;
                            }
                        }
                        const typeView = (
                            <View key={typeId} tabLabel={name} style={styles.base}>
                                {this.renderContent(
                                    this.state.dataSource.cloneWithRows(
                                        read.articleList[typeId] === undefined
                                            ? []
                                            : read.articleList[typeId]
                                    ),
                                    typeId
                                )}
                            </View>
                        );
                        return typeView;
                    })}
                </ScrollableTabView>
            );
            return LoadingView;
        }

    }

    renderHeader(){
        return (
            <View style={styles.header}>
                <Icon.Button
                    name="md-menu"
                    style={{marginLeft:5}}
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    size={25}
                    // activeOpacity={0.8}
                    onPress={() => {
                        this.props.navigation.navigate('DrawerOpen')
                    }}
                />
                <Text style={styles.headerTitle}>Security Headlines</Text>
                <Icon.Button
                    name="md-search"
                    style={{}}
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    size={30}
                    // activeOpacity={0.8}
                    onPress={() => {
                        this.props.navigation.navigate('Search')
                    }}
                />
            </View>
        )
    }

    renderAddCateButton(){
        return (
            <TouchableOpacity style={{
                position: 'absolute',
                top: Platform.OS === 'ios'?56:36,
                right: 0,
                backgroundColor: 'white',
                width: 35,
                height: 38,
                // borderRadius: 25,
                borderColor:'#C8C8C8' ,
                borderBottomWidth:1 ,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 20,
                zIndex: 2
            }} onPress={() => {
                this.props.navigation.navigate('Category');
            }}>
                <Text style={{fontSize:25,color:'#11acba'}}>
                    +
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {iosStatusBar({backgroundColor:"#1D1D1D",
                    barStyle:"light-content"})}
                {this.renderHeader()}
                {this.renderScrollTab()}
                {this.renderAddCateButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topTabBar: {
        height:45,
        marginTop:-7,
        marginRight:35,
        backgroundColor: 'white'
    },
    header: {
        backgroundColor:'#282828',
        height:56,
        shadowColor:'black',
        shadowOpacity:0.1,
        shadowRadius:0.5,
        shadowOffset:{"height":0.5},
        elevation:4,
        // paddingTop:0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight:'bold'
    },
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
        backgroundColor: '#1D1D1D'
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
        backgroundColor: '#11acba',
        height: 2
    }
});

Main.propTypes = propTypes;

export default Main;
