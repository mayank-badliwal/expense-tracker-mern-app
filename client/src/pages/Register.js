// import React, { useState, useEffect} from 'react';
// import { Form, Input, message } from 'antd';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Spinner from '../components/Spinner';
// // import "../styles/register.css"; // Importing the CSS file

// const Register = () => {
//     const navigate = useNavigate()

//     const [loading,setLoading] = useState(false);

//     // from Submit
//     const submitHandler = async (values) => {
//         try {
//             setLoading(true);
//             await axios.post('/users/register', values);
//             message.success('Registration Successful')
//             setLoading(false)           
//             navigate('/login');

//         } catch (error) {
//             setLoading(false);
//             message.error("something went wrong");
//         }
//     };

//     //prevent for login user
//     useEffect(() => {
//         if (localStorage.getItem("user")) {
//             navigate("/")
//         }
//     }, [navigate]);

//     return (
//         <>
//             <div className="register-page">
//                 {loading && <Spinner />}
//                 <Form layout="vertical" onFinish={submitHandler}>
//                     <h1>Registeration Form</h1>
//                     <Form.Item label="Name" name="name">
//                         <Input />
//                     </Form.Item>
//                     <Form.Item label="Email" name="email">
//                         <Input type="email" />
//                     </Form.Item>
//                     <Form.Item label="Password" name="password">
//                         <Input type="password" />
//                     </Form.Item>

//                     <div className="d-flex justify-content-center">
//                         <Link to="/login">Already Registered? Click here to login.</Link>
//                         <button className="btn btn-primary">Register</button>
//                     </div>
//                 </Form>
//             </div>
//         </>
//     )
// }

// export default Register;


// from chatgpt

import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/users/register', values);
      localStorage.setItem('user', JSON.stringify(data.user));
      message.success('Registration successful');
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.log("Register error:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register-page">
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Registration Form</h1>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-center">
          <Link to="/login">Already Registered? Click here to login.</Link>
          <button className="btn btn-primary">Register</button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
