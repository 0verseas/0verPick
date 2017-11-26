import React from 'react';
import {
	Table,
	Button
} from 'reactstrap';

export default class StudentDataTable extends React.Component {
	render() {
		return (
			<div style={{overflow: 'auto'}}>
				<Table style={{minWidth: '1000px'}}>
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
						<tr>
							<td>經營管理系</td>
							<td>000911</td>
							<td>林一二</td>
							<td>港澳生</td>
							<td>澳門</td>
							<td>1</td>
							<td><Button color="secondary" size="sm">個人基本資料</Button></td>
							<td><Button color="secondary" size="sm">下載審查資料</Button></td>
						</tr>
					</tbody>
				</Table>
			</div>
		);
	}
}
