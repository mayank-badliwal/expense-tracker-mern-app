import React, { useState, useEffect } from 'react';
import { Form, Modal, Input, Select, message, Table, DatePicker } from 'antd';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import Spinner from './../components/Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';
// import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const HomePage = () => {
    // const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [allTransaction, setAllTransaction] = useState([])
    const [frequency, setFrequency] = useState('7')
    const [selectedDate, setSelectedDate] = useState([])
    const [type, setType] = useState('all')
    const [viewData, setViewData] = useState('table')
    const [editable, setEditable] = useState(null)

    // table data
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount'
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Category',
            dataIndex: 'category'
        },
        {
            title: 'Refrence',
            dataIndex: 'refrence'
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <EditOutlined onClick={() => {
                        setEditable(record)
                        setShowModal(true)
                    }} />
                    <DeleteOutlined className='mx-2' onClick={() => {
                        handleDelete(record);
                    }} />
                </div>
            )
        },
    ]

// get all transactions
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
            message.error("Please log in again");
            navigate("/login");
            return;
        }

        const getAllTransaction = async () => {
            try {
                setLoading(true);
                const res = await axios.post("/api/v1/transactions/get-transaction", {
                    userid: user._id,
                    frequency,
                    selectedDate,
                    type,
                });
                console.log("Fetched transactions:", res.data);
                setAllTransaction(res.data);
                setLoading(false);
            } catch (error) {
                console.log("Transaction fetch error:", error.response?.data || error.message);
                message.error("Fetch issue with Transaction");
                setLoading(false);
            }
        };

        getAllTransaction();
    }, [frequency, selectedDate, type, navigate,]);


    //delete handler
    const handleDelete = async (record) => {
        try {
            setLoading(true)
            await axios.post("/api/v1/transactions/delete-transaction", { transactionId: record._id })
            setLoading(false)
            message.success("Transaction Deleted")
        } catch (error) {
            setLoading(false)
            console.log(error)
            message.error('unable to delete')
        }
    }

    //form handling
    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setLoading(true)

            if (editable) {
                await axios.post('/api/v1/transactions/edit-transaction', {
                    payload: {
                        ...values,
                        userId: user._id,
                    },
                    transactionId: editable._id
                });
                setLoading(false)
                message.success('Transaction updated successfully')
            } else {
                await axios.post('/api/v1/transactions/add-transaction', {
                    ...values,
                    userId: user._id,
                });
                setLoading(false)
                message.success('Transaction added successfully')
            }
            setShowModal(false)
            setEditable(null)
        } catch (error) {
            setLoading(false)
            message.error('Please fill all fields')
        }
    }

    return (
        <Layout>
            {loading && <Spinner />}
            <div className="filters">
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">Last 1 Week</Select.Option>
                        <Select.Option value="30">Last 1 Month</Select.Option>
                        <Select.Option value="365">Last 1 Year</Select.Option>
                        <Select.Option value="custom">Custom</Select.Option>
                    </Select>
                    {frequency === 'custom' && (
                        <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)}
                        />
                    )}
                </div>

                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="income">Income</Select.Option>
                        <Select.Option value="expense">Expense</Select.Option>
                    </Select>
                    {frequency === 'custom' && (
                        <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)}
                        />
                    )}
                </div>

                <div className='switch-icons'>
                    <UnorderedListOutlined
                        className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`}
                        onClick={() => setViewData("table")}
                    />
                    <AreaChartOutlined
                        className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
                        onClick={() => setViewData("analytics")}
                    />
                </div>

                <div>
                    <button className='btn btn-primary' onClick={() => setShowModal(true)}>Add new</button>
                </div>
            </div>

            <div className='content'>
                {viewData === 'table' ? (
                    <Table columns={columns} dataSource={allTransaction} />
                ) : (
                    <Analytics allTransaction={allTransaction} />
                )}
            </div>

            <Modal
                title={editable ? 'Edit Transaction' : 'Add Transaction'}

                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={false}
            >
                <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>

                    <Form.Item label="Amount" name="amount">
                        <Input type="text" />
                    </Form.Item>

                    <Form.Item label="Type" name="type">
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="bills">Bills</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Date" name="date">
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item label="Refrence" name="refrence">
                        <Input type="text" required />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input type="text" required />
                    </Form.Item>

                    <div className='d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary">
                            {" "}
                            SAVE
                        </button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    )
}

export default HomePage;



