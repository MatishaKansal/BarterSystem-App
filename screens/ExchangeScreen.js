import * as React from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  View,
  Alert,
} from "react-native";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";
import HomeScreen from "./HomeScreen";

export default class ExchangeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      BarterName: "",
      reasonToRequest: "",
      Barter_status: "",
      isBarterRequestActive: "",
      requested_BarterName: "",
      request_id: "",
      userDocId: "",
      currencyCode: "",
      docId: "",
      dataSource: "",
      showFlatlist: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addItem = (itemName, description) => {
    var userName = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("exchange_requests").add({
      username: userName,
      item_name: this.state.Iname,
      exchange_id: randomRequestId,
      item_description: this.state.Idescription,
      itwm_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getBarterRequest();
    db.collection("Users")
      .where("emailId", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("Users").doc(doc.id).update({
            isBarterRequestActive: true,
          });
        });
      });
    this.setState({
      item_Name: "",
      item_description: "",
      request_id: randomRequestId,
    });

    return Alert.alert("Barter Requested Successfully");
  };

  receivedBarters = (iName) => {
    var userId = this.state.userId;
    var request_id = this.state.request_id;
    db.collection("Received_barters").add({
      user_id: userId,
      barter_name: Iname,
      request_id: request_id,
      barter_status: "received",
    });
  };

  getIsBarterRequestActive() {
    db.collection("Users")
      .where("emailId", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            isBarterRequestActive: doc.data().isBarterRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getBarterRequest = () => {
    var BarterRequest = db
      .collection("requested_Barters")
      .where("userId", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().Barter_status !== "received") {
            this.setState({
              request_id: doc.data().request_id,
              Barter_status: doc.data().Barter_status,
              requested_BarterName: doc.data().Barter_name,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and Barter nam
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var BarterName = doc.data().Barter_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the Barter " + BarterName,
                  notification_status: "unread",
                  Barter_name: BarterName,
                });
              });
            });
        });
      });
  };

  async getBartersFromApi(Barter_name) {
    this.setState({ Barter_name: Barter_name });
    if (Barter_name.length > 2) {
      var Barters = await BarterSearch.searchBarter(
        Barter_name,
        "AIzaSyAbIkm84vBe8frfcGiuOoFyqIJYb4ROBUk"
      );
      this.setState({
        dataSource: Barters.data,
        showFlatlist: true,
      });
    }
    //render Items  functionto render the Barters from api
    renderItem = ({ item, i }) => {
      console.log("image link ");

      let obj = {
        title: item.volumeInfo.title,
        selfLink: item.selfLink,
        buyLink: item.saleInfo.buyLink,
        imageLink: item.volumeInfo.imageLinks,
      };

      return (
        <TouchableHighlight
          style={{
            alignItems: "center",
            backgroundColor: "#DDDDDD",
            padding: 10,

            width: "90%",
          }}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => {
            this.setState({
              showFlatlist: false,
              BarterName: item.volumeInfo.title,
            });
          }}
          bottomDivider
        >
          <Text> {item.volumeInfo.title} </Text>
        </TouchableHighlight>
      );
    };
  }

  componentDidMount() {
    this.getBarterRequest();
    this.getIsBarterRequestActive();
  }

  updateBarterRequestStatus = () => {
    //updating the Barter status after receiving the Barter
    db.collection("requested_Barters").doc(this.state.docId).update({
      Barter_status: "recieved",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsBarterRequestActive: false,
          });
        });
      });
  };

  render() {
    if (this.state.IsBarterRequestActive === true) {
      return (
        // Status screen

        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Barter Name</Text>
            <Text>{this.state.requested_BarterName}</Text>
          </View>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text> Barter Status </Text>

            <Text>{this.state.Barter_status}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "orange",
              backgroundColor: "orange",
              width: 300,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateBarterRequestStatus();
              this.receivedBarters(this.state.requested_BarterName);
            }}
          >
            <Text>I recieved the Barter </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        // Form screen
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Barter" navigation={this.props.navigation} />

          <View>
            <TextInput
              style={styles.formTextInput}
              placeholder={"enter Barter name"}
              onChangeText={(text) => this.getBartersFromApi(text)}
              onClear={(text) => this.getBartersFromApi("")}
              value={this.state.Barter_name}
            />

            {this.state.showFlatlist ? (
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                enableEmptySections={true}
                style={{ marginTop: 10 }}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <TextInput
                  style={[styles.formTextInput, { height: 300 }]}
                  multiline
                  numberOfLines={8}
                  placeholder={"Why do you need the Barter"}
                  onChangeText={(text) => {
                    this.setState({
                      reason_to_request: text,
                    });
                  }}
                  value={this.state.reason_to_request}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.addRequest(
                      this.state.Barter_name,
                      this.state.reason_to_request
                    );
                  }}
                >
                  <Text>Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});




  addItem = (itemName, description) => {
    var userName = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("exchange_requests").add({
      username: userName,
      item_name: this.state.Iname,
      exchange_id: randomRequestId,
      item_description: this.state.Idescription,
    });
    this.setState({
      Iname: "",
      Idescription: "",
    });

    return Alert.alert("Item ready to exchange", "", [
      {
        text: "OK",
        onPress: () => {
          this.props.navigation.navigate("HomeScreen");
        },
      },
    ]);
  };

  getData(){
    fetch("")
    .then(response => {
    return response.json();
    }).then(responseData => {
    var currencyCode = this.state.currencyCode
    var currency = responseData.rates.INR
    var value = 60 / currency
    console.log(value);
    })
  }
    
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Request Barter" navigation={this.props.navigation} />
        <KeyboardAvoidingView style={styles.keyBoardStyle}>
          <TextInput
            style={styles.formTextInput}
            placeholder={"Enter item name"}
            onChangeText={(text) => {
              this.setState({
                Iname: text,
              });
            }}
            value={this.state.Iname}
          />
          <TextInput
            style={[styles.formTextInput, { height: 300 }]}
            multiline
            numberOfLines={8}
            placeholder={"Item Description"}
            onChangeText={(text) => {
              this.setState({
                Idescription: text,
              });
            }}
            value={this.state.Idescription}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.addItem(this.state.Iname, this.state.Idescription);
            }}
          >
            <Text
              style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}
            >
              Add Item
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    )
  }

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
