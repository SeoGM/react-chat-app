import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";
import md5 from 'md5';

function RegisterPage() {
	
	const { register, watch, formState: { errors }, handleSubmit } = useForm();
	const [errorFromSubmit, setErrorFromSubmit] = useState("");
	const [loading, setLoading] = useState(false);
	
	const password = useRef();
	password.current = watch("password");
	
	const onSubmit = async (data) => {
		
		const auth = getAuth();
		
		try{
			setLoading(true);
			let createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password)	
			
			await updateProfile(auth.currentUser, {
				displayName: data.name,
				photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
			})
			
			//Firebase 데이터베이스에 저장해주기 
			set(ref(getDatabase(), 'users/' + createdUser.user.uid), {
				name: createdUser.user.displayName,
				image: createdUser.user.photoURL
			});
			
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
			<div style={{ textAlign: 'center', color: 'white' }}><h3>REGISTER</h3></div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label>Email</label>
				<input name="email" type="email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
				{ errors.email && <span>This field is required</span> }

				<label>Name</label>
				<input name="name" type="text" {...register("name", { required: true, maxLength: 10})}/>
				{errors.name && errors.name.type === "required" && <span>This field is required</span>}
				{errors.name && errors.name.type === "maxLength" && <span>Your input exceed maximum length</span>}
				
				<label>Password</label>
				<input name="password" type="password" {...register("password", { required: true, minLength: 6})} />
				{errors.password && errors.password.type === "required" && <span>This field is required</span>}
				{errors.password && errors.password.type === "minLength" && <span>Password must have at least 6 characters</span>}
				
				<label>Confirm Password</label>
				<input name="confirm_password" type="password" {...register("confirm_password", { required: true, validate: (value) => value === password.current })}/>
				{errors.confirm_password && errors.confirm_password.type === "required" && <span>This field is required</span>}
				{errors.confirm_password && errors.confirm_password.type === "validate" && <span>The passwords do not match</span>}

				{errorFromSubmit && <p>{errorFromSubmit}</p>}
				
				<input type="submit" disabled={loading} />
				
				<Link style={{ color: 'grey', textDecoration: 'none' }} to="/login">already have an ID...</Link>
    	</form>
		</div>
	)
}

export default RegisterPage;