let map, service;
function initMap() {
    map = new google.maps.Map(document.createElement('div'));
    service = new google.maps.places.PlacesService(map);
}
document.getElementById('hospitalSearch').addEventListener('input', function() {
    const searchQuery = this.value;
    const request = {
        query: searchQuery,
        fields: ['name', 'place_id', 'formatted_address'],
    };

    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const hospitalList = document.getElementById('hospitalList');
            hospitalList.innerHTML = '';
            results.forEach(hospital => {
                const li = document.createElement('li');
                li.textContent = `${hospital.name} - ${hospital.formatted_address}`;
                li.onclick = () => activateSection2(hospital.place_id);
                hospitalList.appendChild(li);
            });
        }
    });
});
document.getElementById('useLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            const request = {
                location: location,
                radius: '10000',
                type: ['hospital']
            };

            service.nearbySearch(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const hospitalList = document.getElementById('hospitalList');
                    hospitalList.innerHTML = '';
                    results.forEach(hospital => {
                        const li = document.createElement('li');
                        li.textContent = hospital.name;
                        li.onclick = () => activateSection2(hospital.place_id);
                        hospitalList.appendChild(li);
                    });
                }
            });
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
function activateSection2(placeId) {
    document.getElementById('section2').classList.remove('inactive');
    document.getElementById('section1').classList.add('inactive');
    const opds = [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics"
    ].sort();

    const opdList = document.getElementById('opdList');
    opdList.innerHTML = '';
    opds.forEach(opd => {
        const li = document.createElement('li');
        li.textContent = opd;
        li.onclick = () => activateSection3(opd, placeId);
        opdList.appendChild(li);
    });

    document.getElementById('backToHospital').onclick = () => {
        document.getElementById('section1').classList.remove('inactive');
        document.getElementById('section2').classList.add('inactive');
    };
}
function activateSection3(opd, placeId) {
    document.getElementById('section3').classList.remove('inactive');
    document.getElementById('section2').classList.add('inactive');
    const doctors = [
        "Dr. John Doe",
        "Dr. Jane Smith",
        "Dr. Emily Johnson",
        "Dr. Michael Brown"
    ];

    const doctorList = document.getElementById('doctorList');
    doctorList.innerHTML = '';
    doctors.forEach(doctor => {
        const li = document.createElement('li');
        li.textContent = doctor;
        li.onclick = () => showBookingPopup(doctor);
        doctorList.appendChild(li);
    });

    document.getElementById('backToOPD').onclick = () => {
        document.getElementById('section2').classList.remove('inactive');
        document.getElementById('section3').classList.add('inactive');
    };
}
function showBookingPopup(doctor) {
    const modal = document.getElementById('slotSelectionModal');
    const timeSlotList = document.getElementById('timeSlotList');
    const closeModal = document.getElementById('closeModal');
    const alreadyBooked = localStorage.getItem('bookedSlot');
    if (alreadyBooked) {
        alert("You're Already in a Queue");
        return;
    }
    const timeSlots = [
        "10:00 AM - 10:30 AM",
        "11:00 AM - 11:30 AM",
        "12:00 PM - 12:30 PM"
    ];
    timeSlotList.innerHTML = '';
    timeSlots.forEach(slot => {
        const li = document.createElement('li');
        li.textContent = slot;
        li.onclick = () => {
            localStorage.setItem('bookedSlot', 'true');
            alert("You've been successfully added to the Queue");
            modal.style.display = 'none';
        };
        timeSlotList.appendChild(li);
    });
    modal.style.display = 'block';
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
function clearBookingStatus() {
    localStorage.removeItem('bookedSlot');
}
window.onload = clearBookingStatus;
function showManageQueuePopup() {
    const modal = document.getElementById('manageQueueModal');
    const queueDetails = document.getElementById('queueDetails');
    const closeModal = document.getElementById('closeManageQueueModal');
    const deleteBookingButton = document.getElementById('deleteBookingButton');

    const booking = JSON.parse(localStorage.getItem('bookingDetails'));

    if (booking) {
        queueDetails.innerHTML = `
            <p><strong>Hospital:</strong> ${booking.hospital}</p>
            <p><strong>Department:</strong> ${booking.department}</p>
            <p><strong>Doctor:</strong> ${booking.doctor}</p>
            <p><strong>Time Slot:</strong> ${booking.timeSlot}</p>
        `;

        deleteBookingButton.style.display = 'block'; 
    } else {
        queueDetails.innerHTML = '<p>No booking found.</p>';
        deleteBookingButton.style.display = 'none'; 
    }
    modal.style.display = 'block';
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
document.getElementById('deleteBookingButton').addEventListener('click', () => {
    localStorage.removeItem('bookingDetails');
    alert("You've been successfully removed from a queue");
    document.getElementById('manageQueueModal').style.display = 'none'; 
});
document.getElementById('manageQueueLink').addEventListener('click', showManageQueuePopup);
function showBookingPopup(doctor) {
    const modal = document.getElementById('slotSelectionModal');
    const timeSlotList = document.getElementById('timeSlotList');
    const closeModal = document.getElementById('closeModal');
    const booking = localStorage.getItem('bookingDetails');
    if (booking) {
        alert("You're Already in a Queue");
        return;
    }
    const timeSlots = [
        "10:00 AM - 10:30 AM",
        "11:00 AM - 11:30 AM",
        "12:00 PM - 12:30 PM"
    ];
    timeSlotList.innerHTML = '';
    timeSlots.forEach(slot => {
        const li = document.createElement('li');
        li.textContent = slot;
        li.onclick = () => {
            localStorage.setItem('bookingDetails', JSON.stringify({
                hospital: "Example Hospital",
                doctor: doctor,
                timeSlot: slot
            }));
            alert("You've been successfully added to the Queue");
            modal.style.display = 'none'; 
        };
        timeSlotList.appendChild(li);
    });
    modal.style.display = 'block';
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
function clearBookingStatus() {
    localStorage.removeItem('bookedSlot');
}
window.onload = clearBookingStatus;
initMap();



