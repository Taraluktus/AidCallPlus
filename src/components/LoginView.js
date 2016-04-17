import React, {View, Text, TextInput, StyleSheet, TouchableHighlight, PropTypes} from "react-native";
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import * as sagaConstants from "../sagas/sagaConstants";
const t = require("tcomb-form-native");



const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  }
});


let Form = t.form.Form;
let options = {
  label: "Falls du schon registriert bist, kannst du dich hier einloggen:",
  fields: {
    email: {
      autoCapitalize: "none",
      autoCorrect: false,
      autoFocus: true,
      keyboardType: "email-address",
      label: "E-Mail",
      error: "E-Mail-Adresse wird benötigt"
    },
    password: {
      autoCapitalize: "none",
      autoCorrect: false,
      secureTextEntry: true,
      label: "Passwort",
      error: "Passwort wird benötigt"
    }
  }
};
let LoginData = t.struct({
  email: t.String,
  password: t.String
});






class LoginView extends React.Component {

  onPress() {
    let value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      const {dispatch} = this.props;
      dispatch({
        type: sagaConstants.USER_LOGIN_REQUEST,
        payload: {
          email: value.email,
          password: value.password
        }
      });
      Actions.radar();
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.sceneStyle]}>
        <Form
          ref="form"
          type={LoginData}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={() => this.onPress() } underlayColor="#99d9f4">
          <Text style={styles.buttonText}>Einloggen</Text>
        </TouchableHighlight>
      </View>
    );
  }

}


export default connect()(LoginView);
