function submitData() {
    // Clear all warnings at the beginning
    document.getElementById('classWarning').style.display = 'none';
    document.getElementById('nameWarning').style.display = 'none';
    document.getElementById('dobWarning').style.display = 'none';
    document.getElementById('programWarning').style.display = 'none';
    document.getElementById('adnoWarning').style.display = 'none';
    document.getElementById('drwingWarning').style.display = 'none'; // Hide the "drwingWarning"

    var selectedClass = document.getElementById('classSelect').value;
    var selectedPrograms = getSelectedPrograms();
    var name = document.getElementById('name').value;
    var dob = document.getElementById('dob').value;
    var adno = document.getElementById('adno').value;
    var adnoWarning = document.getElementById('adnoWarning');
    var adnoWarning2 = document.getElementById('adnoWarning2');

    var adnoPattern = /^NZMP\d{5}$/;
    var adnoPattern2 = /^NZMG\d{5}$/;

    // Check if only "Drawing" is selected
    if (selectedPrograms.length === 1 && selectedPrograms[0] === 'Drawing') {
        document.getElementById('drwingWarning').style.display = 'block'; // Show the "drwingWarning"
        return; // Don't proceed with the submission
    } else {
        document.getElementById('drwingWarning').style.display = 'none'; // Hide the "drwingWarning"
    }

    // Rest of your form submission logic
    if (selectedClass === "Select Class") {
        document.getElementById('classWarning').style.display = 'block';
        return;
    } else {
        document.getElementById('classWarning').style.display = 'none';
    }

    if (!name) {
        document.getElementById('nameWarning').style.display = 'block';
        return;
    } else {
        document.getElementById('nameWarning').style.display = 'none';
    }
    if (!dob) {
        document.getElementById('dobWarning').style.display = 'block';
        return;
    } else {
        document.getElementById('dobWarning').style.display = 'none';
    }
    function validateAdmissionNumber() {
        var classSelect = document.getElementById("classSelect");
        var adnoInput = document.getElementById("adno");
        var adno = adnoInput.value;
        var adnoWarning = document.getElementById("adnoWarning");
        var adnoWarning2 = document.getElementById("adnoWarning2");
        
        // Define your patterns
        var adnoPattern = /^NZMP\d{5}$/; // Pattern for NZMP
        var adnoPattern2 = /^NZMG\d{5}$/; // Pattern for NZMG
    
        // Get the selected class
        var selectedClass = classSelect.value;
    
        // Hide both warnings initially
        adnoWarning.style.display = 'none';
        adnoWarning2.style.display = 'none';
    
        // Check if "General Batch" is selected
        if (selectedClass === "General Batch") {
            // Validate against adnoPattern2 for General Batch
            if (!adno.match(adnoPattern2)) {
                adnoWarning2.style.display = 'block';  // Show adnoWarning2 for invalid General Batch admission numbers
                return;
            }
        } else {
            // Validate against adnoPattern for other classes
            if (!adno.match(adnoPattern)) {
                adnoWarning.style.display = 'block';  // Show adnoWarning for invalid non-General Batch admission numbers
                return;
            }
        }
    }
    
    if (selectedPrograms.length === 0) {
        document.getElementById('programWarning').style.display = 'block';
        return;
    } else {
        document.getElementById('programWarning').style.display = 'none';
    }

    // Display a confirmation box (if needed)
    document.getElementById('confirmationBox').style.display = 'block';
    var confirmationData = document.getElementById('confirmationData');
    confirmationData.innerHTML = `
            <p><strong>Select Class:</strong> ${selectedClass}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
            <p><strong>Admission No:</strong> ${adno}</p>
            <p><strong>Selected Programs:</strong> ${selectedPrograms.join(', ')}</p>
        `;

    // Prevent the actual form submission for now
    return false;
}

function cancelSubmission() {
    document.getElementById('confirmationBox').style.display = 'none';
}

