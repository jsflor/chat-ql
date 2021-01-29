import {useEffect} from "react";
import {Button, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {gql, useSubscription} from '@apollo/client';

import {useAuthDispatch, useAuthState} from "../../context/auth";
import {useMessageDispatch} from "../../context/message";
import Users from "./User";
import Messages from "./Messages";

const Home = ({history}) => {
    const authDispatch = useAuthDispatch();
    const messageDispatch = useMessageDispatch();

    const {user} = useAuthState();

    const {data:messageData, error: messageError} = useSubscription(NEW_MESSAGE);

    useEffect(() => {
        if (messageError) console.log(messageError);
        if (messageData) {
            const {newMessage: message} = messageData;
            const otherUser = user.username === message.to
                ? message.from
                : message.to;

            messageDispatch({type: 'ADD_MESSAGE', payload: {
                username: otherUser,
                message: messageData.newMessage
            }});
        }
    }, [messageData, messageError]);

    const logout = () => {
        authDispatch({type:'LOGOUT'});
        window.location.href = '/login';
    };

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
                <Users/>
                <Messages/>
            </Row>
        </>
    );
};

export default Home;

const NEW_MESSAGE = gql`
    subscription newMessage {
        newMessage {
            content
            createdAt
            from
            to
            uuid
        }
    }
`;
