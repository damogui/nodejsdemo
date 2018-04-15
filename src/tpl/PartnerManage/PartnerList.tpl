{{each}}
		    <tr data-id="{{$value.UserId}}">
                <td>{{$value.UserName}}</td>
                <td>{{$value.Tel}}</td>
					{{ if $value.IsCorpStr=="有效"}}
					    <td class="green">{{$value.IsCorpStr}}</td>
					{{else}}
                         <td class="red">{{$value.IsCorpStr}}</td>
							{{/if}}
							{{include './PartnerList2' $value.PartnerProvinceCitiesList}}
             
                <td>{{$value.CurrentValueStr}}</td>
                <td>{{$value.SumValue}}</td>
                <td>{{$value.CreateTimeStr}}</td>
				{{ if $value.IsCorpStr=="有效"}}
					   <td class="addMoney" data-id="{{$value.UserId}}" data-left="{{$value.CurrentValueStr}}" data-name="{{$value.UserName}}">充值</td>
					{{else}}
                         <td ></td>
							{{/if}}
                
            </tr>

{{/each}}