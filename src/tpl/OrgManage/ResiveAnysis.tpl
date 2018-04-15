{{each}}
{{ if $value.ActionType==1||$value.ActionType==5||$value.ActionType==6}}

			<tr class="mine">
                    <td>{{$value.CreateTime}}</td>
					 <td>---</td>
                    <td>我</td>
                    <td style='text-align:left;'>{{$value.Remarks}}</td>
                    <td>
                        <span  style="color: #7EE39A;font-weight: 600;">+{{$value.OrgValue}}</span>
                    </td>
                </tr>
			{{else}}
		  <tr>
                    <td>{{$value.CreateTime}}</td>
					<td>{{$value.SchoolName}}</td>
                    <td>{{$value.OperationUserName}}</td>
                    <td style='text-align:left;'>{{$value.Remarks}}</td>
                    <td>
					{{ if $value.OrgValue>0}}
					   <span  style="color: #7EE39A;font-weight: 600;">+{{$value.OrgValue}}</span>
					{{else}}
                        <span class="red">{{$value.OrgValue}}</span>
							{{/if}}
                    </td>
                </tr>
			{{/if}}
			{{/each}}