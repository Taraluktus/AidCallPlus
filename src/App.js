import React, {View, Text, StyleSheet, Component} from "react-native";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from "react-native-router-flux";
const Icon = require("react-native-vector-icons/Ionicons");
import RequiresConnection from "react-native-offline-mode";
import configureStore from "./store/configureStore";
const store = configureStore();
import * as sagaConstants from "./sagas/sagaConstants";
import {Provider, connect} from "react-redux";
import RadarView from "./components/RadarView";
import InfoView from "./components/InfoView";
import SettingsView from "./components/SettingsView";
import LoginView from "./components/LoginView";



class RadarTabIcon extends React.Component {
  render() {
    return (
      <Icon name="map" size={24} style={{ color: this.props.selected ? "red" : "black" }} />
    );
  }
}

class InfoTabIcon extends React.Component {
  render() {
    return (
      <Icon name="information-circled" size={24} style={{ color: this.props.selected ? "red" : "black" }} />
    );
  }
}

class SettingsTabIcon extends React.Component {
  render() {
    return (
      <Icon name="settings" size={24} style={{ color: this.props.selected ? "red" : "black" }} />
    );
  }
}

class LoginTabIcon extends React.Component {
  render() {
    return (
      <Icon name="person" size={24} style={{ color: this.props.selected ? "red" : "black" }} />
    );
  }
}


class Right extends React.Component {
  render() {
    return <Text style={{
      width: 80,
      height: 37,
      position: "absolute",
      bottom: 4,
      right: 2,
      padding: 8
    }}>Right</Text>;
  }
}





class App extends Component {

  componentDidMount() {
    const {dispatch} = store;
    dispatch({ type: sagaConstants.APP_START, payload: dispatch });
  }

  componentWillUnmount() {
    const {dispatch} = store;
    dispatch({ type: sagaConstants.APP_STOP });
  }

  render() {
    return (
      <Provider store={store}>
        <Router sceneStyle={{ backgroundColor: "#F7F7F7" }}>
          <Scene key="tabcontent" tabs={true} default="radar">
            <Scene key="radar" initial={true} title="Radar" icon={RadarTabIcon} component={RadarView} navigationBarStyle={{ backgroundColor: "red" }} titleStyle={{ color: "white" }} renderRightButton={() => <Right/>} />
            
              <Scene key="login" title="Einloggen" icon={LoginTabIcon} component={LoginView} navigationBarStyle={{ backgroundColor: "red" }} titleStyle={{ color: "white" }} renderRightButton={() => <Right/>} />
              <Scene key="settings" title="Einstellungen" icon={SettingsTabIcon} component={SettingsView} navigationBarStyle={{ backgroundColor: "red" }} titleStyle={{ color: "white" }} renderRightButton={() => <Right/>} />
            
            <Scene key="info" title="Info" icon={InfoTabIcon} component={InfoView} navigationBarStyle={{ backgroundColor: "red" }} titleStyle={{ color: "white" }} renderRightButton={() => <Right/>} />
          </Scene>
        </Router>
      </Provider>
    );
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default RequiresConnection(App,
  "Keine Netzwerkverbindung!\n\n" +
  "Diese App benötigt eine Internet-Verbindung.\n" +
  "Sobald wieder eine Verbindung besteht,\nverschwindet dieser Bildschirm.");
