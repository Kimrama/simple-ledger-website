function fetchAndPopulateTable() {
    fetch("http://127.0.0.1:8000/transaction", {
        mode: "cors",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text().then((text) => {
                return text ? JSON.parse(text) : {};
            });
        })
        .then(({ data }) => {
            const tableBody = document.getElementById("table-body");

            tableBody.innerHTML = "";

            if (Array.isArray(data)) {
                data.forEach((record) => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${record.id}</td>
                        <td>${record.amount}</td>
                        <td>${record.type}</td>
                        <td>${record.description}</td>
                        <td>${record.date}</td>
                        <td>${record.sum}</td>
                        <td><button class="delete-btn" data-id="${record.id}">Delete</button></td>
                    `;

                    tableBody.appendChild(row);
                });

                document.querySelectorAll(".delete-btn").forEach((button) => {
                    button.addEventListener("click", (e) => {
                        const recordId = e.target.getAttribute("data-id");
                        deleteRecord(recordId, e.target.closest("tr"));
                    });
                });
            } else {
                console.error("Data is not in expected format.");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function deleteRecord(recordId, tableRow) {
    const deleteUrl = `/transaction/delete`;

    fetch(deleteUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_id: recordId }), // This should match the FastAPI backend's expected data
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            // Remove the table row from the DOM after successful deletion
            tableRow.remove();
            console.log(`Record with ID ${recordId} deleted successfully.`);
        })
        .catch((error) => {
            console.error(`Error deleting record with ID ${recordId}:`, error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("addButton");
    const recordTable = document.getElementById("recordTable");
    const addRecordForm = document.getElementById("addRecordForm");
    const recordForm = document.getElementById("recordForm");
    const bodyTitle = document.getElementById("body-title");

    // Initially hide the add record form
    addRecordForm.style.display = "none";

    // When the "ADD" button is clicked
    addButton.addEventListener("click", () => {
        if (addButton.innerText === "ADD") {
            // Show the form and hide the table
            addButton.innerText = "Back";
            addButton.style.backgroundColor = "#AA8C4C";
            bodyTitle.innerText = "Add New Record";
            recordTable.style.display = "none";
            addRecordForm.style.display = "block";
        } else {
            // Back to table view
            addButton.innerText = "ADD";
            addButton.style.backgroundColor = "#28a745";
            bodyTitle.innerText = "Record";
            recordTable.style.display = "table";
            addRecordForm.style.display = "none";
        }
    });

    // Handle the form submission
    recordForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the form from submitting in the traditional way

        // Get the values from the form
        const amount = document.getElementById("amount").value;
        const type = document.querySelector('input[name="type"]:checked').value;
        const describe = document.getElementById("describe").value;
        const currentDate = new Date().toISOString().split("T")[0]; // Get the current date

        // Create the new record object
        const newRecord = {
            amount: amount,
            type: type,
            describe: describe,
        };
        console.log(newRecord);

        // Make the POST request to add the new record to the backend
        fetch("/transaction/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecord),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // The record has been successfully added to the backend, now add it to the table
                const tableBody = document.getElementById("table-body");
                const newRow = document.createElement("tr");

                newRow.innerHTML = `
                    <td>${data.id}</td>
                    <td>${data.amount}</td>
                    <td>${data.type}</td>
                    <td>${data.description}</td>
                    <td>${data.date}</td>
                    <td>${data.sum}</td>
                    <td><button class="delete-btn" data-id="${data.id}">Delete</button></td>
                `;

                tableBody.appendChild(newRow);

                // Add event listener for the delete button of the new row
                const deleteButton = newRow.querySelector(".delete-btn");
                deleteButton.addEventListener("click", (e) => {
                    deleteRecord(data.id, newRow);
                });

                // Back to table view after submission
                addButton.innerText = "ADD";
                addButton.style.backgroundColor = "#28a745";
                bodyTitle.innerText = "Record";
                recordTable.style.display = "table";
                addRecordForm.style.display = "none";

                // Clear the form fields
                recordForm.reset();
            })
            .catch((error) => {
                console.error("Error adding data:", error);
            });
    });
});

document.addEventListener("DOMContentLoaded", fetchAndPopulateTable);
