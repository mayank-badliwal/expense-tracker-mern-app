

import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/users/login', values);
      localStorage.setItem('user', JSON.stringify(data.user));
      message.success('Login successful');
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.log("Login error:", error.response?.data || error.message);
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
        <h1>Login Form</h1>
        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-center">
          <Link to="/register">New User? Click here to Register.</Link>
          <button className="btn btn-primary">Login</button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
