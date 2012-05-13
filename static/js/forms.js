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
    
    var isInIFrame = (window.location != window.parent.location) ? true : false;
    
    
    function addAutoComplete(){
      $("input.objecttype").each(function(i, item){
          autocomplete(item);
      });
    }
    addAutoComplete();
        
    $("body").on('click', 'button.new-entity', function(){        
        $("#newform").show();
        var iframeUri = homeUri+"create/"+($(this).attr("id").replace("new_", ""));
        $("#newform").html('<div style="height:75px"></div><div class="overlay-dialog"><iframe class="overlay-iframe overlay-element" frameborder="0" src="'+iframeUri+'"></iframe><button class="btn btn-primary btn-large close">Close</button></div>');

    });
    
    $("body").on('click', 'button.close', function(){
        $("#newform").hide();    
    });
    
    //For regular input 
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
    
    
    //For selects
    $("#view").on('change', "select.visible", function(){
        tokenLeft="<";
        tokenRight=">";
        hiddenfield = $(this).attr("id").replace("field_", "").replace(":", '\\:');  
        console.log($(this).attr("id"), hiddenfield);
        if($(this).val() == ""){
          $("#"+hiddenfield).val("");
        }else{
          $("#"+hiddenfield).val(tokenLeft+$(this).val()+tokenRight);
        }
    });
    
    $("#view").on('change', "textarea.visible", function(){
        token='""""';
        hiddenfield = $(this).attr("id").replace("field_", "").replace(":", '\\:');  
        console.log($(this).attr("id"), hiddenfield);
          $("#"+hiddenfield).val(token+$(this).val()+token);
    });

    $("#view").on('click', "button.add", function(){
     id = $(this).prev().attr("id").replace(/field_/,"");
     x = id.split(separator);
     clss = $(this).prev().attr("class");
     id = (parseInt(x[0])+1)+separator+x[1];
     $(this).before('<br/><input size="100" type="text" id="field_'+id+'" class="'+clss+'" value="" />');
     $("#data").append('<input size="100" type="hidden" id="'+id+'" value=""/>');
     addAutoComplete();
     applyClasses();
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
		    if(isInIFrame){
		      window.parent.closeIFrame();
		      return;
		    }
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
              if(isInIFrame){
                window.parent.closeIFrame();
                return;
              }
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
    
    function applyClasses(){
    		$("input.disabled").attr("disabled", "disabled");
    }
    
    applyClasses();

});
