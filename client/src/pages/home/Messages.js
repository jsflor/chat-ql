import {useEffect, Fragment, useState} from "react";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {Col, Form} from "react-bootstrap";
import {useMessageDispatch, useMessageState} from "../../context/message";
import Message from "./Message";
import PaperPlaneSVG from "../../assets/icons/PaperPlaneSVG";

const Messages = () => {

    const dispatch = useMessageDispatch();
    const {users} = useMessageState();

    const selectedUser = users?.find((user) => user.selected);
    const messages = selectedUser?.messages ?? [];

    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES);
    const [sendMessage] = useMutation(SEND_MESSAGE, {
       onError: error => console.log(error),
       onCompleted: data => dispatch({type: 'ADD_MESSAGE', payload: {
            username: selectedUser.username,
            message: data.sendMessage
           }})
    });

    const [content, setContent] = useState('');

    useEffect(() => {
        if (selectedUser && !selectedUser.messages) {
            getMessages({variables: {from: selectedUser?.username}});
        }
    }, [selectedUser]);

    useEffect(() => {
        if (messagesData) {
            dispatch({
                type: 'SET_USER_MESSAGES',
                payload: {
                    username: selectedUser?.username,
                    messages: messagesData.getMessages
                }
            });
        }
    }, [messagesData]);

    let selectedChatMarkup;

    if (!messages && !messagesLoading) {
        selectedChatMarkup = <p className={'info-text'}>Select a friend</p>;
    } else if (messagesLoading) {
        selectedChatMarkup = <p className={'info-text'}>Loading...</p>;
    } else if (messages.length > 0) {
        selectedChatMarkup = messages.map((message, index) => (
            <Fragment key={message.uuid} >
                <Message message={message} />
                {index === messages.length - 1 && (
                    <div className={'invisible'}>
                        <hr className={'m-0'} />
                    </div>
                )}
            </Fragment>
        ));
    } else if (messages.length === 0) {
        selectedChatMarkup = <p className={'info-text'}>You are now connected! send your fist message</p>;
    }

    const onSubmitMessage = (e) => {
      e?.preventDefault?.();
      if (content.trim() === '' || !selectedUser) return;
      sendMessage({ variables: { to: selectedUser.username, content } });
      setContent('');
    };

    return (
        <Col xs={10} md={8}>
            <div  className={'messages-box d-flex flex-column-reverse'}>
                {selectedChatMarkup}
            </div>
            <div>
                <Form onSubmit={onSubmitMessage}>
                    <Form.Group className={'d-flex align-items-center'}>
                        <Form.Control
                            type={'text'}
                            className={'message-input rounded-pill p-4 bg-secondary border-0'}
                            placeholder={'Type a message...'}
                            value={content}
                            onChange={({target: {value}}) => setContent(value)}
                        />
                        <PaperPlaneSVG role={'button'} className={'ml-2'} onClick={onSubmitMessage} />
                    </Form.Group>
                </Form>
            </div>
        </Col>
    );
};

export default Messages;

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

const SEND_MESSAGE = gql`
    mutation sendMessage($to: String!, $content: String!) {
        sendMessage(to: $to, content: $content) {
            uuid
            from
            to
            content
            createdAt
        }
    }
`;
