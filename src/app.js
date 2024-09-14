import React from 'react'
import {Container, Row, Col} from 'reactstrap'

const App = () => {
    return (
        <div className="App">
            {/* <Navigation/> */}
            <Container fluid>
                <Row>
                    <Col className="element1">
                        <p>Element 1</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="element2">
                        <p>Element 2</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="element3">
                        <p>Element 3</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="element4">
                        <p>Element 4</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="element5">
                        <p>Element 5</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="element6">
                        <p>Element 6</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default App