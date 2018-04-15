 {{each}}
<tr>
  <td>{{$value.CreateTimeStr}}</td>
  <td>{{$value.ActionTypeStr}}</td>
  <td>{{$value.OrgName}}</td>
  {{ if $value.OrgValue>0}}
 <td style="color: #7EE39A;font-weight: 600;">+{{$value.OrgValueStr}}</td>
  {{else}}
  <td class="red">{{$value.OrgValueStr}}</td>
  {{/if}}

  <td>{{$value.AfterValueStr}}</td>
  <td>{{$value.Remarks}}</td>
</tr>

{{/each}}


