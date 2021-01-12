import {Button, Col, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {gql, useLazyQuery, useQuery} from "@apollo/client";

import {useAuthDispatch} from "../context/auth";
import {useEffect, useState} from "react";

const GET_USERS = gql`
    query getUsers {
        getUsers {
            username
            imageUrl
            latestMessage {
                content
                uuid
            }
        }
    }
`;

const GET_MESSAGES = gql`
    query getMessages($from: String!) {
        getMessages(from: $from) {
            uuid
            to
            from
            content
            createdAt
        }
    }
`;

const Home = ({history}) => {

    const dispatch = useAuthDispatch();

    const {loading, data, error} = useQuery(GET_USERS);
    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES);

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
     if (selectedUser) {
         getMessages({variables: {from: selectedUser}});
     }
    }, [selectedUser]);

    if (messagesData) console.log(messagesData.getMessages);

    const logout = () => {
        dispatch({type:'LOGOUT'});
        history.push('/login');
    };

    let usersMarkup;

    if (!data || loading) {
        usersMarkup = <p>loading...</p>;
    } else if (data.getUsers?.length === 0) {
        usersMarkup = <p>not users have joined yet</p>;
    } else if (data.getUsers?.length > 0) {
        usersMarkup = data.getUsers.map((user) => (
            <div
                className={'d-flex p-3'}
                key={user.username}
                onClick={() => setSelectedUser(user.username)}
            >
                <Image
                    src={user.imageUrl}
                    roundedCircle
                    className={'mr-2'}
                    style={{width: 50, height: 50, objectFit: 'cover'}}
                />
                <div>
                    <p className={'text-success'}>{user.username}</p>
                    {user.latestMessage
                    ? <p className={'font-weight-light'}>{user.latestMessage.content}</p>
                    : 'You are now connected!'}
                </div>
            </div>
        ));
    }

    return (
        <>
            <Row className={'bg-white justify-content-around mb-1'}>
                <Link to={'/login'}>
                    <Button variant={'link'}>Login</Button>
                </Link>
                <Link to={'/register'}>
                    <Button variant={'link'}>Register</Button>
                </Link>
                <Button variant={'link'} onClick={logout}>Logout</Button>
            </Row>
            <Row className={'bg-white'}>
                <Col className={'p-0 bg-secondary'} xs={4}>
                    {usersMarkup}
                </Col>
                <Col xs={8}>
                    {messagesData && messagesData.getMessages.length > 0
                        ? messagesData.getMessages.map((m) => (
                            <p key={m.uuid}>{m.content}</p>
                        ))
                        : <p>Messages</p>}
                </Col>
            </Row>
        </>
    );
};

export default Home;
