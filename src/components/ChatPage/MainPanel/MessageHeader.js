import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { FaLock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
function MessageHeader() {
	return (
		<div style={{
			width: '100%',
			height: '190px',
			border: '.2rem solid #ececec',
			borderRadius: '4px',
			padding: '1rem',
			marginBottom: '1rem'
		}} >
			<Container>
				<Row>
					<Col>
						<h2>
							<FaLock />
							ChatRoomName
							<MdFavorite />
						</h2>
					</Col>
					<Col>
						<InputGroup className="mb-3">
							<InputGroup.Text id="basic-addon1"><AiOutlineSearch /></InputGroup.Text>
							<Form.Control
								placeholder="Search Messages"
								aria-label="Search"
								aria-describedby="basic-addon1"
							/>
						</InputGroup>
					</Col>
				</Row>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<p>
						<Image /> {" "}user name
					</p>
				</div>
				<Row>
					<Col>
						<Accordion>
							<Accordion.Item eventKey="0">
								<Accordion.Header>Description</Accordion.Header>
								<Accordion.Collapse eventKey="0">
									<Card.Body>
										Description
									</Card.Body>
								</Accordion.Collapse>
							</Accordion.Item>
						</Accordion>
					</Col>
					<Col>
						<Accordion>
							<Accordion.Item eventKey="0">
								<Accordion.Header>Post Message</Accordion.Header>
								<Accordion.Collapse eventKey="0">
									<Card.Body>
										Post Message
									</Card.Body>
								</Accordion.Collapse>
							</Accordion.Item>
						</Accordion>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default MessageHeader;