function confirmSubmission() {
    console.log('Confirmation function called.'); // Debugging
    // Retrieve data from the confirmation box
    var selectedClass = document.getElementById('classSelect').value;
    var selectedPrograms = getSelectedPrograms();
    var name = document.getElementById('name').value;
    var dob = document.getElementById('dob').value;
    var adno = document.getElementById('adno').value;

    // Create a data object to send to Google Apps Script
    var data = {
        selectedClass: selectedClass,
        selectedPrograms: selectedPrograms,
        name: name,
        dob: dob,
        adno: adno
    };

    // Send the data as a JSON string to your Google Apps Script web app
    fetch('https://script.google.com/macros/s/AKfycbxKBLTiB-8otVKETN3ViQXMrH_8UOzugmH0CHFneIMzBCpNXHJ0xWNno7iMInc8CRkhNw/exec', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error('Error:', error);

        });

    // Hide the confirmation box after submission
    document.getElementById('confirmationBox').style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'block';
    var thankYouText = document.getElementById('thankYouText');
    thankYouText.innerHTML = `<div style="font-family:  cursive;">Thank you, <span style="color: #C07F00">${name}</span>
    ,<br> for being a part of this celebration! All the best for your success in the Niamia Madrasa Milad Fest.</div>`;

    // Set a timeout to hide the thank you message after 2 seconds (2000 milliseconds)
    setTimeout(function() {
        document.getElementById('thankYouMessage').style.display = 'none';
    }, 16000);


    document.getElementById('name').value = '';
    document.getElementById('adno').value = '';
    document.getElementById('dob').value = '';
    resetProgramCheckboxes();
}


function updateProgramOptions() {
    var classSelect = document.getElementById("classSelect");
    var adnoInput = document.getElementById("adno");
    var quranCheckboxContainer = document.getElementById('quranCheckboxContainer');
    var selectedClass = classSelect.value;

    // Handle showing/hiding the Quran checkbox
    if (selectedClass === 'Level 1A' || selectedClass === 'PRE 1') {
        quranCheckboxContainer.style.display = 'none';
    } else {
        quranCheckboxContainer.style.display = 'block';
    }

    // Handle placeholder change for admission number based on selected class
    if (selectedClass === "General Batch") {
        adnoInput.placeholder = "NZMG00000";
    } else {
        adnoInput.placeholder = "NZMP00000";
    }
}


function getSelectedPrograms() {
    var programCheckboxes = document.querySelectorAll('.program-checkbox');
    var selectedPrograms = [];
    programCheckboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            selectedPrograms.push(checkbox.value);
        }
    });
    return selectedPrograms;
}

function resetProgramCheckboxes() {
    var programCheckboxes = document.querySelectorAll('.program-checkbox');
    programCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
}

function formatNumber(num, from, limit) {
    num = Number(num) > from && Number(num) < 10 && num.length == 1 ? "0" + num : num;
    if (Number(num) > limit) {
        num = num.substr(1, 2);
        num = Number(num) > from && Number(num) < 10 && num.length == 1 ? "0" + num : num;
    }
    return num;
}

// dateElement = document.querySelector("");
// dateElement.addEventListener('input', function() {
//     var dateValue = dateElement.value;
//     if (/\D$/.test(dateValue)) {
//         dateValue = dateValue.substr(0, dateValue.length - 3);
//     }
//     dateValue = dateValue.replaceAll(" ", "");
//     var arr = dateValue.split('-');

//     if (arr[0]) arr[0] = formatNumber(arr[0], 3, 31);
//     if (arr[1]) arr[1] = formatNumber(arr[1], 1, 12);

//     var result = arr.map(function(val, index) {
//         return val.length == 2 && index < 2 ? val + ' - ' : val;
//     });
//     dateElement.value = result.join('').substr(0, 14);
// });
// //------------------------------------- Hypen in Input date box-----------------------------------------------
// dateElement.addEventListener('blur', function() {
//     dateElement.value = dateElement.value.replaceAll(" ", "");
// });

function capitalizeFirstLetter(input) {
    var words = input.value.toLowerCase().split(' ');
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    input.value = words.join(' ');
}

function preventSpaces(event) {
    if (event.key === " ") {
        event.preventDefault();  // Prevent the space character from being entered
    }
}
