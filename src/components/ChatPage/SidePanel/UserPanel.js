import React, { useRef } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref as strRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, set, ref } from "firebase/database";
import { setPhotoURL } from '../../../redux/actions/user_action';

function UserPanel() {
	
	const user = useSelector(state => state.user.currentUser)
	const dispatch = useDispatch();
	
	const inputOpenImageRef = useRef();
	
	/** 로그아웃 */
	const handleLogout = () => {
		const auth = getAuth();
		signOut(auth).then(() => {
				// Sign-out successful.
		}).catch((error) => {
				// An error happened.
		});
	}
	
	/** 프로필 변경 버튼 클릭 시 숨겨둔 input 호출 */
	const handleOpenImageRef = () => {
		inputOpenImageRef.current.click();
	}
	
	/** 프로필 이미지 변경 시  */
	const handleUploadImage = async (event) => {
		const storage = getStorage();
		const file = event.target.files[0];
		const metadata = { contentType: file.type };
		
		const auth = getAuth();
		const user = auth.currentUser;
		
		const storageRef = strRef(storage, `user_image/${user.uid}`);
		const uploadTask = uploadBytesResumable(storageRef, file, metadata);
		
		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on('state_changed',
			(snapshot) => {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
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
				// A full list of error codes is available at
				// https://firebase.google.com/docs/storage/web/handle-errors
				switch (error.code) {
					case 'storage/unauthorized':
						// User doesn't have permission to access the object
						break;
					case 'storage/canceled':
						// User canceled the upload
						break;

					// ...

					case 'storage/unknown':
						// Unknown error occurred, inspect error.serverResponse
						break;
				}
			}, 
			() => {
				// Upload completed successfully, now we can get the download URL
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log('File available at', downloadURL);
					
					updateProfile(user, {
						photoURL: downloadURL
					})
					
					dispatch(setPhotoURL(downloadURL))
					set(ref(getDatabase(), `users/${user.uid}`), {
						image: downloadURL
					})
				});
			
				
			}
		);
	}
	
	return (
		<div>
			<h3 style={{ color: 'white' }}>
				<IoIosChatboxes />{" "} Chat App
			</h3>
			
			<div style={{ display: 'flex', marginBottom: '1rem' }}>
				<Image src={user && user.photoURL}
					style={{
						width: '30px', height: '30px', marginTop: '3px'
					}}
					roundedCircle	/>
				
				<Dropdown>
					<Dropdown.Toggle 
						style={{ background: 'transparent', border: '0' }}
						id="dropdown-basic">
						{user && user.displayName}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item onClick={ handleOpenImageRef }>chang profile</Dropdown.Item>
						<Dropdown.Item onClick={ handleLogout }>logout</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				
				<input type="file" accept="image/jpeg, image/png" style={{ display: 'none' }} ref={ inputOpenImageRef } onChange={ handleUploadImage }></input>
			</div>
		</div>
	)
}

export default UserPanel;