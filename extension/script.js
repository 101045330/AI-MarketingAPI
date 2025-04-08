const API_BASE_URL = '_API_URL'; //  Replace with your actual API URL

$(document).ready(function() {
    //  1. Load Countries on Page Load
    function loadCountries() {
        $.ajax({
            url: `${API_BASE_URL}/countries`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let options = '<option value="">Select Country</option>';
                data.forEach(country => {
                    options += `<option value="<span class="math-inline">\{country\.id\}"\></span>{country.name}</option>`;
                });
                $('#country').html(options);
            },
            error: function(err) {
                console.error('Error fetching countries:', err);
            }
        });
    }

    //  2. Load Cities on Country Change
    $('#country').change(function() {
        const countryId = $(this).val();
        if (countryId) {
            $.ajax({
                url: `<span class="math-inline">\{API\_BASE\_URL\}/countries/</span>{countryId}/cities`,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    let options = '<option value="">Select City</option>';
                    data.forEach(city => {
                        options += `<option value="<span class="math-inline">\{city\.id\}"\></span>{city.name}</option>`;
                    });
                    $('#city').html(options);
                    $('#institution').html('<option value="">Select Institution</option>');
                    $('#faculty').html('<option value="">Select Faculty</option>');
                    $('#program').html('<option value="">Select Program</option>');
                    $('#program-details').empty();
                    $('#reviews-container').empty();
                },
                error: function(err) {
                    console.error('Error fetching cities:', err);
                }
            });
        } else {
            $('#city').html('<option value="">
