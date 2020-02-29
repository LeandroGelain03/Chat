import React, { Component } from 'react';
import './App.css';
import Axios from 'axios'
import socketIOClient from 'socket.io-client';

var socket = socketIOClient.connect("http://localhost:3333");

class Chat_app extends Component {
	constructor (props) {
		super(props);
		this.state = {
			previousMessages: [],
			username: "",
			message:"",
			response:""
		}
		this.handleChanges = this.handleChanges.bind(this);
		socket.on("receivedMessage", data => this.state.previousMessages.push(data))
	}
	async getPreviousMessages() {
		await Axios({
			method:"GET",
			url:"http://localhost:3333/message/getPreviousMessages",
			headers: { "Access-Control-Allow-Origin": "*" }
		}).then((response)=> {
			this.setState({
				previousMessages:response.data
			})
		}).catch((error) => console.log(error))
		console.log(this.state.previousMessages)
		socket.on('receivedMessage', data => this.setState({response:data}))
		console.log(this.state.response)
	}
	handleChanges(event){
		let data = {};
		data[event.target.name] = event.target.value;
		this.setState(data);
	}
	submitMessage() {
		const messageObject = {
			"author":this.state.username,
			"message":this.state.message
		}
		this.renderMessages();
		socket.emit("sendMessage", messageObject);
	}
	componentDidMount(){
		this.getPreviousMessages();
		socket.on("previousMessages", data => console.log(data))
	}
	renderMessages(){
		if (this.state.previousMessages.length === 0) {
			return (
				<div><h3>Loading data...</h3></div>
			)
		}
		return this.state.previousMessages.map( messageObjects => {
			return (
			<div><strong>{messageObjects.author}</strong>: {messageObjects.message}</div>
			)
		})
	}
	render() {
		return (
			<div className="body">
				<form id="chat">
					<input type="text" name="username" onChange={this.handleChanges} placeholder=" Digite seu usuário" />
						<div className="messages">{this.renderMessages()}</div>
					<input type="text" name="message" onChange={this.handleChanges} placeholder=" Digite sua menssagem" />
					<button type="button" onClick={() => this.submitMessage()}>enviar</button>
				</form>
			</div>
		)
	}
}

export default Chat_app;
