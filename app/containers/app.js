import {StackNavigator} from 'react-navigation';
import Splash from '../pages/Splash';
import CategoryContainer from '../containers/CategoryContainer';
import WebViewPage from '../pages/WebViewPage';
import Feedback from '../pages/Feedback';
import About from '../pages/About';
import Search from '../pages/Search';
import SearchResult from '../pages/SearchResult';
import * as React from "react";
import DrawerContainer from "./DrawerContainer";
import {StatusBar, View} from "react-native";
import City from '../pages/City';


const AppContent = StackNavigator(
    {
        Splash: {screen: Splash},
        Category: {screen: CategoryContainer},
        Home: {
            screen: DrawerContainer,
            navigationOptions: {
                header:null
            }
        },
        Web: {screen: WebViewPage},
        Search: {screen: Search},
        SearchResult: {screen: SearchResult},
        Feedback: { screen: Feedback },
        City: {screen: City},
        About: {screen: About}
    },
    {
        headerMode: 'screen',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#282828'
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: 20
            },
            headerTintColor: '#fff'
        }
    }
);

const App = () =>
    <View style={{flex: 1}}>
        <StatusBar
            backgroundColor="black"
            barStyle="light-content"
        />
        <AppContent />
    </View>;


export default App;
