$(document).ready(function() {
    const apiUrl = 'http://localhost:3000/entities';

    // Fetch and display entities
    function fetchEntities() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(data) {
                $('#entitiesList').empty();
                data.forEach(entity => {
                    $('#entitiesList').append(`
                        <div class="card mb-3" data-id="${entity.id}">
                            <div class="card-body">
                                <h5 class="card-title">${entity.name}</h5>
                                <button class="btn btn-info btn-sm edit-btn">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                            </div>
                        </div>
                    `);
                });
            }
        });
    }

    // Add a new entity
    $('#entityForm').submit(function(event) {
        event.preventDefault();
        const entityName = $('#entityName').val();

        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: entityName }),
            success: function() {
                fetchEntities();
                $('#entityForm')[0].reset();
            }
        });
    });

    // Edit an entity
    $(document).on('click', '.edit-btn', function() {
        const card = $(this).closest('.card');
        const id = card.data('id');
        const name = card.find('.card-title').text();

        $('#entityName').val(name);
        $('#entityForm').off('submit').on('submit', function(event) {
            event.preventDefault();
            const updatedName = $('#entityName').val();

            $.ajax({
                url: `${apiUrl}/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name: updatedName }),
                success: function() {
                    fetchEntities();
                    $('#entityForm')[0].reset();
                    $('#entityForm').off('submit').on('submit', function(event) {
                        event.preventDefault();
                        const entityName = $('#entityName').val();

                        $.ajax({
                            url: apiUrl,
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ name: entityName }),
                            success: function() {
                                fetchEntities();
                                $('#entityForm')[0].reset();
                            }
                        });
                    });
                }
            });
        });
    });

    // Delete an entity
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).closest('.card').data('id');

        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'DELETE',
            success: function() {
                fetchEntities();
            }
        });
    });

    // Initial fetch
    fetchEntities();
});
