const express = require('express');
const bodyParser = require('body-parser');
const manager = require('../../../manager');
exports.getalluserInfo = async(request, response) => {
    const dataSnapshot = await manager.admin.database().ref('/User').once('value');
    //var data= JSON.parse(dataSnapshot);
    response.send(JSON.stringify(dataSnapshot));
};
exports.login = async(request, response) => {
    const { username, password } = request.body;
    const data = {
        username,
        password
    };
    const userAccount = await manager.admin.database().ref('/User').child('/' + data.username).once('value');
    let object = JSON.parse(JSON.stringify(userAccount));
    if (object.Password == data.password) {
        response.status(200).send('true');
    } else {
        response.status(400).send('false');
    }
};
exports.getuserinfo = async(request, response) => {
    const userName = request.params.userName;
    const dataSnapshot = await manager.admin.database().ref('/User').child('/' + userName).once('value');
    response.send(JSON.stringify(dataSnapshot));
};
exports.createuser = (request, response) => {
    const { username, password, fullname, gender, email, birthday, role } = request.body;
    const data = {
        username,
        password,
        fullname,
        gender,
        email,
        birthday,
        role
    }
    const addData = manager.admin.database().ref('/User').child('/' + data.username).set(data);
    response.send('Done');
};
exports.deleteuser = async(request, response) => {
    let userID = request.params.userName;
    await manager.admin.database().ref('/User').child('/' + userID).remove().then(() => response.status(200).send('Delete user with userName' + userID));
}