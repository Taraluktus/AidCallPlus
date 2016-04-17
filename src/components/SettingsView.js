import React, {View, Text, StyleSheet} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});


export default class SettingsView extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.sceneStyle]}>
        <Text>Tab {this.props.title}</Text>
      </View>
    );
  }
}
