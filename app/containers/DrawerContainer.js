import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MainContainer from '../containers/MainContainer';
import {ScrollView, Text, View, StyleSheet, TouchableOpacity, Share, Image, Platform} from "react-native";
import {DrawerNavigator} from "react-navigation/lib-rn/react-navigation";
import ToastUtil from '../utils/ToastUtil';

export default DrawerContainer = DrawerNavigator(
    {
        Main: {screen: MainContainer},
    },
    {
        drawerWidth: 250,
        contentComponent: props => (
            <View style={styles.drawer}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('DrawerClose');
                    }}>
                    <View style={styles.item}>
                        <Image style={styles.itemImg}
                               source={require('../img/icon/home.png')}/>
                        <Text style={styles.itemText}>首页</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('DrawerClose');
                        setTimeout(() => props.navigation.navigate('Category'), 0);
                    }}>
                    <View style={styles.item}>
                        <Image style={styles.itemImg}
                               source={require('../img/icon/category.png')}/>
                        <Text style={styles.itemText}>分类</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('DrawerClose');
                        setTimeout(() => props.navigation.navigate('Feedback'), 0);
                    }}>
                    <View style={styles.item}>
                        <Image style={styles.itemImg}
                               source={require('../img/icon/feedback.png')}/>
                        <Text style={styles.itemText}>反馈</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('DrawerClose');
                        //todo change to a real download site
                        Share.share({
                            message: '[推荐一个浏览活动的App] ',
                            url: 'https://play.google.com/store/apps/details?id=com.skyaid.securityheadlines',
                            title: '快乐周末'
                        }, {
                            dialogTitle: '快乐周末',
                            tintColor: 'green'
                        }).then(() => {return null})
                            .catch((error) => ToastUtil.showShort("Share error "+error.message));
                    }}>
                    <View style={[styles.item,(Platform.OS === 'ios')?{display:'none'}:{}]}>
                        <Image style={styles.itemImg}
                               source={require('../img/icon/share.png')}/>
                        <Text style={styles.itemText}>分享</Text>
                    </View>
                </TouchableOpacity>

                {/*<DrawerItems {...props} />*/}
            </View>
        )
    }
);

const styles = StyleSheet.create({
    item: {
        height: 50,
        // justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor:'green',
        padding: 15,
        margin: 5
        // borderBottomWidth: 1,
        // borderColor: '#F0F0F0'

    },
    itemImg: {
        width: 35,
        height: 35,
        marginLeft:30,
        marginRight: 10
    },
    itemText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '100',
        marginLeft: 15
    },
    drawer:{
        flex:1,
        backgroundColor: '#1D1D1D',
        justifyContent: 'center',
        // alignItems:'center'
    }
});