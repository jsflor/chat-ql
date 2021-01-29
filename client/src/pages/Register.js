import {useState} from "react";
import { gql, useMutation } from '@apollo/client';
import {Button, Col, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

import {useAuthDispatch} from "../context/auth";


const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register (
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        ) {
            username
            email
            createdAt
            token
        }
    }
`;

const Register = ({history}) => {

    const dispatch = useAuthDispatch();

    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const [register, { loading }] = useMutation(REGISTER_USER, {
        update: (_, {data}) => {
            dispatch({type: 'LOGIN', payload: data.register});
            window.location.href = '/';
        },
        onError: (error) =>
            setErrors(error.graphQLErrors?.[0].extensions?.errors ?? {})
    });

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(values);
        register({variables: values});
    };

    return (
        <Row className={'bg-white py-5 justify-content-center'}>
            <Col sm={8} md={6} lg={4}>
                <h1 className={'text-center'}>Register</h1>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label className={errors.email && 'text-danger'}>
                            {errors.email ?? 'Email address'}
                        </Form.Label>
                        <Form.Control
                            value={values.email}
                            className={errors.email && 'is-invalid'}
                            onChange={e => setValues({...values, email: e.target.value})}
                            type="email"
                        />
                    </Form.Group>
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
                    <Form.Group>
                        <Form.Label className={errors.confirmPassword && 'text-danger'}>
                            {errors.confirmPassword ?? 'Confirm password'}
                        </Form.Label>
                        <Form.Control
                            value={values.confirmPassword}
                            className={errors.confirmPassword && 'is-invalid'}
                            onChange={e => setValues({...values, confirmPassword: e.target.value})}
                            type="password"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading ? 'loading...' : 'Register'}
                    </Button>
                    <br />
                    <small>Already have an account? <Link to={'/login'}>Login</Link></small>
                </Form>
            </Col>
        </Row>
    );
};

export default Register;
