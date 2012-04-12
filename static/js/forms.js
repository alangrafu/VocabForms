$(document).ready(function(){
    var a = [];
    $("input:not(.rdfs\\:Literal)").each(function(i, item){
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
    });
    
    $(".rdfs\\:Literal").live('change', function(){
        console.log("change",$(this).attr("id"));
        token = '"';
        hiddenfield = $(this).attr("id").replace("field_", "").replace(":", '\\:');    
        if($(this).val().length>0){
          $("#"+hiddenfield).val(token+$(this).val()+token);
          if(hiddenfield == "rdfs\\:label"){
            $("#uri").val($(this).val().replace(/ /gi, "_"));
            console.log("uri",$("#uri").val() );
          }
          console.log(hiddenfield,$("#"+hiddenfield).val() );
        }
    });
    
    $("input.objecttype").live('change', function(){
        hiddenfield = $(this).attr("id").replace("field_", "").replace(":", '\\:');  
        console.log(hiddenfield);
        $("#"+hiddenfield).val("<"+$(this).val()+">");
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
          return false;
        }
        if(creationMode == true){
          $.ajax({
              type: "GET",
              url: existsUri+$("#a").val()+"/"+$("#uri").val(),
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
