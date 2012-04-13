function autocomplete(item){
      $( item ).autocomplete({
          source: function( request, response ) {
            $.ajax({
                url: autocompleteUri+$(item).attr("class").split(' ')[0]+"/"+request.term,
                dataType: "json",
                success: function( data ) {
                  response( $.map( data.items, function( item ) {
                      return {
                        label: item.name,
                        value: item.value
                      }
                  }));
                }
            });
          },
          minLength: 2,
          select: function( event, ui ) {
            beginToken = ($(this).is(".objecttype"))?'<':'"';
            endToken   = ($(this).is(".objecttype"))?'>':'"';
            var hiddenfield = $(item).attr("id").replace("field_", "").replace(":", '\\:');
            var visiblefield = $(item).attr("id").replace(":", '\\:');
            $("#"+hiddenfield).val(beginToken+ui.item.value+endToken);
            $("#"+visiblefield).val(ui.item.label);
          },
          /*open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
          },
          close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
          }*/
      });
    }
    

$(function(){
    var a = [];
        $("input:not(.rdfs\\:Literal)").each(function(i, item){
        autocomplete(item);
    });
    
    $("#view").on('change', "input.visible", function(){
        tokenLeft = '"';
        tokenRight = '"';
        if($(this).is(".objecttype")){
          tokenLeft="<";
          tokenRight=">";
        }
        hiddenfield = $(this).attr("id").replace("field_", "").replace(":", '\\:');  
        console.log($(this).attr("id"), hiddenfield);
        if($(this).val().length>0){
          offset = $(this).next().val();
          $("#"+hiddenfield).val(tokenLeft+$(this).val()+tokenRight);
          console.log("#"+hiddenfield);
          if(hiddenfield == "1-rdfs\\:label"){
            if(creationMode){
              $("#uri").val($(this).val().replace(/ /gi, "_"));
            }
            $("#1-rdfs\\:label").val(tokenLeft+$(this).val()+tokenRight);
          }
        }else{
          $("#"+hiddenfield).val("");
        }
    });
    /*
    $("input.objecttype").live('change', function(){
        hiddenfield = $(this).attr("id").replace("field_", "").replace(":", '\\:');  
        if($(this).val() != ""){
        $("#"+hiddenfield).val("<"+$(this).val()+">");
        }else{
        $("#"+hiddenfield).val("");        
        }
    });
    */
    $("#view").on('click', "button.add", function(){
     id = $(this).prev().attr("id").replace(/field_/,"");
     x = id.split(separator);
     clss = $(this).prev().attr("class");
     id = (parseInt(x[0])+1)+separator+x[1];
     $(this).before('<br/><input size="100" type="text" id="field_'+id+'" class="'+clss+'" value="" />');
     $("#data").append('<input size="100" type="text" id="'+id+'" value=""/>');
    });
    
    $( "#msgok" ).dialog({
        modal: true,
        buttons: {
          Ok: function() {
            $( this ).dialog( "close" );
            window.location=okUri;
          }
        },
        autoOpen: false,
        show: "blind",
        hide: "blind"
		});
		
		$( "#msgerror" ).dialog({
        modal: true,
        autoOpen: false,
        show: "blind",
        hide: "blind"
		});
		
		$("#cancel").click(function(){
		  history.back(-1);
		});
		
    $("#run").click(function(){
        var currentButton = "#"+$(this).attr("id");
        $(currentButton).attr("disabled", "disabled");
        if($("#uri").val() == "" || $("#uri").val() == null){
          $( "#msgerror" ).dialog({
              modal: true,
              autoOpen: false,
              show: "blind",
              hide: "blind"
          });
          $("#msgerror").html("<div title='Error'><p>You need to add AT LEAST a label</p></div>").dialog("open");
          $(currentButton).removeAttr("disabled");
          return false;
        }
        if(creationMode == true){
          $.ajax({
              type: "GET",
              url: existsUri+$("#a").val()+separator+$("#uri").val(),
              dataType: "json",
              success: function(data){
                if(data.exists == true){
                  $("#msgerror").attr("title", "Change label").html("<p>URI already exists. Change the label and try again</p>");
                  $("#msgerror").dialog("open");
                }else{
                  postData();      
                  return false;
                }
                $(currentButton).removeAttr("disabled");
              }
          });
        }else{
          postData();  
          $(currentButton).removeAttr("disabled");
          
        }
    });
    
    function postData(){
      var dataString = "";
      var connector = "";
      $("#data>input").each(function(i, item){
          if($(item).val() != "" && $(item).val() != null){
            dataString += connector+$(item).attr("id")+"="+$(item).val();
            connector = "&" //Adding & after the first param
          }
      });
      console.log(dataString);
      $.ajax({
          type: "POST",
          url: processingUri,
          data: dataString,
          dataType: "json",
          success: function(data) {
            console.log("Data status:", data.status);
            if(parseInt(data.status) >= 200 && parseInt(data.status) < 300){
              $("#msgok").html("Ok").dialog("open");
            }else{
              $("#msgerror").attr("title", "Error").html("Something happened when submitting the data");
            $( "#msgerror" ).dialog( "open" );
            }
            
          },
          error: function(){
            $("#msgerror").html("Error while posting data");
            $( "#msgerror" ).dialog("open");
          }
      });
    }
});
