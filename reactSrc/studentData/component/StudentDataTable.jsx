import React from 'react';
import {
	Table,
	Button
} from 'reactstrap';

export default class StudentDataTable extends React.Component {
	render() {
		return (
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
							this.props.studentList.map((val, i) => {
								return (
									<tr key={`${val.no}-${val.name}`}>
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
		);
	}
}
