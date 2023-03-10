import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/actions/user_action';

function App() {
	const navigate = useNavigate();
	let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
	
	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				navigate('/');
				dispatch(setUser(user));
			} else {
				navigate('/login');
				dispatch(clearUser());
			}
			
		})
	}, [])
	
	if (isLoading) {
    return <div>...loading</div>;
  } else {
		return (
			<Routes>
				<Route path="/" element={<ChatPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Routes>
		);
	}
}

export default App;