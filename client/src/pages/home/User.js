import {gql, useQuery} from "@apollo/client";
import {Col, Image} from "react-bootstrap";
import {useMessageDispatch, useMessageState} from "../../context/message";

const Users = () => {

    const dispatch = useMessageDispatch();
    const {users} = useMessageState();
    const selectedUser = users?.find((user) => user.selected);

    const {loading} = useQuery(GET_USERS, {
        onCompleted: (data) =>dispatch({type: 'SET_USERS', payload: data.getUsers}),
        onError: (err) => console.log(err)
    });

    let usersMarkup;

    if (!users || loading) {
        usersMarkup = <p>loading...</p>;
    } else if (users?.length === 0) {
        usersMarkup = <p>not users have joined yet</p>;
    } else if (users?.length > 0) {
        usersMarkup = users.map((user) => (
            <div
                role={'button'}
                className={selectedUser?.username === user.username
                    ? 'user-div d-flex p-3 justify-content-center justify-content-md-start bg-white'
                    : 'user-div d-flex p-3 justify-content-center justify-content-md-start'}
                key={user.username}
                onClick={() => dispatch({type: 'SET_SELECTED_USER', payload: user.username})}
            >
                <Image
                    src={user.imageUrl}
                    className={'user-image'}
                />
                <div className={'d-none d-md-block ml-2'}>
                    <p className={'text-success'}>{user.username}</p>
                    {user.latestMessage
                        ? <p className={'font-weight-light'}>{user.latestMessage.content}</p>
                        : 'You are now connected!'}
                </div>
            </div>
        ));
    }

    return (
        <Col className={'p-0 bg-secondary'} xs={2} md={4}>
            {usersMarkup}
        </Col>
    );
};

export default Users;

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
