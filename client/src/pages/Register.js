import {useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";

const Register = () => {

    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(values);
    }  ;

    return (
        <Row className={'bg-white py-5 justify-content-center'}>
            <Col sm={8} md={6} lg={4}>
                <h1 className={'text-center'}>Register</h1>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            value={values.email}
                            onChange={e => setValues({...values, email: e.target.value})}
                            type="email"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            value={values.username}
                            onChange={e => setValues({...values, username: e.target.value})}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={values.password}
                            onChange={e => setValues({...values, password: e.target.value})}
                            type="password"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                            value={values.confirmPassword}
                            onChange={e => setValues({...values, confirmPassword: e.target.value})}
                            type="password"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Register
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default Register;
