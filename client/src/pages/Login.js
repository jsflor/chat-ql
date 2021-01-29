import {useState} from "react";
import { gql, useMutation } from '@apollo/client';
import {Button, Col, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

import {useAuthDispatch} from "../context/auth";

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login (
            username: $username
            password: $password
        ) {
            username
            email
            createdAt
            token
        }
    }
`;

const Login = ({history}) => {

    const dispatch = useAuthDispatch();

    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const [login, { loading }] = useMutation(LOGIN_USER, {
        update: (_, {data}) => {
            dispatch({type: 'LOGIN', payload: data.login});
            window.location.href = '/';
        },
        onError: (error) => {
            setErrors(error.graphQLErrors?.[0].extensions?.errors ?? {});
        }
    });

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(values);
        login({variables: values});
    };

    return (
        <Row className={'bg-white py-5 justify-content-center'}>
            <Col sm={8} md={6} lg={4}>
                <h1 className={'text-center'}>Login</h1>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label className={errors.username && 'text-danger'}>
                            {errors.username ?? 'Username'}
                        </Form.Label>
                        <Form.Control
                            value={values.username}
                            className={errors.username && 'is-invalid'}
                            onChange={e => setValues({...values, username: e.target.value})}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={errors.password && 'text-danger'}>
                            {errors.password ?? 'Password'}
                        </Form.Label>
                        <Form.Control
                            value={values.password}
                            className={errors.password && 'is-invalid'}
                            onChange={e => setValues({...values, password: e.target.value})}
                            type="password"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading ? 'loading...' : 'Login'}
                    </Button>
                    <br />
                    <small>Don't have an account? <Link to={'/register'}>Register</Link></small>
                </Form>
            </Col>
        </Row>
    );
};

export default Login;
