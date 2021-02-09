import * as React from "react";
import { Text, View } from "react-native";
import AppStackNavigator from "../components/AppStackNavigator";

export default class RecieverDetailsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      recieverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      bookName: this.props.navigation.getParam("details")["book_name"],
      reasonForRequesting: this.props.navigation.getParam("details")[
        "reason_for_request"
      ],
      recieverName: "",
      recieverContact: "",
      recieverAddress: "",
      recieverRequestDocId: "",
      username: "",
    };
  }

  getRecieverDetails() {
    db.collection("Users")
      .where("emailId", "==", this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverName: doc.data().First_name,
            recieverContact: doc.data().Contact,
            recieverAddress: doc.data().Address,
          });
        });
      });

    db.collection("requested_books")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ recieverRequestDocId: doc.id });
        });
      });
  }

  addNotification = () => {
    var message =
      this.state.username + "has shown interest in donating barters";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.recieverId,
      donor_id: this.state.userId,
      book_name: this.state.book_name,
      request_id: this.state.request_id,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getRecieverDetails();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#696969"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: "Donate Books",
              style: { color: "#90A5A9", fontSize: 20, fontWeight: "bold" },
            }}
            backgroundColor="#eaf8fe"
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Book Information"} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name : {this.state.bookName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason : {this.state.reason_for_requesting}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={"Reciever Information"} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.recieverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.recieverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.recieverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.recieverId !== this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addNotification();
                this.props.navigation.navigate("MyBartersScreen");
              }}
            >
              <Text>I want to Donate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
