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
import { StyleSheet, TextInput, View, Keyboard } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import ToastUtil from '../utils/ToastUtil';
import * as api from '../helper/api';

let feedbackText;

class Feedback extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Feedback',
      drawerIcon: ({ tintColor }) => (
      <Icon name="md-thumbs-up" size={25} color={tintColor} />
    ),
    headerRight: (
      <Icon.Button
        name="md-checkmark"
        backgroundColor="transparent"
        underlayColor="transparent"
        activeOpacity={0.8}
        onPress={() => {
          navigation.state.params.handleCheck();
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.onActionSelected = this.onActionSelected.bind(this);
  }

  componentDidMount() {
    feedbackText = '';
    this.props.navigation.setParams({ handleCheck: this.onActionSelected });
  }

  onActionSelected() {
    if (feedbackText === undefined || feedbackText.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('Please input your suggestion...');
    } else {
      let feedback = {
          'manufacturer': DeviceInfo.getManufacturer(),
          'system': DeviceInfo.getSystemName(),
          'deviceVersion': DeviceInfo.getSystemVersion(),
          'deviceModel': DeviceInfo.getModel(),
          'appVersion': DeviceInfo.getVersion(),
          'feedback': feedbackText
      };

      api.sendFeedback(feedback).then((ret) => {
          ToastUtil.showShort('We have received your feedback, thanks');
          this.textInput.clear();
          this.props.navigation.goBack();
      }).catch(err => {
          // console.error('[post feedback]'+err.message, err.stack);
          ToastUtil.showShort('Send fackback error, please try later.');
      })

      Keyboard.dismiss();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          style={styles.textInput}
          placeholder="Please tell us your feedback,thanks ！"
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          numberOfLines={200}
          multiline
          autoFocus
          onChangeText={(text) => {
            feedbackText = text;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    padding: 15,
    textAlignVertical: 'top'
  }
});

export default Feedback;
