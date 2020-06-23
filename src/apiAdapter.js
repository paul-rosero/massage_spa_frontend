class apiAdapter {
    constructor() {
        this.baseUrl = "http://localhost:3000/api/v1/"
    }

    fetchApi(url, method) {
        return fetch(this.baseUrl + url, method )
            .then(promise => promise.json())
    }

    fetchSelect(url, input) {
        let defaultOption = document.createElement('OPTION');
        input.add(defaultOption);
        return fetch(this.baseUrl + url)  
        .then(function(response) {   
            response.json().then(function(appt) {  
                let option;
                for (let i = 0; i < appt.length; i++) {
                    option = document.createElement('option');
                    option.dataset.id = appt[i].id;
                    option.text = appt[i].name;
                    option.value = appt[i].name;
                    input.add(option);
                }    
            });  
        })  
    }
    
}