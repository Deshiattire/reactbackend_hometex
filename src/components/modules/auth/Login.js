import React, { useState } from 'react';
import axios from 'axios';
import Constants from '../../../Constants';

export default function Login() {
    const[input, setInput] = useState({user_type: 2})
    const[errors, setErrors] = useState([])
    const[isLoading, setIsLoading] = useState(false)


    const handleInput = (e) => setInput(prevState => ({...prevState, [e.target.name] : e.target.value}))
       
    const handleLogin = () => {
        setIsLoading(true)
        axios.post(`${Constants.BASE_URL}/login`, input).then(res=>{
            localStorage.email = res.data.email
            localStorage.phone = res.data.phone
            localStorage.name = res.data.name
            localStorage.photo = res.data.photo
            localStorage.token = res.data.token
            localStorage.role = res.data.role
            localStorage.employee_type = res.data.employee_type
            localStorage.branch = JSON.stringify(res.data.branch)
            setIsLoading(false)
            window.location.reload()
        }).catch(errors =>
            {
                setIsLoading(false)
                if(errors.response.status === 422 ){
                    setErrors(errors.response.data.errors)
                }
            })
    }

   

  return (
    <div className="container-flude bg-theme" id={'login'}>
        <div className="row">
        <div className="col-md-6">
        <div className="card bg-theme">
        <div className="card-header">
            <h4>Login</h4>
        </div>
        <div className="card-body">
            <label className={'w-100'}>
                <p>Email / Phone</p>
                <input 
                className={'form-control mt-2'} 
                type={'text'} 
                name={'email'} 
                value={input.email} 
                onChange={handleInput} 
                />
            <p className={'login-error-msg'}><small>{errors.email != undefined ? errors.email[0]: null}</small></p>
            </label>
            <label className={'w-100 mt-4'}>
                <p>Password</p>
                <input 
                className={'form-control mt-2'} 
                type={'password'} 
                name={'password'} 
                value={input.password} 
                onChange={handleInput} 
                />
            <p className={'login-error-msg'}><small>{errors.user_type != undefined ? errors.password[0]: null}</small></p>
            </label>
            <label className={'w-100 mt-4'}>
                <p>Login As</p>
                <select 
                className={errors.user_type != undefined ? 'is-invalid form-control mt-2' : 'form-select mt-2'}
                name={'user_type'} 
                value={input.user_type} 
                onChange={handleInput} 
                >
                    <option>Select User Type</option>
                    <option value={1} >Admin</option>
                    <option value={2} >Admin Manager</option>
                </select>
            <p className={'login-error-msg'}><small>{errors.user_type != undefined ? errors.user_type[0]: null}</small></p>
            </label>
            <div className="d-grid mt-4">
                <button onClick={handleLogin} className={'brn btn-outline-warning'} 
                dangerouslySetInnerHTML={{ __html: isLoading ? '<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Login...':'Login' }} />
            </div>
        </div>

        </div>
        </div>
        </div>
    </div>
  )
}
