import React, { Component } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";
import SwipableFlatlist from "../components/SwipableFlatlist";

export default class NotificationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: firebase.auth().currentUser.email,
      all_notifications: [],
    };
    this.notificationRef = null;
  }

  getNotifications = () => {
    this.requestRef = db
      .collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.user_id)
      .onSnapshot((snapshot) => {
        var allnotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allnotifications.push(notification);
        });
        this.setState({
          all_notifications: allnotifications,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.notificationRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        leftElement={
          <Icon name="book" type="font-awesome" color="#696969"></Icon>
        }
        title={item.book_name}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        subtitle={item.message}
        bottomDivider
      ></ListItem>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title={"Notification"} navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.all_notifications.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 25 }}>YOU HAVE NO NOTIFICATION</Text>
            </View>
          ) : (
            // <FlatList
            //   keyExtractor={this.keyExtractor}
            //   data={this.state.all_notifications}
            //   renderItem={this.renderItem}
            // ></FlatList>
            <SwipableFlatlist
              all_notifications={this.state.all_notifications}
            ></SwipableFlatlist>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
