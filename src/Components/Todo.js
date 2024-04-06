import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'

function Todo() {

    let [todo, settodo] = useState({});
    let [data, SetData] = useState([]);
    let [search, Setsearch] = useState('');
    let [Error, setError] = useState({});
    let [sorting, Setsorting] = useState('');
    let [currentPage, setCurrentPage] = useState(1);
    let [postsPerPage] = useState(4);
    let [color,Setcolor] = useState('');

    useEffect(() => {
        getData();
    },[]);

    let getData = ()=>{
        axios.get("http://localhost:3000/todo")
            .then((res) => {
                SetData(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    let deleteTask = (id) => {
        axios.delete("http://localhost:3000/todo/" + id)
            .then((res) => {
                getData();
                console.log("deleted");
            })
            .catch((err) => {
                console.log(err);
            })
    }


    let formsubmit = (e) => {
        e.preventDefault();

        if (e.target.username.value == "") {
            setError({ ...Error, ['username']: "Username Is Required" });
        }
        else if (e.target.date.value == "") {
            setError({ ...Error, ['date']: "Date is required" });
        }
        else if (e.target.category.value == "") {
            setError({ ...Error, ['category']: "Category is required" });
        }
        else if (e.target.task.value == "") {
            setError({ ...Error, ['task']: "Task is required" });
        }
        else {
            axios.post("http://localhost:3000/todo", todo)
                .then((res) => {
                    alert("data added");
                    getData();
                    settodo({});
                })
                .catch((err) => {
                    console.log("err");
                });
        }

    }

    let getInputValue = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        settodo({ ...todo, [name]: value });

        if (name == "username") {
            if (value == "") {
                setError({ ...Error, ['username']: "Username are required" });
            }
            else if (value.length < 3) {
                setError({ ...Error, ['username']: "3 character required" });
            }
            else {
                setError({ ...Error, ['username']: '' });
            }
        }

        else if (name == "date") {
            if (value == "") {
                setError({ ...Error, ['date']: "date are required" });
            }
            else {
                setError({ ...Error, ['date']: '' });
            }
        }
        else if (name == "category") {
            if (value == "") {
                setError({ ...Error, ['category']: "category are required" });
            }
            else {
                setError({ ...Error, ['category']: '' });
            }
        }

        else if (name == "task") {
            if (value == "") {
                setError({ ...Error, ['task']: "task are required" });
            }
            else {
                setError({ ...Error, ['task']: '' });
            }
        }


    }

    let handleSearchChange = (e) => {
        Setsearch(e.target.value);
    };

    let filteredData = data.filter((v) => v.username.toLowerCase().match(search.toLowerCase()));

    


    let indexOfLastPost = currentPage * postsPerPage;
    let indexOfFirstPost = indexOfLastPost - postsPerPage;
    let currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

    let paginate = (pageNumber) => setCurrentPage(pageNumber);

    let pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    let sortedData = [...currentPosts];
    if (sorting === 'ase') {
         sortedData.sort((a, b) => (a.username > b.username ? 1 : -1));

      } else if (sorting === 'des') {
        sortedData.sort((a, b) => (a.username < b.username ? 1 : -1));
       
      }



    return (
        <div>
            <h1 className="heading">Todo Project:</h1>
            <form method="post" onSubmit={(e) => formsubmit(e)}>
                <Table striped bordered hover cellPadding="16px" cellSpacing="3px" className="table" style={{ margin: "0 auto" }}>
                    <tr>
                        <td><h3>Enter Username</h3></td>
                        <td><input type="text" name="username" value={todo.username ? todo.username : ""} className="username" onChange={(e) => getInputValue(e)} />
                            <span style={{ color: "red" }}>{Error.username ? Error.username : ""}</span></td>
                    </tr>
                    <tr>
                        <td><h3>Enter Your Date:</h3></td>
                        <td><input type="date" name="date" value={todo.date ? todo.date : ""} style={{ width: "100%", height: "27px" }} className="date" onChange={(e) => getInputValue(e)}></input>
                            <span style={{ color: "red" }}>{Error.date ? Error.date : ""}</span></td>
                    </tr>

                    <tr>
                        <td><h3>Enter Catagory:</h3></td>
                        <td>
                            <select name="category" onChange={(e) => getInputValue(e)} value={todo.category ? todo.category : ""}>
                                <option value="">---select-any-Task---</option>
                                <option value="Personal">Personal-Task</option>
                                <option value="Office">Office-Task</option>
                                <option value="Friends">Friends-Task</option>
                                <option value="Family">Family-Task</option>
                                <option value="Other">Other-Task</option>
                            </select>
                            <span style={{ color: "red" }}>{Error.category ? Error.category : ""}</span>
                        </td>
                    </tr>

                    <tr>
                        <td><h3>Enter Task:</h3></td>
                        <td><textarea type="text" name="task" onChange={(e) => getInputValue(e)} value={todo.task ? todo.task : ""} ></textarea>
                            <span style={{ color: "red" }}>{Error.task ? Error.task : ""}</span></td>
                    </tr>

                    <tr>
                        <td></td>
                        <td><input type="submit" className="button"></input></td>
                    </tr>

                </Table>
            </form>
            <br /><br />

            <div>
                <h2 className="heading">View Task:</h2><br />
                <div className="parentsearchsort">
                    <input type="text" placeholder="Search By UserName..." name="search" className="search" value={search} onChange={(e) => handleSearchChange(e)} />
                    <select className="sort" title="⇵ Sorting User" onChange={(e)=>Setsorting(e.target.value)}>
                        <option value='ase'>asending-order</option>
                        <option value="des">desending-order</option>
                    </select>
                    <Pagination className="pagination">
                        {pageNumbers.map(number => (
                            <Pagination.Item key={number} onClick={() => paginate(number)} className="paginationitem">
                                {number}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div><br/>
                {currentPosts.map((v, i) => {
                    return (
                        <div>
                            <p style={{ display: "none" }}>
                                {v.category == 'Personal' ?
                                    color = "#e3ca4a"
                                    : v.category == 'Office' ?
                                        color = "#121212"
                                        : v.category == 'Friends' ?
                                            color = "cyan"
                                            : v.category == 'Family' ?
                                                color = "green"
                                                :
                                                v.category == 'Other' ?
                                                    color = "orange"
                                                    :
                                                    color = "gray"
                                }
                            </p>

                            <div className="parent" style={{ backgroundColor: color }}>
                                <button className="btn" onClick={(e) => deleteTask(v.id)}>❌</button>
                                <span className="taskcheck">{v.completed ? 'Completed' : 'Pending'}</span>
                                <Form.Check type="checkbox"  label={`default`} name="checkbox"  /><br/>
                                <h3>Date: {v.date}</h3>
                                <h1 className="taskcategory">{v.category}-Task</h1><br />
                                <h2>{v.username}</h2>
                                <br />
                                <h2 style={{ textAlign: "right", margin: "20px 10px" }}>{v.task}</h2>
                            </div>
                        </div>

                    )
                })}

            </div>
        </div>
    )
}

export default Todo;