import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { getDatabase, set, ref, push, child } from "firebase/database";

function MessageForm() {
	const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
	const user = useSelector(state => state.user.currentUser);
	const [content, setContent] = useState("");
	const [errors, setErrors] = useState([]);
	const [loading, setLoading] = useState(false);
	const messagesRef = ref(getDatabase(), "messages");
	
	const handleChange = (event) => {
		setContent(event.target.value)
	}
	
	const createMessage = (fileUrl = null) => {
		const message = {
			timestamp: new Date(),
			user: {
				id: user.uid,
				name: user.displayName,
				image: user.photoURL
			}
		}
		
		if( fileUrl !== null ) {
			message["image"] = fileUrl;
		} else {
			message["content"] = content;
		}
		
		return message;
	}
	
	const handleSubmit = async () => {
		
		if(!content) {
			setErrors(prev => prev.concat("Type contens first"));
			return;
		}
		setLoading(true);
		
		try {
			await set(push(child(messagesRef, chatRoom.id)), createMessage());
			setLoading(false);
			setContent("");
			setErrors([]);
		} catch(error) {
			setErrors(pre => pre.concat(error.message))
			setLoading(false);
			setTimeout(() => {
				setErrors([]);
			}, 5000);
		}
	}
	
	return (
		<div>
			<Form onSubmit={ handleSubmit }>
				<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
					<Form.Control value={content} onChange={handleChange} as="textarea" rows={3} />
				</Form.Group>
			</Form>
			<ProgressBar variant="warning" label="60%" now={60} />
			<div>
				{errors.map(errorMsg => <p style={{ color: 'red' }} ket={errorMsg}>{ errorMsg }</p>)}
			</div>
			<Row>
				<Col><Button className="message-form-button" onClick={ handleSubmit }>SEND</Button>{' '}</Col>
				<Col><Button className="message-form-button">UPLOAD</Button>{' '}</Col>
			</Row>
		</div>
	)
}

export default MessageForm;