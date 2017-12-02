$('#cabin-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/campgrounds?' + search, function(data) {
    $('#cabin-grid').html('');
    data.forEach(function(cabin) {
      $('#cabin-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ cabin.image }">
            <div class="caption">
              <h4>${ cabin.name }</h4>
            </div>
            <p>
              <a href="/campgrounds/${ cabin._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#cabin-search').submit(function(event) {
  event.preventDefault();
});