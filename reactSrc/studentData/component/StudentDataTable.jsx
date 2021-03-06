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
		const pages = Math.ceil(this.props.dataLength / this.props.pageSize); // 總頁數
		/* PageBar 目前限制在10個頁面選項之中 */
		let pageOffset = 0; //偏移值
		pageOffset = this.props.currentPage+5-pages <0 ? 0 :this.props.currentPage+5-pages; //如果到底了計算不能往後的值
		let pageFront = this.props.currentPage-5-pageOffset <0 ?0 :this.props.currentPage-5-pageOffset; //計算PageBar第一個選項值
		pageOffset = this.props.currentPage-5>0 ? 0 :this.props.currentPage-5;//如果到頂了計算不能往前的值
		let pageBehind = this.props.currentPage+5-pageOffset>pages ?pages :this.props.currentPage+5-pageOffset;//計算PageBar最後面選項值
		let pageRange = pageBehind - pageFront;//PageBarRange值  按照前面的算法 目前不管怎樣都 <= 10
		let prePage = this.props.currentPage -1 < 1 ? this.props.currentPage : this.props.currentPage-1; //計算上一頁的值
		let nextPage = this.props.currentPage +1 > pages ? this.props.currentPage : this.props.currentPage+1;//計算下一頁的值
		return (
			<Pagination style={{display: 'flex', justifyContent: 'center'}}>
				<PaginationItem onClick={() => {this.props.onPage(1)}}>
					<PaginationLink previous href="javascript:;" />
				</PaginationItem>
				<PaginationItem onClick={() => {this.props.onPage(prePage)}}>
					<PaginationLink href="javascript:;">
						{'<'}
					</PaginationLink>
				</PaginationItem>
				{
					//只顯示pageRange數量的page按鈕 （10個）//因為是動態計算的頁面範圍所以 i 要加上pageFront才是正確的數值
					[...Array(pageRange)].map((val, i) => {
						return (
							<PaginationItem
								key={i}
								active={i + 1+pageFront === this.props.currentPage}
								onClick={() => {this.props.onPage(i + 1+pageFront)}}
							>
								<PaginationLink href="javascript:;">
									{ i + 1+pageFront }
								</PaginationLink>
							</PaginationItem>
						);
					})
				}
				<PaginationItem onClick={() => {this.props.onPage(nextPage)}}>
					<PaginationLink href="javascript:;">
						{'>'}
					</PaginationLink>
				</PaginationItem>
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

	getStudentMergedFile(studentId, deptId, filetype) {
		window.API.getStudentMergedFile(window.getSystem(), studentId, deptId, filetype);
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

											<td className="text-center"><Button color="success" size="sm" onClick={() => { this.getStudentMergedFile(val.userID, val.deptID, 'pdf') } }>下載審查資料（PDF 檔）</Button></td>
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

//<td className="text-center"><Button color="success" size="sm" onClick={() => { this.getStudentMergedFile(val.userID, val.deptID, 'raw') } }>下載審查資料（原始檔）</Button></td>
//<td className="text-center"><Button color="success" size="sm" onClick={() => { this.getStudentMergedFile(val.userID, val.deptID, 'pdf') } }>下載審查資料（PDF 檔）</Button></td>
