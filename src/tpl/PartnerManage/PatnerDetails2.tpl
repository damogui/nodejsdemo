{{each}}
<tr data-id="{{$value.SId}}-{{$value.CityId}}" data-x="{{$value.CountryId}}">
                            <td>{{$value.SName}}</td>
                            <td>{{$value.CityName}}</td>
                            <td>{{$value.CountryName}}</td>
                            <td style="color: #ff5400; cursor: pointer;"  data-id="{{$value.SId}}-{{$value.CityId}}" data-x="{{$value.CountryId}}" class="delete">修改</td>
                        </tr>
                      
{{/each}}



