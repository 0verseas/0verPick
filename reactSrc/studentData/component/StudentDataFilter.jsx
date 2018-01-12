import React from 'react';
import {
	Form,
	FormGroup,
	Col,
	Input,
	Label,
	Button
} from 'reactstrap';

export default class StudentDataFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			no: '',
			name: '',
			email: '',
			resident: '',
			order: '',
			school: '',
			dept: ''
		};

		this.handleToggle = this.handleToggle.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	handleToggle() {
		this.setState((prevState) => ({
			open: !prevState.open
		}));
	}

	handleSubmit(e) {
		e && e.preventDefault();
		this.props.onFilter({
			on: this.state.on,
			name: this.state.name,
			email: this.state.email,
			resident: this.state.resident,
			order: this.state.order,
			school: this.state.school,
			dept: this.state.dept
		});
	}

	handleReset() {
		this.setState({
			no: '',
			name: '',
			email: '',
			resident: '',
			order: '',
			school: '',
			dept: ''
		}, this.handleSubmit);
	}

	render() {
		return (
			<div>
				<div className="mb-2 pl-3" style={{background: '#666', color: '#f3f3f3', fontSize: '16px', cursor: 'pointer'}} onClick={this.handleToggle}>
					{
						this.state.open ? (<i className="fa fa-caret-down" aria-hidden="true"></i>)
						: (<i className="fa fa-caret-right" aria-hidden="true"></i>)
					}

					{' '}過濾條件
				</div>

				{ this.state.open &&
					<Form onSubmit={this.handleSubmit}>
						<FormGroup row>
							<Label for="no" sm={2}>僑生編號</Label>
							<Col sm={10}>
								<Input type="text" name="no" id="no" value={this.state.no} onChange={(e) => { this.setState({ no: e.target.value })}} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="name" sm={2}>姓名</Label>
							<Col sm={10}>
								<Input type="text" name="name" id="name" value={this.state.name} onChange={(e) => { this.setState({ name: e.target.value })}} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="email" sm={2}>Email</Label>
							<Col sm={10}>
								<Input type="email" name="email" id="email" value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value })}} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="resident" sm={2}>僑居地</Label>
							<Col sm={10}>
								<Input type="text" name="resident" id="resident" value={this.state.resident} onChange={(e) => { this.setState({ resident: e.target.value })}} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="order" sm={2}>志願序</Label>
							<Col sm={10}>
								<Input type="text" name="order" id="order" value={this.state.order} onChange={(e) => { this.setState({ order: e.target.value })}} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="school" sm={2}>畢業學校</Label>
							<Col sm={10}>
								<Input type="text" name="school" id="school" value={this.state.school} onChange={(e) => { this.setState({ school: e.target.value })}} />
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="dept" sm={2}>申請系所名稱</Label>
							<Col sm={10}>
								<Input type="text" name="dept" id="dept" value={this.state.dept} onChange={(e) => { this.setState({ dept: e.target.value })}} />
							</Col>
						</FormGroup>
						<FormGroup check row>
							<Col sm={{ size: 10, offset: 2 }}>
								<Button color="primary">查詢</Button>{' '}
								<Button type="button" color="secondary" onClick={this.handleReset}>清除所有條件</Button>
							</Col>
						</FormGroup>
					</Form>
				}
			</div>
		);
	}
}
