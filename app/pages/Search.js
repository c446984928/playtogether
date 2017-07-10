import React, {Component} from 'react';
import {
    View,
    TouchableOpacity, Text, StyleSheet, Keyboard, ListView, TouchableHighlight
} from 'react-native';
import SearchBar from 'react-native-searchbar';
import Button from '../components/Button';
import {NavigationActions} from "react-navigation";
import store from 'react-native-simple-store';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';
import * as api from '../helper/api';
import iosStatusBar from "../components/iosStatusBar";

export default class SearchContainer extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        title: 'Search'
    });

    constructor(props) {
        super(props);

        this.state = {
            dropdownList:[],
            dropdownListDS: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            searchHistory: [],
            hotList: []
        };
        this._handleResults = this._handleResults.bind(this);
        this._goBack = this._goBack.bind(this);
        this._doSearch = this._doSearch.bind(this);
        this._cleanHistory = this._cleanHistory.bind(this);
        this._getHotKeywords = this._getHotKeywords.bind(this);
        this.renderSearchHistory = this.renderSearchHistory.bind(this);
        this._updateHistory = this._updateHistory.bind(this);
        this._getDropdownList = this._getDropdownList.bind(this);
    }

    componentWillMount() {
        store.get('searchHistory').then((historys) => {
            if (!historys || !_.isArray(historys) || historys.length <= 0) {
                historys = [];
            }
            this.setState({searchHistory: historys});
        });
        this._getHotKeywords();
    }

    _getHotKeywords(){
        api.getHotList().then(resData => {
            this.setState({hotList:(resData||[])});
        }).catch(err => {
            //todo
        });
    }

    _getDropdownList(inputStr){
        let self = this;
        if(!inputStr){
            return self.setState({dropdownList:[]});
        }
        api.getDropdownList({prefix:inputStr}).then((ret) => {
            self.setState({dropdownList:ret});
        }).catch(err => {
            console.error('[get search dropdown list]'+err.message,err.stack);
            // ToastUtil.showShort('');
        })
    }

    _handleResults(results) {
        this.setState({results});
    }

    _goBack() {
        this.props.navigation.dispatch(NavigationActions.back())
    }

    _doSearch(input) {
        let userInput = input || this.searchBar.getValue() || '';
        if (!userInput) {
            return;
        }
        Keyboard.dismiss();
        this._updateHistory(userInput);
        this.props.navigation.navigate('SearchResult', {searchContent: userInput});

    }

    _updateHistory(newItem){
        store.get('searchHistory').then((historys) => {
            let newHistorys;
            if (!historys || !_.isArray(historys) || historys.length <= 0) {
                newHistorys = [newItem];
            } else {
                _.pull(historys,newItem);
                historys.unshift(newItem);
                newHistorys = historys;
            }
            store.save('searchHistory', newHistorys);
            this.setState({searchHistory: newHistorys});
        });
    }

    _cleanHistory(){
        store.save('searchHistory', []);
        this.setState({searchHistory: []});
    }

    renderItem(item) {
        return (
            <Button
                key={item}
                containerStyle={[
                    styles.textButton,
                    {backgroundColor: '#fcfcfc'}
                ]}
                style={[
                    styles.keywordText,
                    // {color: 'black'}
                ]}
                text={item}
                title={item}
                onPress={() => {
                    this._updateHistory(item);
                    Keyboard.dismiss();
                    this.props.navigation.navigate('SearchResult', {searchContent: item})
                }}
            />

        );
    }

    renderDropdown() {
        if (this.state.dropdownList.length > 0) {
            return (
                <ListView style={styles.dropdownList}
                          keyboardShouldPersistTaps="always"
                          dataSource={this.state.dropdownListDS.cloneWithRows(this.state.dropdownList)}
                          renderRow={(item) => {
                              return (
                                  <View style={{borderBottomWidth: 1, borderColor: 'lightgray'}}>
                                      <Text style={{padding: 5, marginLeft: 10, fontSize: 18}}
                                            onPress={() => {
                                                this._doSearch(item);
                                            }}>
                                          {item}
                                      </Text>
                                  </View>
                              )
                          }}
                />
            )
        }
        return <View style={{marginTop:70}}/>;
    }

    renderHotLists() {
        if (this.state.hotList.length > 0) {
            return (
                <View style={styles.hotSearch}>
                    <Text style={[styles.groupTitle, {color: 'grey', width: 100}]}>
                        Hot Search:
                    </Text>
                    <View style={styles.gridLayout}>
                        {this.state.hotList.map((item) => {
                            return this.renderItem(item);
                        })}
                    </View>
                </View>
            )
        }
        return <View/>;
    }

    renderSearchHistory() {
        if (this.state.searchHistory.length>0){
            return (
                <View style={styles.historySearch}>
                    <View style={{justifyContent: 'space-between',flexDirection: 'row'}}>
                        <Text style={[styles.groupTitle, {color: 'grey',width: 200}]}>
                            Search History:
                        </Text>
                        <Icon.Button
                            style={{padding:0}}
                            name="md-trash"
                            size={20}
                            color="grey"
                            activeOpacity={0.8}
                            underlayColor="transparent"
                            backgroundColor="transparent"
                            onPress={() => setTimeout(this._cleanHistory,0)}
                        />
                    </View>
                    <View style={styles.gridLayout}>
                        {this.state.searchHistory.map((item) => {
                            return this.renderItem(item);
                        })}
                    </View>
                </View>
            )
        }
        return <View />;
    }

    render() {
        return (
            <View>
                <SearchBar
                    placeholder={'search here ...'}
                    ref={(ref) => this.searchBar = ref}
                    handleResults={this._handleResults}
                    handleChangeText={this._getDropdownList}
                    onBack={this._goBack}
                    onSubmitEditing={this._doSearch}
                    backgroundColor={'#1D1D1D'}
                    iconColor={'white'}
                    textColor={'white'}
                    showOnLoad
                />
                {this.renderDropdown()}
                {this.renderHotLists()}
                {this.renderSearchHistory()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    groupTitle: {
        fontSize: 16,
        textAlign: 'left',
        color: '#fff'
    },
    dropdownList: {
        marginTop:70,
        padding: 10,
        backgroundColor: '#fcfcfc'
    },
    hotSearch: {
        marginTop:5,
        padding: 10,
        backgroundColor: '#fcfcfc'
    },
    historySearch: {
        marginTop:5,
        padding: 10,
        backgroundColor: '#fcfcfc'
    },
    textButton: {
        margin: 5,
        padding: 5,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'lightgrey'
    },
    keywordText: {
        fontSize: 16,
        textAlign: 'center'
    },
    gridLayout: {
        // marginTop:100,
        // flex: 1,
        // alignItems: 'center',
        // backgroundColor: 'gray',
        marginTop:5,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection:'row'
    },
});
