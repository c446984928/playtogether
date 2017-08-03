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
import Icon from 'react-native-vector-icons/Ionicons';
import localCitylist from '../constants/citylist';
import NavigationUtil from '../utils/NavigationUtil';
import ToastUtil from "../utils/ToastUtil";

const propTypes = {};

class City extends React.Component {
    static navigationOptions = ({navigation}) => {
        let option = {
            title: '选择城市',
            drawerIcon: ({tintColor}) => (
                <Icon name="md-pricetags" size={25} color={tintColor}/>
            ),
            headerRight: (
                <Icon.Button
                    name="md-checkmark"
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    activeOpacity={0.8}
                    size={30}
                    onPress={() => {
                        navigation.state.params.handleCheck();
                    }}
                />
            )
        };
        if (navigation.state.params !== undefined && navigation.state.params.isFirst) {
            option.headerLeft = null;
        }
        return option;
    };

    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
        this.renderChoosedItem = this.renderChoosedItem.bind(this);
        this.renderUnchoosedItem = this.renderUnchoosedItem.bind(this);
        this.onPressUnChoosedItem = this.onPressUnChoosedItem.bind(this);
        this.onActionSelected = this.onActionSelected.bind(this);

        this.state = {
            choosedCity: ''
        };
    }

    componentWillMount() {
        store.get('choosedCity').then((choosedCity) => {
            if (choosedCity) {
                this.setState({
                    choosedCity
                });
            }
        });

        this.props.navigation.setParams({
            handleCheck: this.onActionSelected
        });
    }

    componentWillReceiveProps(nextProps) {
    }

    onRefresh() {
    }

    onActionSelected() {
        if (!this.state.choosedCity) {
            ToastUtil.showShort('亲，必须选择一个啊！')
        }
        store.save('choosedCity', this.state.choosedCity).then(() => {
            const {params} = this.props.navigation.state;
            if (params !== undefined && params.isFirst) {
                NavigationUtil.reset(this.props.navigation, 'Category', {isFirst: true});
            } else {
                NavigationUtil.reset(this.props.navigation, 'Home');
            }
        });
    }

    onPressUnChoosedItem(item) {
        store.save('choosedCity', item).then(() => {
            this.setState({choosedCity: item});
        });
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
                    this.state.editing ? {color: 'darkred'} : {color: 'black'}
                ]}
                text={item.name}
                onPress={() => null}
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
                text={'+ ' + item.name}
                onPress={() => this.onPressUnChoosedItem(item)}
            />
        );
    }


    renderGridView(isFirst) {
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={false}
                contentContainerStyle={styles.no_data}
                style={styles.base}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={category.loading}
                //         onRefresh={this.onRefresh}
                //         title="Loading..."
                //         colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                //     />
                // }
            >
                <View style={[styles.header, this.state.choosedCity ? {} : {display: 'none'}, {
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }]}>
                    <Text style={[styles.cateTitleText]}>
                        我的城市
                    </Text>
                </View>
                <GridView
                    items={Array.from(this.state.choosedCity ? [this.state.choosedCity] : [])}
                    renderItem={this.renderChoosedItem}
                    itemsPerRow={2}
                >
                </GridView>

                <View style={styles.header}>
                    <Text style={[styles.cateTitleText]}>
                        所有城市
                    </Text>
                </View>
                <GridView
                    items={Array.from(localCitylist).filter(item => item.id !== this.state.choosedCity.id)}
                    renderItem={this.renderUnchoosedItem}
                    itemsPerRow={3}
                >
                </GridView>
            </ScrollView>
        );
    }

    render() {
        const {params} = this.props.navigation.state;
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
    cateTitleText: {
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
        width: 80
    },
    gridLayout: {
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: '#f2f2f2',
        flexWrap: 'wrap',
        // alignItems: 'flex-start',
        flexDirection: 'row'
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

City.propTypes = propTypes;

export default City;
