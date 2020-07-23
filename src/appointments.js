class Appointments {
  constructor() {
    console.log("appointments are loaded")
    this.appointments = [];
    this.adapter = new ApiAdapter();
    this.bindVariables();
    this.allContentLoaded();
    this.addEventListeners();
  }

  bindVariables(){
    this.apptsContainer = document.querySelector('#appointments-container');
    this.apptInfoList = document.querySelector('#appointment-info-list');
    this.clientNameInput = document.querySelector('#client-name-input');
    this.therapistNameInput = document.querySelector('#therapist-name-input');
    this.modalityInput = document.querySelector('#modality-input');
    this.apptTimeInput = document.querySelector('#appointment-time-input');
    this.specialRequestInput = document.querySelector('#special-request-input');
    this.apptForm = document.querySelector('#appointment-form');
    this.editApptButton = document.querySelector('#edit-button');
    this.therapistsList = document.querySelector('#all-therapists-list');
    this.sortButton = document.getElementById('sort-button');
  }

  addEventListeners(){
    Appointment.clickToShowAppt()
    Appointment.copyToEditAppt()

    this.editApptButton.addEventListener('click', (e) => {
      e.preventDefault()
      const updateApptId = e.path[1].dataset.id
      this.adapter.fetchUpdate(`appointments/${updateApptId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({        
          massage_therapist_id: this.therapistNameInput[this.therapistNameInput.selectedIndex].id,
          client_id: this.clientNameInput[this.clientNameInput.selectedIndex].id,
          date_and_time: this.apptTimeInput.value,
          modality: this.modalityInput.value,
          special_request: this.specialRequestInput.value
        })
      }, Appointment, this.apptInfoList)
      .then(() =>{ this.clearForm() })
    })    

    this.sortButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.adapter.fetchSortButton("massage_therapists", { method: 'GET' }, this.therapistsList);
    })

    this.apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.adapter.fetchCreateAppointment("appointments", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({        
          client_id: e.target[0].selectedOptions[0].id,
          massage_therapist_id: e.target[1].selectedOptions[0].id,
          modality: e.target[2].value,
          date_and_time: e.target[3].value,
          special_request: e.target[4].value
        })
        }, this.appointments, Appointment)
      .then(() => {
        this.clearForm();
        this.renderLi()
      })
    })
  }
  
  clearForm(){
    this.clientNameInput.value = ""
    this.therapistNameInput.value = ""
    this.modalityInput.value = ""
    this.apptTimeInput.value = ""
    this.specialRequestInput.value = ""
  }

  allContentLoaded() {
    this.adapter.fetchApi("appointments", { method: 'GET' }, this.appointments, Appointment).then(() => { this.renderLi() });
    
    this.adapter.fetchApi("massage_therapists", { method: 'GET' }, MassageTherapist.allTherapists, MassageTherapist).then(() => { MassageTherapist.renderDetails() });
    
    this.adapter.fetchSelect("massage_therapists", this.therapistNameInput);
    this.adapter.fetchSelect("clients", this.clientNameInput);
  }  

  static findAppointment(id) {
    return Appointments.find((appointment) => appointment.id === id)
  }

  renderLi(){
    this.apptsContainer.innerHTML = this.appointments.map(appt => `<li id="${appt.id}">Appointment ${appt.id}</li>`).join("")
  }

}