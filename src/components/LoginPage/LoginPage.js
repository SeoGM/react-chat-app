import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
	
	const { register, watch, formState: { errors }, handleSubmit } = useForm();
	const [errorFromSubmit, setErrorFromSubmit] = useState("");
	const [loading, setLoading] = useState(false);
	
	const onSubmit = async (data) => {
		
		const auth = getAuth();
		
		try {
			setLoading(true);
			
			await signInWithEmailAndPassword(auth, data.email, data.password)
			
			setLoading(false); 
		} catch(error) {
			setErrorFromSubmit(error.message)
			setLoading(false);
			setTimeout(() => {
					setErrorFromSubmit("")
			}, 5000);
		}
	}
	
	
	return (
		<div className="auth-wrapper">
			<div style={{ textAlign: 'center', color: 'white' }}><h3>Login</h3></div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label>Email</label>
				<input name="email" type="email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
				{ errors.email && <span>This field is required</span> }

				<label>Password</label>
				<input name="password" type="password" {...register("password", { required: true, minLength: 6})} />
				{errors.password && errors.password.type === "required" && <span>This field is required</span>}
				{errors.password && errors.password.type === "minLength" && <span>Password must have at least 6 characters</span>}
				
				{errorFromSubmit && <p>{errorFromSubmit}</p>}
				
				<input type="submit" disabled={loading} />
				
				<Link style={{ color: 'grey', textDecoration: 'none' }} to="/register">Sign up</Link>
    	</form>
		</div>
	)
}

export default LoginPage;