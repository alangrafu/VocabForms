

$(function(){
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
            $(this).val(ui.item.value);
            $(this).next().attr("resource", ui.item.value);
            updateGraph();
          },
          /*open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
          },
          close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
          }*/
      });
    }
      
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
    
function updateGraph(){
        $("#view").attr("about", baseUri+$("#field_1-rdfs\\:label").val().replace(/\s+/gi, "_").toLowerCase());
        $(".visible").each(function(i, item){
            if($(item).is(".objecttype")){
              console.log($(item).attr("id"), $(item).attr("value"));
              if($(item).attr("value") != ""){
                $(item).next().attr("resource", $(item).attr("value"));
              }
            }else{
              $(item).next().attr("content", $(item).attr("value"));
            }
        });
        console.log($('#view').rdf().databank.dump({format: 'application/rdf+xml', serialize: true}));
}
    $('<button id="add_{{ row.predicate.curie }}" class="btn-mini btn add">+</button><button id="new_{{ row.predRange.curie }}" class="btn-mini btn new-entity">Nueva entidad</button>').insertBefore(".objecttype");
    $("#view").on('change', "input", function(){ updateGraph();});
    $("#view").on('change', "textarea", function(){ updateGraph();});
    $("#view").on('change', "select", function(){ updateGraph();});

    
    $("#view").on('click', "button.add", function(){
     id = $(this).next().next().attr("id").replace(/field_/,"");
     x = id.split(separator);
     clss = $(this).next().next().attr("class");
     id = (parseInt(x[0])+1)+separator+x[1];
     $(this).before('<br/><input size="100" type="text" id="field_'+id+'" class="'+clss+'" value="" />');
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
        if(creationMode == true){
         /* $.ajax({
              type: "GET",
              url: $("#view").attr("about"),
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
          });*/
                  postData();      
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
      var dumpGraph = $('#view').rdf().where('?a ?b ?c').filter(function () {return this.c.value !== ""; });
      $.post(processingUri, {request: dumpGraph.dump({format: 'application/rdf+xml', serialize: true})},
        function(data) {
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
          
        }, 'json');
    }
    
    function applyClasses(){
    		$("input.disabled").attr("disabled", "disabled");
    }
    
    applyClasses();

});
