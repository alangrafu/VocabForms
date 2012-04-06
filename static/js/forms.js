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
              var visiblefield = $(item).attr("id").replace(":", '\\:');
              var hiddenfield = "field_"+visiblefield;
              $("#"+hiddenfield).val(ui.item.value);
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
});
