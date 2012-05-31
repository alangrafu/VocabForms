$(document).ready(function(){
    function autocomplete(item){
      try{
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
        });
      }
      catch(err){
        console.log(err);
      }
      
    }
    
    var isInIFrame = (window.location != window.parent.location) ? true : false;
    
    
    //function addAutoComplete(){
      $(".objecttype.visible").each(function(i, item){
          autocomplete(item);
      });
    //}
    //addAutoComplete();
        
    $("body").on('click', 'button.new-entity', function(){        
        $("#newform").show();
        var iframeUri = homeUri+"create/"+($(this).attr("id").replace("new_", ""));
        $("#newform").html('<div style="height:75px"></div><div class="overlay-dialog"><iframe class="overlay-iframe overlay-element" frameborder="0" src="'+iframeUri+'"></iframe><button class="btn btn-primary btn-large close">Close</button></div>');

    });
    
    $("body").on('click', 'button.add-connection', function(){ 
        $(this).parent().next().append("<div rev='foaf:page' resource='http://google.com'>HOLA</div>");
    });
    
    $("body").on('click', 'button.close', function(){
        $("#newform").hide();    
    });
    
    function updateGraph(){
      $("#view").attr("about", baseUri+$("#field_1-rdfs\\:label").val().replace(/\s+/gi, "_").toLowerCase());
      $(".visible").each(function(i, item){
          if($(item).attr("value") != ""){
            predicate = $(item).next().attr("name");
            if($(item).is(".objecttype")){
              $(item).next().attr("rel", predicate);
              $(item).next().attr("resource", $(item).attr("value"));
            }else{
              $(item).next().attr("property", predicate);
              $(item).next().attr("content", $(item).attr("value"));
            }
          }else{
            if($(item).is(".objecttype")){
              $(item).next().removeAttr("rel");
            }else{
              $(item).next().removeAttr("property");
            }
          }
      });
      console.log($('#view').rdf().databank.dump({format: 'text/turtle', serialize: true}));
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
    
	
		$( "#msgerror" ).dialog({
        modal: true,
        autoOpen: false,
        show: "blind",
        hide: "blind"
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
		
		$("#cancel").click(function(){
		    if(isInIFrame){
		      window.parent.closeIFrame();
		      return;
		    }
		  history.back(-1);
		});
		
		
    $("#run").click(function(){
        if(!checkIfExists($("#view").attr("about"))){
          postData();
        }
    });
    $('#field_1-rdfs:label').on('change',  function(){ checkIfExists( $(this).attr("about"));});
   
   
   function checkIfExists(uri){
     $.ajax({
         type: "GET",
         url: existsUri+uri.replace(":/", ""),
         dataType: "json",
         success: function(data){
           if(data.exists == true){
             $("#msgerror").attr("title", "Change label").html("<p>URI already exists. Change the label and try again</p>");
             $("#msgerror").dialog("open");
             return true;
           }else{
             return false;
           }
         }
     });
   }
   
   function postData(){
     var dataString = "";
     var connector = "";
     var dumpGraph = $('#view').rdf().databank.dump({format: 'text/turtle', serialize: true});
     $("#run").attr("disabled", "disabled");
     $.post(processingUri, dumpGraph,
       function(data) {
         console.log("Data status:", data.status);
         if(parseInt(data.status) >= 200 && parseInt(data.status) < 300){
           if(isInIFrame){
             window.parent.closeIFrame();
             return;
           }
           $("#msgok").attr("title", "Saved").html("<p>Data saved succesfully</p>");
           $("#msgok").dialog("open");
         }else{
           $("#msgerror").attr("title", "Error").html("Something happened when submitting the data");
           $( "#msgerror" ).dialog( "open" );
         }
         
       }, 'json')
     .error(function(xhr, statusText, err){
         alert("Error:" + xhr.status); 
     });
   }
   
   function applyClasses(){
     $("input.disabled").attr("disabled", "disabled");
   }
   
   applyClasses();
});
