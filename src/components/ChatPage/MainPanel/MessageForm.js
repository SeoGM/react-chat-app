import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { getDatabase, set, ref, push, child } from "firebase/database";
import { getStorage, ref as strRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function MessageForm() {
	const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
	const user = useSelector(state => state.user.currentUser);
	const [content, setContent] = useState("");
	const [errors, setErrors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [percentage, setPercentage] = useState(0);
	const messagesRef = ref(getDatabase(), "messages");
	const inputOpenImageRef = useRef();
	
	const handleChange = (event) => {
		setContent(event.target.value)
	}
	
	const createMessage = (fileUrl = null) => {
		const message = {
			timestamp: new Date().getTime(),
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
	
	const handleOpenImageRef = () => {
		inputOpenImageRef.current.click();
	}
	
	
	const handleUploadImage = async (event) => {
		const storage = getStorage();
		const file = event.target.files[0];
		
		if(!file) return;
		
		const filePath = `message/public/${file.name}.jpg`;
		const metadata = { constType: file.type };
		
		try {
			setLoading(true);
			const storageRef = strRef(storage, filePath);
			const uploadTask = uploadBytesResumable(storageRef, file, metadata);
			
			uploadTask.on('state_changed', 
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					console.log('Upload is ' + progress + '% done');
					setPercentage(progress);
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused');
							break;
						case 'running':
							console.log('Upload is running');
							break;
					}
				}, 
				(error) => {
					// Handle unsuccessful uploads
					setLoading(false);
				}, 
				() => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						set(push(child(messagesRef, chatRoom.id)), createMessage(downloadURL));
						setLoading(false);
					});
				}
			);
		} catch(error) {
			
		}
		
		
	}
	
	return (
		<div>
			<Form onSubmit={ handleSubmit }>
				<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
					<Form.Control value={content} onChange={handleChange} as="textarea" rows={3} />
				</Form.Group>
			</Form>
			{
				!(percentage === 0 || percentage === 100) &&
				<ProgressBar variant="warning" label={`${percentage}%`} now={percentage} />
			}
			<div>
				{errors.map(errorMsg => <p style={{ color: 'red' }} ket={errorMsg}>{ errorMsg }</p>)}
			</div>
			<Row>
				<Col><Button className="message-form-button" onClick={ handleSubmit } disabled={ loading }>SEND</Button>{' '}</Col>
				<Col><Button className="message-form-button" onClick={ handleOpenImageRef } disabled={ loading }>UPLOAD</Button>{' '}</Col>
				<input type="file" accept="image/jpeg, image/png" style={{ display: 'none' }} ref={ inputOpenImageRef } onChange={ handleUploadImage }></input>
			</Row>
		</div>
	)
}

export default MessageForm;