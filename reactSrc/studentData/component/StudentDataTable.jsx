import React from 'react';
import {
	Table,
	Button,
	Pagination,
	PaginationItem,
	PaginationLink
} from 'reactstrap';
import cloneDeep from 'lodash.clonedeep';

class PageBar extends React.Component {
	render() {
		const pages = Math.ceil(this.props.dataLength / this.props.pageSize);
		return (
			<Pagination style={{display: 'flex', justifyContent: 'center'}}>
				<PaginationItem onClick={() => {this.props.onPage(1)}}>
					<PaginationLink previous href="javascript:;" />
				</PaginationItem>
				{
					[...Array(pages)].map((val, i) => {
						return (
							<PaginationItem
								key={i}
								active={i + 1 === this.props.currentPage}
								onClick={() => {this.props.onPage(i + 1)}}
							>
								<PaginationLink href="javascript:;">
									{ i + 1 }
								</PaginationLink>
							</PaginationItem>
						);
					})
				}
				<PaginationItem onClick={() => {this.props.onPage(pages)}}>
					<PaginationLink next href="javascript:;" />
				</PaginationItem>
			</Pagination>
		);
	}
}

export default class StudentDataTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 1,
			pageSize: 15,
			sort: '' // 'name.desc'
		};

		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.getStudentMergedFile = this.getStudentMergedFile.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (JSON.stringify(nextProps.studentList) !== JSON.stringify(this.props.studentList)) {
			this.setState({
				currentPage: 1
			});
		}
	}

	handleChangePage(page) {
		this.setState({
			currentPage: page
		});
	}

	handleSort(key) {
		let sortKey = key;
		let sortType = 'asc';
		if (this.state.sort.split('.')[0] === sortKey) {
			 if (this.state.sort.split('.')[1] === 'asc') {
			 	sortType = 'desc';
			 }
		}

		this.setState({
			sort: `${sortKey}.${sortType}`
		});
	}

	getStudentMergedFile(studentId, deptId) {
		window.API.getStudentMergedFile(window.getSystem(), studentId, deptId, filename);
	}

	comapreField(key, type) {
		const order = type === 'desc' ? -1 : 1;
		return function (a, b) {
			if (a[key] < b[key])
				return order;
			if (a[key] > b[key])
				return -order;
			return 0;
		}
	}

	render() {
		let studentList = cloneDeep(this.props.studentList)
		// sort
		const [sortKey, sortType] = this.state.sort.split('.');
		let sortIcon;
		if (sortType === 'desc') {
			sortIcon = (<i className="fa fa-caret-up" aria-hidden="true"></i>);
		}

		if (sortType === 'asc') {
			sortIcon = (<i className="fa fa-caret-down" aria-hidden="true"></i>);
		}

		if (!!this.state.sort) {
			studentList = studentList.sort(this.comapreField(sortKey, sortType));
		}

		// pagination
		const start = (this.state.currentPage - 1) * this.state.pageSize;
		studentList = studentList.slice(start, start + this.state.pageSize);

		const thStyle = { cursor: 'pointer' };
		return (
			<div>
				<div style={{overflow: 'auto'}}>
					<Table style={{minWidth: '1000px'}} hover bordered>
						<thead>
							<tr>
								<th style={thStyle} onClick={() => this.handleSort('dept')}>申請系所名稱 {!!this.state.sort && sortKey === 'dept' && sortIcon}</th>
								<th style={thStyle} onClick={() => this.handleSort('no')}>僑生編號 {!!this.state.sort && sortKey === 'no' && sortIcon}</th>
								<th style={thStyle} onClick={() => this.handleSort('name')}>姓名 {!!this.state.sort && sortKey === 'name' && sortIcon}</th>
								<th style={thStyle} onClick={() => this.handleSort('identity')}>身份別 {!!this.state.sort && sortKey === 'identity' && sortIcon}</th>
								<th style={thStyle} onClick={() => this.handleSort('resident')}>僑居地 {!!this.state.sort && sortKey === 'resident' && sortIcon}</th>
								<th style={thStyle} onClick={() => this.handleSort('order')}>志願序 {!!this.state.sort && sortKey === 'order' && sortIcon}</th>
								<th></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{
								studentList.map((val, i) => {
									return (
										<tr key={`${val.no}-${val.name}-${val.dept}`}>
											<td>{val.dept}</td>
											<td>{val.no}</td>
											<td>{val.name}</td>
											<td>{val.identity}</td>
											<td>{val.resident}</td>
											<td>{val.order}</td>
											<td className="text-center"><Button color="primary" size="sm" onClick={() => { this.props.onDetail(val.userID, val.deptID) }}>學生詳細資料</Button></td>
											<td className="text-center"><Button color="success" size="sm" onClick={() => { this.getStudentMergedFile(val.userID, val.deptID, val.no, val.name, val.dept) } }>下載審查資料</Button></td>
										</tr>
									);
								})
							}
						</tbody>
					</Table>
				</div>
				<PageBar
					currentPage={this.state.currentPage}
					dataLength={this.props.studentList.length}
					pageSize={this.state.pageSize}
					onPage={this.handleChangePage}
				/>
			</div>
		);
	}
}
