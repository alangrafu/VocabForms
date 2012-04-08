$(document).ready(function(){
    var a = [];
    $("input:not(.rdfs\\:Literal)").each(function(i, item){
        $( item ).autocomplete({
            source: function( request, response ) {
              $.ajax({
                  url: "../instances/"+$(item).attr("class").split(' ')[0]+"/"+request.term,
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
    
    $(".rdfs\\:Literal").live('keyup', function(){
        token = '"';
        hiddenfield = $(this).attr("id").replace("field_", "").replace(":", '\\:');    
        if($(this).val().length>0){
          if($("#"+hiddenfield).is("#rdfs\\:label")){
            $("#uri").val($(this).val().replace(/ /gi, "_"));
          }
          $("#"+hiddenfield).val(token+$(this).val()+token);
          console.log(hiddenfield,$(this).val());
        }
    })
});
