import React, {View, Text, StyleSheet, PropTypes} from "react-native";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import MapView from "react-native-maps";
import * as selectors from "../selectors/";


const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  text: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});



class RadarView extends React.Component {

  render() {
    const {currentLat, currentLng} = this.props;
    if (!currentLat || !currentLng) {
      return (
        <View style={[styles.container, this.props.sceneStyle]}>
          <Text style={styles.text}>Momentan kein GPS verfügbar</Text>
        </View>
      );
    }
    return (
      <View style={[styles.container, this.props.sceneStyle]}>
        <MapView
          style={[styles.map, this.props.sceneStyle]}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          region={{
            latitude: currentLat,
            longitude: currentLng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          >
          <MapView.Marker coordinate={{
            latitude: currentLat,
            longitude: currentLng
          }}>
          </MapView.Marker>
        </MapView>  
      </View>
    );
  }
}



const mapStateToProps = state => {
  return {
    currentLat: selectors.getCurrentLocationLat(state),
    currentLng: selectors.getCurrentLocationLng(state)
  };
};


RadarView.propTypes = {
  currentLat: PropTypes.number,
  currentLng: PropTypes.number
};


export default connect(mapStateToProps)(RadarView);
