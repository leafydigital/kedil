var URL = CONFIG.API_BASE_URL;

function fetchGroups() {

    let token = localStorage.getItem("AuthToken");

    let table = $("#tableGroups").DataTable({
        ajax: {
            url: URL + '/groupcategory/getgroups', // Replace with actual API URL
            dataSrc: "",
            beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                }
            }
        },
        columns: [
            {
                data: "group_name",
                render: function (data, type, row) {
                    return `<span class="editable" data-id="${row._id}" data-field="group_id">${data}</span>`;
                },
            },
            {
                data: "is_active",
                render: function (data, type, row) {
                    let status = data ? "Active" : "In-Active";
                    let btnClass = data ? "success" : "warning";
                    return `<button class="btn btn-outline-${btnClass} btn-sm w-70">${status}</button>`;
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<i class="fa-solid fa-pen-to-square edit-icon" data-id="${row._id}"></i>`;
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    if (row.is_active == true) {
                        return `
                        <a href="javascript:void(0)" onclick="deleteItem('${row._id}', 1)" title="Delete Group">
                            <i class="fa-solid fa-trash"></i>
                        </a>`;
                    }
                    else if (row.is_active == false) {
                        return `
                            <a href="javascript:void(0)" onclick="deleteItem('${row._id}', 2)" title="Un Delete Group">
                                <i class="fa-solid fa-trash-arrow-up"></i>
                            </a>`;
                    }

                },
            },
        ],
        responsive: true,
        paging: true,
        searching: true
    });

    let editingRow = null; // To track the currently edited row

    // Handle Edit/Save Icon Click
    $("#tableGroups tbody").on("click", ".edit-icon", function () {
        let $icon = $(this);
        let row = table.row($icon.closest("tr"));
        let rowData = row.data();

        if ($icon.hasClass("fa-pen-to-square")) {
            // If already editing another row, revert it first
            if (editingRow && editingRow !== row) {
                cancelEdit(editingRow);
            }

            editingRow = row;

            // Replace first 2 cells with input fields
            let $rowEl = $(row.node());
            $rowEl.find("td:eq(0)").html(`<input type="text" class="form-control form-control-sm" value="${rowData.group_name}" data-field="category_name">`);

            // Change icon to Save
            $icon.removeClass("fa-pen-to-square").addClass("fa-floppy-disk");

        } else if ($icon.hasClass("fa-floppy-disk")) {
            let $rowEl = $(row.node());
            let newGroupName = $rowEl.find("td:eq(0) input").val();

            swal({
                title: "Warning",
                text: "Are you sure do you want to update the data?",
                type: "warning",
                showCancelButton: !0,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, update it !!",
                cancelButtonText: "No, cancel it !!",
                closeOnConfirm: !1,
                closeOnCancel: !1
            }).then((result) => {
                if (result.value) {

                    $.ajax({
                        url: URL + "/groupcategory/updategroups/" + rowData._id,
                        method: "PUT",
                        contentType: "application/json",
                        headers: {
                            "Authorization": "Bearer " + token
                        },
                        data: JSON.stringify({
                            group_name: newGroupName
                        }),
                        success: function (response) {

                            if (response.group_name != null && response.group_name != undefined) {
                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Group details updated Successfully',
                                    icon: 'success',
                                    type: "success",
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {

                                        rowData.group_name = newGroupName;
                                        table.row($rowEl).data(rowData).draw(false);

                                        editingRow = null;
                                    }
                                });

                            }
                        },
                        error: function (xhr, status, error) {
                            sweetAlert("Oops...", xhr.responseJSON.message, "error");
                        }
                    });

                }
            });
        }
    });

    // Optional: Click outside or another row cancel
    function cancelEdit(row) {
        if (!row) return;
        let rowData = row.data();
        let $rowEl = $(row.node());

        $rowEl.find("td:eq(0)").html(`<span class="editable" data-id="${rowData._id}" data-field="category_name">${rowData.category_name}</span>`);
        $rowEl.find("td:eq(1)").html(`<span class="editable" data-id="${rowData._id}" data-field="group_id">${rowData.group_id.group_name}</span>`);

        $rowEl.find(".fa-floppy-disk").removeClass("fa-floppy-disk").addClass("fa-pen-to-square");

        editingRow = null;
    }
}

function saveGroupName() {

    var GroupName = $("#newGroup").val();

    if (GroupName == "" || GroupName == null) {
        sweetAlert("Oops...", "Enter a valid Group Name", "error");

        return;
    }

    let token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/groupcategory/creategroup",
        method: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: JSON.stringify({
            group_name: GroupName
        }),
        success: function (response) {

            if (response.group_name != null && response.group_name != undefined) {
                $('#groupPopup').fadeOut();
                $('#newGroup').val('');

                loadBudgets();

            }
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });
}

function saveCategory() {

    var categoryName = $("#newCategory").val();

    if (categoryName == "" || categoryName == null) {
        alert("Enter a valid Category Name");

        return;
    }

    var groupId = selectedGroupId;

    if (groupId == null) {
        alert("Group is not matching");

        return;
    }

    let token = localStorage.getItem("AuthToken");

    if (groupId.includes("default-")) {
        $.ajax({
            url: URL + "/groupcategory/creategroup",
            method: "POST",
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: JSON.stringify({
                group_name: selectedGroupName
            }),
            success: function (response) {

                if (response.group_name != null && response.group_name != undefined) {
                    $.ajax({
                        url: URL + "/groupcategory/createcategory",
                        method: "POST",
                        contentType: "application/json",
                        headers: {
                            "Authorization": "Bearer " + token
                        },
                        data: JSON.stringify({
                            category_name: categoryName,
                            group_id: response._id
                        }),
                        success: function (response) {

                            if (response.category_name != null && response.category_name != undefined) {
                                $('#categoryPopup').fadeOut();
                                $('#newCategory').val('');

                                selectedGroupId = null;

                                selectedGroupName = null;

                                loadBudgets();

                            }
                        },
                        error: function (xhr, status, error) {
                            alert("Oops... " + xhr.responseJSON.error);
                        }
                    });

                }
            },
            error: function (xhr, status, error) {
                alert("Oops... "+ xhr.responseJSON.error);
            }
        });
    }
    else {
        $.ajax({
            url: URL + "/groupcategory/createcategory",
            method: "POST",
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: JSON.stringify({
                category_name: categoryName,
                group_id: groupId
            }),
            success: function (response) {

                if (response.category_name != null && response.category_name != undefined) {
                    $('#categoryPopup').fadeOut();
                    $('#newCategory').val('');

                    selectedGroupId = null;

                    selectedGroupName = null;

                    loadBudgets();

                }
            },
            error: function (xhr, status, error) {
                alert("Oops... "+ xhr.responseJSON.error);
            }
        });
    }

}

function deleteItem(rowId, type) {

    let token = localStorage.getItem("AuthToken");

    var title = "", isDeleted = false;

    if (type == 1) //delete
    {
        title = "Delete";
        isDeleted = false;
    }
    else if (type == 2) //undelete
    {
        title = "Un-Delete";
        isDeleted = true;
    }

    swal({
        title: "Warning",
        text: "Are you sure do you want to " + title + "?",
        type: "warning",
        showCancelButton: !0,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, " + title + " it !!",
        cancelButtonText: "No, cancel it !!",
        closeOnConfirm: !1,
        closeOnCancel: !1
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: URL + "/groupcategory/updategroups/" + rowId,
                method: "PUT",
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: JSON.stringify({
                    is_active: isDeleted
                }),
                success: function (response) {

                    if (response.category_name != null && response.category_name != undefined) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Group ' + title + 'ed Successfully',
                            icon: 'success',
                            type: "success",
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.value) {
                                $('#tableGroups').DataTable().clear().destroy();

                                fetchGroups();
                            }
                        });

                    }
                },
                error: function (xhr, status, error) {
                    sweetAlert("Oops...", xhr.responseJSON.message, "error");
                }
            });

        }
    });


}

function sumCreditTransactions(transactions, month, year) {
    // return transactions
    //     .filter(transaction => {
    //         const transactionDate = new Date(transaction.transaction_date);
    //         return transaction.transaction_type === 'Credit' &&
    //             transactionDate.getMonth() + 1 === month && // JavaScript months are 0-based (0 = January)
    //             transactionDate.getFullYear() === year;
    //     })
    //     .reduce((total, transaction) => total + transaction.transaction_amount, 0);

    let unAssignedAmount = 0;

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.transaction_date);

        if (transaction.transaction_type == 'Credit' && transactionDate.getMonth() + 1 == month && transactionDate.getFullYear() == year && transaction.is_active == true) {
            unAssignedAmount += transaction.transaction_amount;
        }

    });

    return unAssignedAmount;
}

async function loadBudgets() {
    try {

        var curMonth = document.getElementById('monthDisplay').innerText;

        curMonth = curMonth.split(' ');

        let month = monthNames.indexOf(curMonth[0]), year = curMonth[1];

        month = month + 1;

        const token = localStorage.getItem("AuthToken");

        // Fetch all groups, categories, and budgets
        const [groupsRes, categoriesRes, budgetRes, transactionsRes, bankAccounts] = await Promise.all([
            fetch(URL + "/groupcategory/getgroups", {
                headers: { Authorization: "Bearer " + token }
            }),
            fetch(URL + "/groupcategory/getcategories", {
                headers: { Authorization: "Bearer " + token }
            }),
            fetch(URL + "/budget/select", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ budget_month: month, budget_year: year })
            }),
            fetch(URL + "/transaction/select", {
                headers: { Authorization: "Bearer " + token }
            }),
            fetch(URL + "/bankaccount/select", {
                headers: { Authorization: "Bearer " + token }
            })
        ]);

        const groups = await groupsRes.json();
        const categories = await categoriesRes.json();
        const budget = await budgetRes.json(); // budget values

        const bankBalance = await bankAccounts.json();

        const transactions = await transactionsRes.json(); // budget values

        let unAssignedAmount = sumCreditTransactions(transactions, month, year)

        // Group categories by group ID
        const categoryMap = {};
        categories.forEach(cat => {
            const groupId = cat.group_id._id;
            if (!categoryMap[groupId]) categoryMap[groupId] = [];
            categoryMap[groupId].push(cat);
        });

        // Budget lookup by category ID
        const budgetMap = {};
        budget.forEach(item => {
            budgetMap[item.budget_category_id._id] = item;
        });

        const container = document.getElementById('budgetAccordion');
        container.innerHTML = '';

        let totalAssigned = 0;

        groups.forEach(group => {
            const groupId = group._id;
            const groupName = group.group_name;
            const groupCategories = categoryMap[groupId] || [];

            let assignedTotal = 0;
            let activityTotal = 0;
            let availableTotal = 0;

            const groupDiv = document.createElement('div');
            groupDiv.className = "accordion-item";

            const bodyHtml = groupCategories.map(cat => {
                const b = budgetMap[cat._id];
                const assigned = b ? b.assigned_amount : 0;
                const activity = b ? b.activity_amount : 0;
                const available = b ? b.available_amount : 0;

                assignedTotal += assigned;
                activityTotal += activity;
                availableTotal += available;

                totalAssigned += assigned;

                return `
    <div class="d-flex budget-row">
        <div class="d-flex-gap-20">
            <div class="name d-flex">${cat.category_name}</div>
        </div>
        <div class="header-row">
            <div class="assigned ${assigned !== 0 && assigned === available ? 'green-bg' : ''}"> 
                <span class="editable-amount" contenteditable="true" data-id="${cat._id}" data-group-id="${groupId}"> 
                    ${assigned < 0 ? `-${Math.abs(assigned).toFixed(2)}` : `${assigned.toFixed(2)}`}
                </span>
            </div>
            <div class="activity">
                ${activity < 0 ? `-${Math.abs(activity).toFixed(2)}` : `${activity.toFixed(2)}`}
            </div>
            <div class="available ${available < 0 ? 'red-bg' : ''}">
                ${available < 0 ? `-${Math.abs(available).toFixed(2)}` : `${available.toFixed(2)}`}
            </div>
        </div>
    </div>
`;

            }).join('');

            groupDiv.innerHTML = `
                <h2 class="accordion-header">
                    <div class="d-flex">
                        <div class="d-flex-gap-20">
                            <div>
                                <button class="accordion-button custom-accordion-header" data-bs-toggle="collapse" aria-expanded="true"
                                data-bs-target="#${groupName.replace(' ', '')}">
                                    <span class="accordion-toggle-icon" data-bs-toggle="collapse"
                                        data-bs-target="#${groupName.replace(' ', '')}" aria-expanded="true" aria-controls="${groupName.replace(' ', '')}">
                                        <i class="arrow-icon fa fa-chevron-down"></i>
                                    </span>
                                </button>
                            </div>
                            <div class="name d-flex">${groupName}
                                <span><a title="Create Category"><i class="fa fa-plus plus-icon-category" data-group-id="${groupId}" data-group-name="${groupName}"></i></a></span>
                            </div>
                        </div>
                        <div class="header-row">
                            <div class="assigned">${assignedTotal.toFixed(2)}</div>
                            <div class="activity">${activityTotal.toFixed(2)}</div>
                            <div class="available">${availableTotal.toFixed(2)}</div>
                        </div>
                    </div>
                </h2>
                <div id="${groupName.replace(' ', '')}" class="accordion-collapse collapse show">
                    <div class="accordion-body">
                        ${bodyHtml || `<div class="text-muted">No categories available in this group.</div>`}
                    </div>
                </div>
            `;

            container.appendChild(groupDiv);



        });

        let balance = 0;

        bankBalance.forEach(element => {

            balance += element.account_balance;
            
        });

        unAssignedAmount = balance - totalAssigned;

        $("#unassinged-amount").text(" " + unAssignedAmount);

        if (unAssignedAmount < 0) {
            $(".ready-to-assign").addClass("bg-danger");
        }
        else {
            $(".ready-to-assign").addClass("bg-success");
        }



    } catch (err) {
        console.error("Error loading budget UI:", err);
        sweetAlert("Oops...", "Something went wrong", "error");
    }
}


$('.plus-icon-group').on('click', function (e) {
    const offset = $(this).offset();
    $('#groupPopup')
        .css({ top: offset.top + 20, left: offset.left })
        .fadeIn();

    // Store the clicked row for appending new category
    $('#groupPopup').data('row', $(this).closest('tr'));
});


$('#budgetAccordion').on('click', '.budget-row', function () {
    // Remove 'selected' class from all rows
    $('.budget-row').removeClass('selected');

    // Add 'selected' class to the clicked one
    $(this).addClass('selected');

    const assigned = $(this).find('.assigned .editable-amount').text().replace('', '').trim();
    const activity = $(this).find('.activity').text().replace('', '').trim();
    const available = $(this).find('.available').text().replace('', '').trim();

    $("#cur-month-assigned").text(" " + assigned);

    $("#cash-spending").text(" " + activity);

    //$("#cur-month-assigned").text(assigned);

});

$('#cancelGroupBtn').on('click', function () {
    $('#groupPopup').fadeOut();
    $('#newGroup').val('');
});

var selectedGroupId = null, selectedGroupName = null;

$(document).on('click', '.plus-icon-category', function (e) {
    const offset = $(this).offset();
    $('#categoryPopup')
        .css({ top: offset.top + 20, left: offset.left })
        .fadeIn();

    selectedGroupId = $(this).data('group-id');

    selectedGroupName = $(this).data('group-name');

    // Store the clicked row for appending new category
    $('#categoryPopup').data('row', $(this).closest('tr'));
});

$('#cancelCategoryBtn').on('click', function () {
    $('#categoryPopup').fadeOut();
    $('#newCategory').val('');
});


$(document).on('click', '.accordion-button', function (e) {

    var $icon = $(this).find('.arrow-icon');

    var isExpanded = $(this).attr('aria-expanded') === 'true';

    if (isExpanded) {
        $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
    } else {
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');

    }

});



function saveValue(value, element) {

    var curMonth = document.getElementById('monthDisplay').innerText;

    curMonth = curMonth.split(' ');

    let month = monthNames.indexOf(curMonth[0]), year = curMonth[1];

    month = month + 1;

    const category_id = element.dataset.id, amount = value, group_id = element.dataset.groupId;

    const token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/budget/create/",
        method: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: JSON.stringify({
            budget_category_id: category_id,
            budget_group_id: group_id,
            budget_month: month,
            budget_year: year,
            assigned_amount: amount
        }),
        success: function (response) {

            if (response.assigned_amount != null && response.assigned_amount != undefined) {
                loadBudgets();
            }
        }
    });

    //alert(`Saving for ID ${id}: ${value}`);
}

$(document).on('keypress', '.editable-amount', function (e) {

    const char = String.fromCharCode(e.which);

    const currentText = $(this)[0].innerText;

    if (!/[0-9.]/.test(char) || (char === '.' && currentText.includes('.'))) {
        e.preventDefault();
    }

});

$(document).on('blur', '.editable-amount', function (e) {

    const newValue = $(this)[0].innerText.trim();

    saveValue(newValue, this); // Save the value on blur

});

$(document).on('keydown', '.editable-amount', function (e) {

    if (e.key === "Enter") {
        e.preventDefault(); // prevent line break
        $(this).blur(); // trigger blur to save
    }
});

let editingId = null;

// Load all banks from API
async function renderBanks() {
    const container = document.getElementById('banksContainer');
    container.innerHTML = '';

    let token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/bankaccount/select",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: "",
        success: function (response) {

            var banks = response;

            banks.forEach((bank) => {
                container.innerHTML += `

                <div class="col-md-3 dark">
					<div class="row">
						<div class="col-md-9">
							<h3> ${bank.bank_name} </h3>
							<h4> ${bank.account_type} </h4>
                            <h4> Balance : ${bank.account_balance} </h4>
						</div>
						<div class="col-md-3">
							<div class="d-flex gap-2 icons">
								<a href="#" onclick="openEditForm('${bank._id}', '${bank.bank_name}', '${bank.account_type}')"> <i class="fa fa-edit"></i> </a>
								<a href="#" onclick="deleteBank('${bank._id}')"> <i class="fa fa-trash"></i> </a>
							</div>
						</div>
					</div>
				</div>`;
            });
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });
}

function openAddForm() {
    document.getElementById('bankFormModal').style.display = 'block';
    editingId = null;
    document.getElementById('bankNickname').value = '';
    document.getElementById('accountType').value = '';
}

function openEditForm(id, nickname, type) {
    document.getElementById('bankFormModal').style.display = 'block';
    document.getElementById('bankNickname').value = nickname;
    document.getElementById('accountType').value = type;
    editingId = id;
}

function closeForm() {
    document.getElementById('bankFormModal').style.display = 'none';
    editingId = null;
}

// Save new or updated bank
async function saveBank() {

    document.getElementById('bankNickname').style.borderColor = "black";
    document.getElementById('accountType').style.borderColor = "black";
    document.getElementById('balance').style.borderColor = "black";

    const bank_name = document.getElementById('bankNickname').value;
    const account_type = $('#accountType').val();

    const account_balance = document.getElementById('balance').value;

    if (bank_name == null || bank_name == undefined || bank_name == "") {
        alert("Please enter the bank name");

        document.getElementById('bankNickname').style.borderColor = "red";

        return;
    }

    if (account_type == null || account_type == undefined || account_type == "") {
        alert("Please choose account type");

        document.getElementById('accountType').style.borderColor = "red";

        return;
    }

    if (account_balance == null || account_balance == undefined || account_balance == "" || account_balance < 0) {
        alert("Please enter a valid initial balance");

        document.getElementById('balance').style.borderColor = "red";

        return;
    }

    let token = localStorage.getItem("AuthToken");

    try {
        let response;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };

        const body = JSON.stringify({ bank_name, account_type, account_balance });

        if (editingId) {
            response = await fetch(`${URL}/bankaccount/update/${editingId}`, {
                method: 'PUT',
                headers,
                body
            });
        } else {
            response = await fetch(`${URL}/bankaccount/create/`, {
                method: 'POST',
                headers,
                body
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Bank account operation failed');
        }

        const result = await response.json();
        console.log('Success:', result); // Or update the UI accordingly
    } catch (error) {
        console.log('Error: ', error.message + " --> Error is " + error.error);
    }
    closeForm();
    renderBanks();
}

// Delete a bank
async function deleteBank(id) {

    let token = localStorage.getItem("AuthToken");

    const is_active = false;

    await fetch(URL + `/bankaccount/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ is_active }),
    });
}