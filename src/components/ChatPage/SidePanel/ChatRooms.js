import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { getDatabase, ref, push, child, update } from "firebase/database";

export class ChatRooms extends Component {
	
	state = {
		show: false,
		name: "",
		description: "",
		chatRoomsRef: ref(getDatabase(), 'chatRooms')
	}
	
	handleClose = () => this.setState({show : false});
	handleShow = () => this.setState({show: true});
	
	handleSubmit = (e) => {		
		e.preventDefault();
		
		const { name, description } = this.state;
		
		if(this.isFormValid(name, description)) {
			this.addChatRoom();
		}
	}
	
	addChatRoom = async () => {
		const key = push(this.state.chatRoomsRef).key;
		const { name, description } = this.state;
		const { user } = this.props;
		
		
		const newChatRoom = {
			id: key,
			name: name,
			description: description,
			createdBy: {
				name: user.displayName,
				image: user.photoURL
			}
		}
		
		try {
			await update(child(this.state.chatRoomsRef, key), newChatRoom);
			this.setState({
				name: "",
				description: "",
				show: false
			})
		} catch(error) {
			alert(error);
		}
	}
	
	isFormValid = (name, description) => name && description;
	
	render() {
		return (
			<div>
				<div style={{
						position: 'relative', width: '100%',
						display: 'flex', alignItems: 'center'
				}}>
					<FaRegSmileWink style={{ marginRight: 3}} />
					CHAT ROOMS {" "} (1)
					<FaPlus style={{ position: 'absolute', right: 0, cursor: 'pointer' }} onClick={this.handleShow} />
				</div>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Create a chat room</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={ this.handleSubmit } >
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label>ROOM NAME</Form.Label>
								<Form.Control type="text" placeholder="Enter a chat room name" onChange={(e)=>this.setState({name: e.target.value})} />
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>ROOM DESCRIPTION</Form.Label>
								<Form.Control type="text" placeholder="Enter a room discription" onChange={(e)=>this.setState({description: e.target.value})} />
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={ this.handleSubmit }>
							Create
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)	
	}
}

const mapStateToProps = state => {
	return {
		user: state.user.currentUser,
		
	}
}

export default connect(mapStateToProps)(ChatRooms);