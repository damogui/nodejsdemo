{{each}}

            
            <div class="org_detail">
            <div class="org_img">
			 {{if $value.IsMoneyWaring==1}}
             <div class="left_top">储值不足</div>
          {{else}}
       
            {{/if}}
                
                <img class="imgaa" src="{{$value.OrgLogo}}" alt="">
                <div class="right_bottom" title="{{$value.AreaStr}}">{{$value.AreaStr | cutchar: 13}}</div>
            </div>

            <div class="right_msg" style="width:80%;">
                <div class="org_left">
                    <div class="title"><span class='textOver' >{{$value.OrgName}}</span><span class="award"></span><span class="level">{{$value.TeachTypeStr}}</span></div>
                    <P class="message">年营收：{{$value.SalesStr}}</P>
                    <P class="message">规模：<span>{{$value.SchoolsStr}}／{{$value.TeachersStr}}／{{$value.StudentsStr}}</P>
                    <P class="message">开通：<span> {{$value.CreateTimeStr}}</span></P>
                </div>
                <div class="org_center">
                    <p>{{$value.LinkMan}}</p>
                    <p>{{$value.LinkManTel}}</p>
                </div>
                <div class="org_right">
                    <div class="surplus">
                        <div class="btn addMoney" id="{{$value.OrgId}}" data-uid="{{$value.SellerId}}" data-uname="{{$value.UserName}}" data-cm="{{$value.CurrentValue}}" data-oname="{{$value.OrgName}}">充值</div>
                        <p>剩余储值 {{$value.CurrentValueStr}} 元</p>
                    </div>
                </div>
            </div>
        </div>

			{{/each}}