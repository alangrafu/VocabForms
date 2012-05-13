function fillSelectForm(id, rangeType){
  $.ajax({
      url: homeUri+'instances.json/'+rangeType,
      dataType: "json",
      success: function (data) {
        elementId = "#"+id.replace(":", '\\:');
        $(elementId).append("<option value=''>Select</option>");
        $.each(data.items, function(i, v){
          $(elementId).append("<option value='"+v.value+"'>"+v.name+"</option>");
          console.log(v);
        });
      },
      error: function (request, status, error) {
        alert(status);
      }
  })
}
