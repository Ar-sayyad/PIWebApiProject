app.controller('elementDataController', function($scope) {
    $scope.pagename="PI Tag Data";
     $('#default-datatable').DataTable();
       var table = $('#example').DataTable( {
        lengthChange: false,
        buttons: [ 'copy', 'excel', 'pdf', 'print', 'colvis' ]
      } );
 
     table.buttons().container()
        .appendTo( '#example_wrapper .col-md-6:eq(0)' );

    var url = baseServiceUrl + 'dataservers/' + TagWebId + '/points';
    var ajaxEF = processJsonContent(url, 'GET', null);
    $.when(ajaxEF).fail(function() {
        warningmsg("Cannot Find the PI Points.");
        console.log("Cannot Find the PI Points.")
    });
    $.when(ajaxEF).done(function() {
        var pipoints=[];
        $("#example tbody").empty();
        var cat=1;
        var type='';
         var attributesItems = (ajaxEF.responseJSON.Items);
            $.each(attributesItems, function(key) {
                //pipoints.push(Name);
                 $("#attributesListLeft").append('<li class="paramterListChild paramterList'+cat+'">\n\
                            <input type="checkbox" id="elemList'+cat+'" data-id="'+cat+'"  data-path="'+attributesItems[key].Path+'" data-desc="'+attributesItems[key].Descriptor+'" onchange="loadModel('+cat+');" class="paraList" value="'+attributesItems[key].Name+'" name="selectorLeft'+cat+'">\n\
                            <label class="labelListChild leftLabel" for="elemList'+cat+'">'+attributesItems[key].Name+' : '+attributesItems[key].Path+'</label>\n\
                            </li>'); 
                //$("#example tbody").append("<tr role='row' class="+type+"><td class='sorting_1'>"+cat+"</td><td>"+Name+"</td><td>"+Path+"</td><td>"+Descriptor+"</td></tr>")
                cat++;
            });
        //console.log(pipoints);
        
       
    });


 /****Each Save Button START***/
    function saveAllocation(srn, dataValues, dateTime) {
        var elementWebId = $("#elements" + srn).val();
        var url = baseServiceUrl + 'elements/' + elementWebId + '/attributes';
        var attributesElements = processJsonContent(url, 'GET', null);
        $.when(attributesElements).fail(function() {
            warningmsg("Cannot Find the Attributes.");
            console.log("Cannot Find the Attributes.")
        });
        $.when(attributesElements).done(function() {
            var attributesItems = (attributesElements.responseJSON.Items);
            $.each(attributesItems, function(key) {
                if (attributesItems[key].Name === allocationAttributeName) {
                    var url = baseServiceUrl + 'streams/' + attributesItems[key].WebId + '/recorded';
                    var data = [{
                        "Timestamp": dateTime,
                        "UnitsAbbreviation": "m",
                        "Good": !0,
                        "Questionable": !1,
                        "Value": dataValues
                    }];
                    var postData = JSON.stringify(data);
                    var postAjaxEF = processJsonContent(url, 'POST', postData, null, null);
                    $.when(postAjaxEF).fail(function() {
                        errormsg("Cannot Post The Data.")
                    });
                    $.when(postAjaxEF).done(function() {
                        var response = (JSON.stringify(postAjaxEF.responseText));
                        if (response == '""') {
                            successmsg("Data Saved successfully.")
                        } else {
                            var failure = postAjaxEF.responseJSON.Items;
                            $.each(failure, function(key) {
                                warningmsg("Status: " + failure[key].Substatus + " <br> Message: " + failure[key].Message)
                            })
                        }
                    })
                } else {}
            })
        })
    }
     /****Each Save Button END***/
});
function loadModel(cat){
       if($("#elemList"+cat).is(":checked")){
        console.log("checked");
        var Name =  $("#elemList"+cat).val();
        var path =  $("#elemList"+cat).data('path');
        var desc =  $("#elemList"+cat).data('desc');
        $(".modal-title").html("Tag Data");
        $(".modal-body").html("<h4>"+Name+"</h4><h5>"+path+"</h5><h6>"+desc+"</h6>");
        $('#modal-animation-3').modal('show');
    }else{
      console.log("Not checked");
 }
 
}