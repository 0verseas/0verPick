import React from 'react';
import {
	Table,
	Button,
	Pagination,
	PaginationItem,
	PaginationLink
} from 'reactstrap';

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
			pageSize: 5
		};

		this.handleChangePage = this.handleChangePage.bind(this);
	}

	handleChangePage(page) {
		this.setState({
			currentPage: page
		});
	}

	render() {
		// TODO: sort
		// pagination
		const start = (this.state.currentPage - 1) * this.state.pageSize;
		const studentList = this.props.studentList.slice(start, start + this.state.pageSize);
		return (
			<div>
				<div style={{overflow: 'auto'}}>
					<Table style={{minWidth: '1000px'}} hover bordered>
						<thead>
							<tr>
								<th>申請系所名稱</th>
								<th>僑生/港澳生編號</th>
								<th>姓名</th>
								<th>身份別</th>
								<th>僑居地</th>
								<th>志願序</th>
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
											<td className="text-center"><Button color="secondary" size="sm">個人基本資料</Button></td>
											<td className="text-center"><Button color="secondary" size="sm">下載審查資料</Button></td>
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
