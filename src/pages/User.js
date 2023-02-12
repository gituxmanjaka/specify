import { useEffect, useState } from "react";
import { addDoc, collection, doc, deleteDoc, getDocs } from "firebase/firestore";
import { Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { RxTrash } from "react-icons/rx";
import { db } from "../config/firebase";

import './User.css';


export const  User = () => {
  const [newUser, setNewUser] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUSers = async () => {
      const usersRef = collection(db, 'users');
      setLoading(true);
      const userSnap = await getDocs(usersRef);
      if (userSnap.empty) {
        setLoading(false);
        return;
      }
      const data = [];
      userSnap.docs.forEach(doc => {
        data.push({id: doc.id, name: doc.data().name});
      });
      setUsers(data);
      setLoading(false);
    }
    fetchUSers();
  }, []);

  const saveUser = async () => {
    if (!newUser) {
      return;
    }
    setLoading(true);
    const userRef = await addDoc(collection(db, 'users'), {name: newUser});
    setUsers(prev => [{id: userRef.id, name: newUser}, ...prev]);
    setNewUser('');
    setLoading(false);
  }

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
    setUsers(prev => {
      return prev.filter(user => user.id !== id)
    })
  }

  return (
    <>
      <Form className="container">
        <p>Who are you?</p>
        <Form.Group className="d-flex gap-2">
          <Form.Control
            type="text"
            value={newUser}
            onChange={e => setNewUser(e.target.value)}/>
          <Button
            variant="primary"
            type="button"
            onClick={saveUser}
          >Submit</Button>
        </Form.Group>
      </Form>
      <div className="container mt-5">
        <h2>Users list:</h2>
        <ListGroup>
          {
            users.map(({id, name}) => 
              <ListGroup.Item
                className="d-flex justify-content-between align-items-center"
                key={id}>
                <div>{name}</div>
                <Button variant="danger" onClick={() => deleteUser(id)}><RxTrash/></Button>
              </ListGroup.Item>
            )
          }
        </ListGroup>
      </div>
      {
       (isLoading) &&
        <div className="overlay">
          <Spinner animation="grow" variant="primary" />
        </div>
      }
    </>
  );
}