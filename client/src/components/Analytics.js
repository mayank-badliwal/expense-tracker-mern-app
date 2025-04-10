
import React from "react";
import { Progress } from "antd";

const Analytics = ({ allTransaction }) => {

    //Category array
    const categories = ["salary", "tip", "project", "food", "movie", "bills", "medical", "fee", "tax",];

    //Total Transactions
    const totalTransaction = allTransaction.length
    const totalIncomeTransactions = allTransaction.filter(transaction => transaction.type === 'income')
    const totalExpenseTransactions = allTransaction.filter(transaction => transaction.type === 'expense')
    const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
    const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

    // Prevent division by zero
    // const totalIncomePercent = totalTransaction ? (totalIncomeTransactions.length / totalTransaction) * 100 : 0;
    // const totalExpensePercent = totalTransaction ? (totalExpenseTransactions.length / totalTransaction) * 100 : 0;


    //Total Turnover
    const totalTurnover = allTransaction.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalIncomeTurnover = allTransaction.filter((transaction) => transaction.type === "income").reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpenseTurnover = allTransaction.filter((transaction) => transaction.type === "expense").reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100
    const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100

    //from chatgpt
    // Prevent division by zero
    // const totalIncomeTurnoverPercent = totalTurnover ? (totalIncomeTurnover / totalTurnover) * 100 : 0;
    // const totalExpenseTurnoverPercent = totalTurnover ? (totalExpenseTurnover / totalTurnover) * 100 : 0;


    return (
        <>
            <div className="row m-3">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            Total Transactions : {totalTransaction}
                        </div>
                        <div className="card-body">
                            <h5 className="text-success">
                                Income : {totalIncomeTransactions.length}</h5>
                            <h5 className="text-danger">
                                Expense : {totalExpenseTransactions.length}</h5>

                            <Progress
                                type="circle"
                                strokeColor={"green"}
                                className="mx-2"
                                percent={totalIncomePercent.toFixed(0)}
                            />
                            <Progress
                                type="circle"
                                strokeColor={"red"}
                                className="mx-2"
                                percent={totalExpensePercent.toFixed(0)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            Total Turnover : {totalTurnover}
                        </div>
                        <div className="card-body">
                            <h5 className="text-success">
                                Income : {totalIncomeTurnover}</h5>
                            <h5 className="text-danger">
                                Expense : {totalExpenseTurnover}</h5>

                            <Progress
                                type="circle"
                                strokeColor={"green"}
                                className="mx-2"
                                percent={totalIncomeTurnoverPercent.toFixed(0)}
                            />
                            <Progress
                                type="circle"
                                strokeColor={"red"}
                                className="mx-2"
                                percent={totalExpenseTurnoverPercent.toFixed(0)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-4">
                    <h4>Categorywise Income</h4>
                    {
                        categories.map(category => {
                            const amount = allTransaction
                                .filter(transaction => transaction.type === 'income' && transaction.category === category)
                                .reduce((acc, transaction) => acc + transaction.amount, 0);
                            return (
                                amount > 0 && (
                                    <div className="card">
                                        <div className="card-body">
                                            <h5>{category}</h5>
                                            <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} />
                                        </div>
                                    </div>
                                )
                            )
                        })
                    }
                </div>

                <div className="col-md-4">
                    <h4>Categorywise Expense</h4>
                    {
                        categories.map(category => {
                            const amount = allTransaction
                                .filter(transaction => transaction.type === 'expense' && transaction.category === category)
                                .reduce((acc, transaction) => acc + transaction.amount, 0);
                            return (
                                amount > 0 && (
                                    <div className="card">
                                        <div className="card-body">
                                            <h5>{category}</h5>
                                            <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} />
                                        </div>
                                    </div>
                                )
                            )
                        })
                    }
                </div>
            </div>

        </>
    )
}

export default Analytics;