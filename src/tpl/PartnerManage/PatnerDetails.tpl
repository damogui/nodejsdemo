  <p class="base">个人资料</p>
        <div class="inner-mes">
            <p>&emsp;&emsp;&emsp;姓名：&emsp;<span id="patnerName">{{UserName}}</span>
              {{ if GenderNum==1}}
              <span class="man sex" data-id="{{GenderNum}}"></span>
              {{else}}
              <span class="woman sex" data-id="{{GenderNum}}"></span>
              {{/if}}
            
			 <span class="right btn-blue" style="width: 100px;" id="editData">修改资料</span></p>
            <p>&emsp;&emsp;&emsp;邮箱：&emsp;<span id="emailData">{{Email}}</span></p>
          <p>
            &emsp;&emsp;&emsp;公司：&emsp;<span id="corpName">{{CorpName}}</span>
          </p>
            <p>加入合伙人：&emsp;<span>{{AddDays}}天</span></p>
            <p style="margin-bottom:15px; width: 733px;">
                &emsp;负责城市：&emsp;<span></span>
                <span class="right" style="color: #0073e9;cursor: pointer" id="addCity">添加城市</span>
            </p>
            <div class="table">
                <table>
                    <thead>
                        <tr><th>省</th><th>市</th><th>区/县</th><th>操作</th></tr>
                    </thead>
                    <tbody  id="tbpc">

                      {{include './PatnerDetails2' PatnersAreas}}
                     
                    </tbody>
                </table>
            </div>

        </div>
        <p class="base">账号密码</p>
        <div style="text-align: right; margin-top: 40px;">
            <div class="pass_word">
                <p>手机：&emsp;&emsp;<span class="messg" id="patnerTel">{{Tel}}</span>
                  {{ if IsCorpNum==1}}
                  <span class="btn-blue right" style="width: 100px; margin-left: 15px;" id="btnBanAccount">禁用账号</span>
                  {{else}}
                  <span class="btn-blue right" style="width: 100px; margin-left: 15px;">已禁用</span>
                  {{/if}}             
                  <span class="btn-blue right" style="width: 100px;" id="btnResetPwd">重置密码</span></p>
                <p>开通：&emsp;&emsp;<span class="messg">{{CreatTimeStr}}</span></p>
                <p id="bandSpan">
                  禁用：&emsp;&emsp;{{ if IsCorpNum==1}}{{else}}<span class="messg">{{EditTimeStr}}</span><span class="btn disuse" style="font-size: 14px;">已禁用</span>
                  {{/if}}
                </p>
            </div>
        </div>