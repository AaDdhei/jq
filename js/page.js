var curPage = 1,
    searchInfo = ''
function buildAjaxobj(curPage, searchInfo) {
    var getCharpterObj = {
        //   url: "http://47.108.131.92:8084/charpterInfo/getAll?curPage=1&pageSize=10&searchInfo=",
        url: "http://47.108.131.92:8084/charpterInfo/getAll?curPage=" + curPage + "&pageSize=10&searchInfo=" + searchInfo,
        type: 'GET',
        contentType: "application/json",
        success: function (dmdt) {
            // console.log(dmdt);
            var state = ["badge badge-danger", "badge badge-success",]
            var statename = ["异常", "正常"]
            if (dmdt.code == 200) {
                var data = dmdt.data;
                var htmlStr = "";
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var itemHtml = '<tr>' +
                        '<td>' +
                        ' <div class="form-check">' +
                        ' <input class="form-check-input" type="checkbox" id="ids" value= "' + item.id + '"/>' +
                        '<label class="form-check-label" for="defaultCheck2">' +

                        ' </label>' +
                        '</div> ' +
                        '</td>' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.title + '</td>' +
                        '<td>' + item.bookName + '</td>' +
                        '<td>' + item.author + '</td>' +
                        '<td>' + item.readRecords + '</td>' +
                        '<td> <sapn class="' + state[item.stateType] + '">' + statename[item.stateType] + '</span></td>' +
                        '<td>' +
                        '<div style="margin-left:55px">' +
                        '<button type="button" class="btn btn-primary btn updateObj" id="">修改</button>' +
                        '<button type="button" class="btn btn-secondary btn delObj" style="margin-left:15px" id="">删除</button>' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '</tr>';
                    htmlStr += itemHtml

                }
                $(".docTable").html(htmlStr);
                $(".deleteCurrentObj").click(function () {
                    $("tbody .custom-control-input").prop("checked", false);
                    $(this).parents('tr').find(".ids").prop("checked", "ture");
                    deletMethod();
                });
                // 内容删除
                $(".delObj").click(function () {
                    $("tbody .form-check-input").prop("checked", false);
                    var a = $(this).parents("tr").children("td:nth(0)");
                    $(a[0]).find("input").prop("checked", true)
                    ask();
                    // dataDel = $(this).parents('tr').children('td').eq(1).text()
                    // // console.log(dataDel);
                    // databox.ids.push(dataDel)
                    // // $('#exampleModal2').modal('show');
                    // $.ajax({
                    //     url: "http://47.108.131.92:8084/charpterInfo/deleteByIds",
                    //     type: "POST",
                    //     data: JSON.stringify(databox),
                    //     contentType: 'application/json',
                    //     success(res) {
                    //         if (res.code == 200) {
                    //             $('#exampleModal3').modal('show');
                    //             // location.reload(true)
                    //             // console.log(res.data);
                    //             buildAjaxobj(curPage, searchInfo);
                    //         }
                    //     }
                    // })
                })
                //修改
                $(".updateObj").click(function () {
                    var updataId = $(this).parents('tr').children('td').eq(1).text()
                    // console.log(updataId);
                    databox.id = updataId
                    $.get({
                        url: "http://47.108.131.92:8084/charpterInfo/getObjById?id=" + updataId,
                        contentType: "application/ json",
                        success(res) {
                            if (res.code == 200) {
                                var data = res.data
                                $('#recipient1').val(data.title)
                                $('#recipient2').val(data.bookName)
                                $('#recipient3').val(data.author)
                                // data.stateType === 0 ? $("#stateType1").prop('checked', true) : $("#stateType2").prop('checked', true)    
                                data.stateType == 0 ? $("#inlineRadio2").prop("checked", true) : $("#inlineRadio1").prop("checked", true)
                                // console.log(data);
                                // $($("input[type='radio']:checked")[0]).prop("checked", false)
                                $('#exampleModal').modal('show')
                            }
                        }
                    })
                });
                //分页
                var pages = dmdt.pages;
                var curPage = dmdt.curPage;
                $("#thisPage").text(curPage);
                if (curPage == 1) {
                    $("#upPage").hide();
                } else {
                    $("#upPage").show();
                }
                if (curPage == pages) {
                    $("#nextPage").hide();
                } else {
                    $("#nextPage").show();
                }
            } else {
                $(".docTable").html(dmdt.msg + '...');
            }

        },
        error: function () {
            alert("获取数据失败！")
        }
    }
    $.ajax(getCharpterObj);
}

