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
    InteractionManager,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter,
    ScrollView,
    RefreshControl,
    Alert, TouchableHighlight
} from 'react-native';

import store from 'react-native-simple-store';
import GridView from '../components/GridView';
import Button from '../components/Button';
import ToastUtil from '../utils/ToastUtil';
import NavigationUtil from '../utils/NavigationUtil';
import Icon from 'react-native-vector-icons/Ionicons';

let maxCategory = 20; // 默认最多类别

const propTypes = {
    categoryActions: PropTypes.object,
    category: PropTypes.object.isRequired
};

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
        this.renderChoosedItem = this.renderChoosedItem.bind(this);
        this.renderUnchoosedItem = this.renderUnchoosedItem.bind(this);
        this.onPressUnChoosedItem = this.onPressUnChoosedItem.bind(this);
        this.onPressChoosedItem = this.onPressChoosedItem.bind(this);

        this.state = {
            typeIds: [],
            editing: false
        };
    }

    componentWillMount() {
        const {params} = this.props.navigation.state;
        if (params === undefined) {
            InteractionManager.runAfterInteractions(() => {
                store.get('typeIds').then((typeIds) => {
                    if (typeIds){
                        this.setState({
                            typeIds: typeIds.sort()
                        });
                    }
                });
            });
        }
    }

    componentDidMount() {
        const {categoryActions} = this.props;
        categoryActions.requestTypeList();

        const {params} = this.props.navigation.state;
        if (params === undefined || !params.isFirst) {
            this.props.navigation.setParams({handleCheck: this.onActionSelected});
        }
    }

    componentWillReceiveProps(nextProps) {
        store.get('typeIds').then((typeIds) => {
            const {category} = nextProps;
            let specialCategorys = Array.from(category.typeList).filter(item => (parseInt(item.id)<10));
            let specialCategoryIds = specialCategorys.map(item => (parseInt(item.id)));

            if (!typeIds || typeIds.length === 0){
                typeIds = []
            }

            let hasNewFlag = false;
            for (let id of specialCategoryIds){
                if (typeIds.indexOf(id) === -1){
                    typeIds.push(id);
                    hasNewFlag = true;
                }
            }
            if (hasNewFlag){
                this.setState({
                    typeIds: typeIds.sort()
                });
                store.save('typeIds', typeIds);
                DeviceEventEmitter.emit('changeCategory', typeIds);
            }
        });

    }

    // componentWillUnmount(){
    //     DeviceEventEmitter.emit('refreshCategory');
    // }

    onRefresh() {
        const {categoryActions} = this.props;
        categoryActions.requestTypeList();
    }

    onPressUnChoosedItem(type) {
        let typeIds = this.state.typeIds;
        const pos = typeIds.indexOf(parseInt(type.id));
        if (pos === -1) {
            typeIds.push(parseInt(type.id));
        }
        this.setState({
            typeIds: typeIds.sort()
        });
        store.save('typeIds', typeIds);
        DeviceEventEmitter.emit('changeCategory', typeIds);
        DeviceEventEmitter.emit('refreshCategory', type.id);
    }

    onPressChoosedItem(type) {
        if (this.state.editing){
            //id 小于10为必选分类，不可删除
            if (parseInt(type.id)<10){
                return;
            }
            let typeIds = this.state.typeIds;
            typeIds = typeIds.filter(item => item !== type.id);
            this.setState({
                typeIds: typeIds.sort()
            });
            store.save('typeIds', typeIds);
            DeviceEventEmitter.emit('changeCategory', typeIds);
        }else {
            if (!this.props.navigation.state.params.isFirst){
                DeviceEventEmitter.emit('gotoCategory', this.state.typeIds.indexOf(type.id));
                this.props.navigation.goBack();
            }
        }
    }

    renderChoosedItem(item) {
        return (
            <Button
                key={item.id}
                containerStyle={[
                    styles.categoryBtn,
                    {backgroundColor: '#F0F0F0'}
                ]}
                style={[
                    styles.categoryText,
                    this.state.editing?{color: 'darkred'}:{color: 'black'}
                ]}
                text={item.name + (this.state.editing && parseInt(item.id)>=10 ?'   ×':'')}
                onPress={() => this.onPressChoosedItem(item)}
            />
        );
    }

    renderUnchoosedItem(item) {
        return (
            <Button
                key={item.id}
                containerStyle={[
                    styles.categoryBtn,
                    {
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: 'lightgray'
                    }
                ]}
                style={[
                    styles.categoryText,
                    {color: 'black'}
                ]}
                text={'+ '+item.name}
                onPress={() => this.onPressUnChoosedItem(item)}
            />
        );
    }


    renderGridView(isFirst) {
        const {category} = this.props;
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={false}
                contentContainerStyle={styles.no_data}
                style={styles.base}
                refreshControl={
                    <RefreshControl
                        refreshing={category.loading}
                        onRefresh={this.onRefresh}
                        title="Loading..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                }
            >
                <Text style={[ styles.btnText, isFirst?{}:{display:'none'}, {color: 'black', padding: 5, fontSize: 18}]}>
                    Welcome! Choose your categories
                </Text>
                <View style={[styles.header,this.state.typeIds.length===0?{display:'none'}:{},{justifyContent: 'space-between',flexDirection: 'row'}]}>
                    <Text style={[styles.cateTitleText]}>
                        我的
                    </Text>
                    <Icon.Button
                        style={{padding:0,paddingTop:2}}
                        name= {this.state.editing?"md-checkmark":"ios-create-outline"}
                        size={20}
                        color="grey"
                        activeOpacity={0.8}
                        underlayColor="transparent"
                        backgroundColor="transparent"
                        onPress={() => this.setState({
                            editing: !this.state.editing
                        })}
                    />
                </View>

                <GridView
                    items={Array.from(category.typeList)
                        .filter(item => (Array.from(this.state.typeIds).indexOf(parseInt(item.id)) !== -1))}
                    renderItem={this.renderChoosedItem}
                    itemsPerRow={2}
                >
                </GridView>
                <View style={styles.header}>
                    <Text style={[styles.cateTitleText]}>
                        所有分类
                    </Text>
                </View>
                <GridView
                    items={Array.from(category.typeList)
                        .filter(item => (Array.from(this.state.typeIds).indexOf(parseInt(item.id)) === -1))}
                    renderItem={this.renderUnchoosedItem}
                    itemsPerRow={2}
                >
                </GridView>

                <Button
                    containerStyle={[isFirst?{}:{display:'none'},styles.sureBtn]}
                    style={styles.btnText}
                    text={'OK'}
                    onPress={() => {
                        if (this.state.typeIds.length === 0){
                            return ToastUtil.showShort('Please choose at least 1 category');
                        }
                        this.props.navigation.state.isFirst = false;
                        store.save("isInit",true);
                        NavigationUtil.reset(this.props.navigation, 'Home');
                    }}
                />
            </ScrollView>
        );
    }

    render() {
        const {params} = this.props.navigation.state;
        if (params !== undefined && params.isFirst) {
            return (
                <View style={styles.container}>
                    {this.renderGridView(true)}
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {this.renderGridView()}
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
    cateTitleText:{
        fontSize: 16,
        //textAlign: 'center',
        color: 'gray'
    },
    categoryBtn: {
        margin: 5,
        padding: 10,
        borderRadius: 3,
        backgroundColor: 'gray'
        // borderWidth: 1,
        // borderColor: 'lightgray'
    },
    categoryText: {
        fontSize: 14,
        textAlign: 'center',
        width:140
    },
    gridLayout: {
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: '#f2f2f2',
        flexWrap: 'wrap',
        // alignItems: 'flex-start',
        flexDirection:'row'
    },
    sureBtn: {
        margin: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#282828'
    },
    btnText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff'
    },
    header: {
        padding: 10,
        backgroundColor: '#fcfcfc'
    }
});

Category.propTypes = propTypes;

export default Category;