buildAjaxobj(curPage, searchInfo);

$("#upPage").click(function () {
    // buildAjaxobj(--statusbar )
    curPage--
    buildAjaxobj(curPage, searchInfo);
    $("#thisPage").text(curPage);
});
$("#nextPage").click(function () {
    curPage++
    // buildAjaxobj(++statusbar);
    buildAjaxobj(curPage, searchInfo);
    $("#thisPage").text(curPage);
});
$("defaultCheck1").change(function () {
    var curState = $(this).prop("checked");
    $("tbody tr td div input").prop("checked", curState)
});
// 搜索
$("#search").click(function () {
    searchInfo = $("#searchData").val();
    // searchInfo=databox.searchInfo
    // console.log(searchInfo);
    curPage = 1
    buildAjaxobj(curPage, searchInfo);
    event.preventDefault();
})


let databox = {
    title: '',
    bookName: '',
    author: '',
    stateType: '',
    id: '',
    ids: []
}//全选
$("#defaultCheck1").change(function () {
    var state = $(this).prop("checked");
    $("tbody .form-check-input").prop("checked", state);
});
//添加数据
$('#addTodo').click(function () {
    databox.title = $('#recipient1').val()
    databox.bookName = $('#recipient2').val()
    databox.author = $('#recipient3').val()
    databox.stateType = $("input[type='radio']:checked").val()

    $.ajax({
        url: "http://47.108.131.92:8084/charpterInfo/add",
        type: "POST",
        dataType: "JSON",
        data: JSON.stringify(databox),
        contentType: "application/json",
        success: function (res) {
            if (res.code == 200) {
                $('#exampleModal').modal('hide')
                $('#exampleModal1').modal('show')
                // databox.id == '' ? $('#exampleModal1 .modal-body').text('新增成功!') : $('#exampleModal1 .modal-body').text('修改成功!');
                if (databox.id == '') {
                    $('#exampleModal1 .modal-body').text('新增成功!')
                } else {
                    $('#exampleModal1 .modal-body').text('修改成功!');
                }
                // console.log(res.data);
                buildAjaxobj(curPage, searchInfo);
                $('#recipient1').val("");
                $('#recipient2').val("");
                $('#recipient3').val("");
                // $($("input[type='radio']:checked")[0]).prop("checked", false)
                $("#inlineRadio2").prop('checked', false);
                $("#inlineRadio1").prop('checked', false);
            }
        }
    })
})
//删除数据
$('#deldata').click(function () {
    ask();
    // arr.length==0? $(".modal-body").text("未选中数据，无法删除！"): $(".modal-body").text("是否删除选中数据？");
})

function ask() {
    // $('#exampleModal2').modal('show');
    var arr = $("#ids:checked");
    // console.log(arr);
    if (arr.length == 0) {
        $('#exampleModal4').modal('show');
    } else {
        $('#exampleModal2').modal('show');
    }
}
// 删除内容
$("#del").click(function () {
    $('#exampleModal2').modal('hide');
    deleteMulOrSingle();
})
// 简化

function deleteMulOrSingle() {
    let arr = $("#ids:checked");
    let results = [];
    for (var i = 0; i <= arr.length - 1; i++) {
        results.push($(arr[i]).attr("value"));
    }
    databox.ids = results
    $.ajax({
        url: "http://47.108.131.92:8084/charpterInfo/deleteByIds",
        type: "POST",
        data: JSON.stringify(databox),
        contentType: 'application/json',
        success(res) {
            if (res.code == 200) {
                $('#exampleModal3').modal('show');
                // location.reload(true)
                // console.log(res.data);
                buildAjaxobj(curPage, searchInfo);
            }
        }
    })
}



