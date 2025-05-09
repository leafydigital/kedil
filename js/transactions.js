var URL = CONFIG.API_BASE_URL;

function fetchTransactions() {

    let token = localStorage.getItem("AuthToken");

    let table = $("#tableTransactions").DataTable({
        ajax: {
            url: URL + '/transaction/select', // Replace with actual API URL
            dataSrc: function (json) {
                return json.filter(item => item.is_active === true);
            },
            beforeSend: function (xhr) {
                if (token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                }
            }
        },
        columns: [
            {
                data: "transaction_date",
                render: function (data, type, row) {

                    data = data.split("T");

                    return `<span class="editable" data-id="${row._id}" data-field="category_name">${data[0]}</span>`;
                },
            },
            {
                data: "vendor_id.vendor_name",
                render: function (data, type, row) {
                    return `<span class="editable" data-id="${row._id}" data-field="group_id">${data ? data : ''}</span>`;
                },
            },
            {
                data: "transaction_description",
                render: function (data, type, row) {
                    return `<span class="editable" data-id="${row._id}" data-field="group_id">${data ? data : ''}</span>`;
                },
            },
            // {
            //     data: "group_id.group_name",
            //     render: function (data, type, row) {
            //         return `<span class="editable" data-id="${row._id}" data-field="group_id">${data ? data : ''}</span>`;
            //     },
            // },
            {
                data: "category_id.category_name",
                render: function (data, type, row) {
                    return `<span class="editable" data-id="${row._id}" data-field="group_id">${data ? data : ''}</span>`;
                },
            },
            {
                data: "transaction_type",
                render: function (data, type, row) {

                    var btnClass = "success";

                    if (data == "Debit") {
                        btnClass = "warning";
                    }
                    else if (data == "Credit") {
                        btnClass = "success";
                    }

                    return `<button class="btn btn-outline-${btnClass} btn-sm w-70">${data}</button>`;

                },
            },
            {
                data: "bank_account.bank_name",
                render: function (data, type, row) {
                    return `<span class="editable" data-id="${row._id}" data-field="group_id">${data}</span>`;
                },
            },
            {
                data: "transaction_amount",
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
                        <a href="javascript:void(0)" onclick="deleteItem('${row._id}', 1)" title="Delete Category">
                            <i class="fa-solid fa-trash"></i>
                        </a>`;
                    }
                    else if (row.is_active == false) {
                        return `
                            <a href="javascript:void(0)" onclick="deleteItem('${row._id}', 2)" title="Un Delete Category">
                                <i class="fa-solid fa-trash-arrow-up"></i>
                            </a>`;
                    }


                },
            },
        ],
        responsive: true,
        paging: true,
        searching: true,
        language: {
            paginate: {
                previous: "Prev",
                next: "Next"
            }
        }
    });

    let editingRow = null; // To track the currently edited row

    // Handle Edit/Save Icon Click
    $("#tableTransactions tbody").on("click", ".edit-icon", function () {
        let $icon = $(this);
        let row = table.row($icon.closest("tr"));
        let rowData = row.data();

        if ($icon.hasClass("fa-pen-to-square")) {
            if (editingRow && editingRow !== row) cancelEdit(editingRow);
            editingRow = row;

            let $rowEl = $(row.node());

            // Date Picker
            let transactionDate = rowData.transaction_date.split("T")[0];
            $rowEl.find("td:eq(0)").html(`<input type="date" class="form-control form-control-sm" value="${transactionDate}" data-field="transaction_date">`);

            // Vendor Dropdown

            // let vendorDropdown = `<select class="form-control form-control-sm" data-field="vendor_id">`;
            // vendors.forEach(v => {
            //     const selected = v._id === rowData.vendor_id._id ? "selected" : "";
            //     vendorDropdown += `<option value="${v._id}" ${selected}>${v.vendor_name}</option>`;
            // });
            // vendorDropdown += `</select>`;
            // $rowEl.find("td:eq(1)").html(vendorDropdown);

            let vendorDropdown = `<select class="form-control form-control-sm vendor-select" data-field="vendor_id">`;
            vendorDropdown += `<option value="">Select Payee</option>`;

            const selectedVendorId = rowData.vendor_id && rowData.vendor_id._id ? rowData.vendor_id._id : "";

            vendors.forEach(v => {
                const selected = v._id === selectedVendorId ? "selected" : "";
                vendorDropdown += `<option value="${v._id}" ${selected}>${v.vendor_name}</option>`;
            });

            vendorDropdown += `</select>`;
            $rowEl.find("td:eq(1)").html(vendorDropdown);

            // Initialize Select2 with tagging
            $rowEl.find(".vendor-select").select2({
                tags: true,
                placeholder: "Choose or add vendor",
                width: 'resolve'
            });

            // Description
            $rowEl.find("td:eq(2)").html(`<input type="text" class="form-control form-control-sm" value="${rowData.transaction_description}" data-field="transaction_description">`);

            // // Group Dropdown
            // let groupDropdown = `<select class="form-control form-control-sm" data-field="group_id">`;
            // groups.forEach(g => {
            //     const selected = g._id === rowData.group_id._id ? "selected" : "";
            //     groupDropdown += `<option value="${g._id}" ${selected}>${g.group_name}</option>`;
            // });
            // groupDropdown += `</select>`;
            // $rowEl.find("td:eq(3)").html(groupDropdown);

            // Category Dropdown
            let categoryDropdown = `<select class="form-control form-control-sm" data-field="category_id">`;
            categories.forEach(c => {
                const selected = c._id === rowData.category_id._id ? "selected" : "";
                categoryDropdown += `<option value="${c._id}" ${selected}>${c.category_name}</option>`;
            });
            categoryDropdown += `</select>`;
            $rowEl.find("td:eq(3)").html(categoryDropdown);

            // Transaction Type Dropdown
            let typeOptions = ['Credit', 'Debit'];
            let typeDropdown = `<select class="form-control form-control-sm" data-field="transaction_type">`;
            typeOptions.forEach(type => {
                const selected = type === rowData.transaction_type ? "selected" : "";
                typeDropdown += `<option value="${type}" ${selected}>${type}</option>`;
            });
            typeDropdown += `</select>`;
            $rowEl.find("td:eq(4)").html(typeDropdown);

            // Bank Account Dropdown
            let bankDropdown = `<select class="form-control form-control-sm" data-field="bank_account">`;
            banks.forEach(b => {
                const selected = b._id === rowData.bank_account._id ? "selected" : "";
                bankDropdown += `<option value="${b._id}" ${selected}>${b.bank_name}</option>`;
            });
            bankDropdown += `</select>`;
            $rowEl.find("td:eq(5)").html(bankDropdown);

            // Amount
            $rowEl.find("td:eq(6)").html(`<input type="number" class="form-control form-control-sm" value="${rowData.transaction_amount}" data-field="transaction_amount">`);

            // Change icon to save
            $icon.removeClass("fa-pen-to-square").addClass("fa-floppy-disk");

        } else if ($icon.hasClass("fa-floppy-disk")) {
            let $rowEl = $(row.node());

            var transactionDate = $rowEl.find('td:eq(0) input').val();

            var vendor = $rowEl.find('td:eq(1) select').val();

            var description = $rowEl.find('td:eq(2) input').val();

            // var group = $rowEl.find('td:eq(3) select').val();

            var category = $rowEl.find('td:eq(3) select').val();

            var transactionType = $rowEl.find('td:eq(4) select').val();

            var bank = $rowEl.find('td:eq(5) select').val();

            var amount = parseFloat($rowEl.find('td:eq(6) input').val());

            if (transactionDate == "" || transactionDate == null) {
                alert("Choose a valid transaction date");

                return;
            }

            // if (vendor == "" || vendor == null) {
            //     sweetAlert("Oops...", "Choose a valid Vendor (If prefers nobody, choose Others)", "error");

            //     return;
            // }

            // if (group == "" || group == null) {
            //     sweetAlert("Oops...", "Choose a valid Group", "error");

            //     return;
            // }

            if (category == "" || category == null) {
                alert("Choose a valid Category");

                return;
            }

            if (transactionType == "" || transactionType == null) {
                alert("Choose a valid transaction type");

                return;
            }

            if (amount == "" || amount == null) {
                alert("Enter a valid Amount");

                return;
            }

            if (description == "" || description == null) {
                // sweetAlert("Oops...", "Enter a valid description", "error");

                // return;
                description = null;
            }

            if (bank == "" || bank == null) {
                alert("Choose a valid bank");

                return;
            }

            const updatedData = {
                transaction_date: transactionDate,
                vendor_id: vendor,
                transaction_description: description,
                category_id: category,
                transaction_type: transactionType,
                bank_account: bank,
                transaction_amount: amount
            };

            $.ajax({
                url: URL + "/transaction/update/" + rowData._id,
                method: "PUT",
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: JSON.stringify(updatedData),
                success: function (response) {
                    table.ajax.reload();
                    editingRow = null;
                },
                error: function (xhr) {
                    alert("Oops... " + xhr.responseJSON.message || "Something went wrong");
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

function fetchCategories(groupId) {

    let token = localStorage.getItem("AuthToken");


    $.ajax({
        url: URL + "/groupcategory/getcategories",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: "",
        success: function (response) {

            $("#ddlCategories").empty();

            var data = response;

            categories = data;

            $("#ddlCategories").append("<option value = '0'>  Choose CATEGORY  </option>");
            $("#ddlCategories").append("<option value = '-1'> -- NEW CATEGORY -- </option>");

            data.forEach(element => {

                //if (element.is_active == true && element.group_id._id == groupId) {
                $("#ddlCategories").append("<option value = '" + element._id + "'>" + element.category_name + "</option>");
                //}

            });

            //console.log(response);
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });
}

function fetchDefault() {
    fetchTransactions();
    //fetchGroups();
    fetchCategories();
    fetchBankAccounts();
    fetchVendors();

}

function fetchBankAccounts() {

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

            $("#ddlBank").empty();

            var data = response;

            banks = data;

            data.forEach(element => {

                if (element.is_active == true) {
                    $("#ddlBank").append("<option value = '" + element._id + "'>" + element.bank_name + "</option>");
                }

            });

            //console.log(response);
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });
}

function fetchVendors() {

    let token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/upi-vendors/select",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: "",
        success: function (response) {

            $("#payeeSelect").empty();

            var data = response;

            vendors = data;

            $("#payeeSelect").append("<option value = ''></option>");

            data.forEach(element => {

                if (element.is_active == true) {
                    $("#payeeSelect").append("<option value = '" + element._id + "'>" + element.vendor_name + "</option>");
                }

            });

            //$("#payeeSelect").append("<option value = '0'> Others </option>");

            //console.log(response);
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });
}

var groups, categories, banks, vendors;

function fetchGroups() {

    let token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/groupcategory/getgroups",
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: "",
        success: function (response) {

            $("#ddlGroups").empty();

            var data = response;

            groups = data;

            $("#ddlGroups").append("<option value = '0'> Choose GROUP </option>");
            $("#ddlGroups").append("<option value = '-1'> -- NEW GROUP -- </option>");

            data.forEach(element => {

                //if (element.is_active == true) {
                $("#ddlGroups").append("<option value = '" + element._id + "'>" + element.group_name + "</option>");
                //}

            });

            //console.log(response);
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });
}


// $("#ddlGroups").on("change", function () {

function groupsChange(object) {
    const selectedValue = $("#ddlGroups").val();

    if (selectedValue.includes("default-")) {

        let token = localStorage.getItem("AuthToken");

        let selectedGroupName = $("#ddlGroups option:selected").text();

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
                    fetchGroups();

                    setTimeout(() => {
                        $("#ddlGroups").val(response._id).change();
                    }, 2000);

                }
            },
            error: function (xhr, status, error) {
                sweetAlert("Oops...", xhr.responseJSON.message, "error");
            }
        });
    }
    else if (selectedValue == -1) {
        const offset = $(object).offset();
        $('#groupPopup')
            .css({ top: offset.top + 20, left: offset.left })
            .fadeIn();

        // Store the clicked row for appending new category
        $('#groupPopup').data('row', $(object).closest('tr'));
    } else {
        fetchCategories(selectedValue);
    }
}

function categoryChange(object) {
    const selectedValue = $("#ddlCategories").val();

    if (selectedValue == -1) {
        const offset = $(object).offset();
        $('#categoryPopup')
            .css({ top: offset.top + 20, left: offset.left })
            .fadeIn();

        // Store the clicked row for appending new category
        $('#categoryPopup').data('row', $(object).closest('tr'));
    }
}

// When clicking anywhere on the document
$(document).on('click', function (e) {
    const isGroupPopup = $(e.target).closest('#groupPopup, #ddlGroups').length > 0;
    const isCategoryPopup = $(e.target).closest('#categoryPopup, #ddlCategories').length > 0;

    if (!isGroupPopup) {
        $('#groupPopup').fadeOut();
    }

    if (!isCategoryPopup) {
        $('#categoryPopup').fadeOut();
    }
});

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

                fetchGroups();

                setTimeout(() => {
                    $("#ddlGroups").val(response._id).change();
                }, 2000);

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
        alert("Oops... Enter a valid Category Name");

        return;
    }

    var groupId = $("#ddlGroups").val();

    if (groupId == null || groupId == 0 || groupId == -1) {
        alert("Oops... Please choose a valid Group");

        return;
    }

    let token = localStorage.getItem("AuthToken");

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

                fetchCategories(groupId);

                setTimeout(() => {
                    $("#ddlCategories").val(response._id).change();
                }, 2000);



            }
        },
        error: function (xhr, status, error) {
            sweetAlert("Oops...", xhr.responseJSON.message, "error");
        }
    });

}


document.getElementById('addTransactionBtn').addEventListener('click', function () {
    const tableBody = document.querySelector('#tableTransactions tbody');

    // Prevent multiple rows
    if (document.querySelector('#inlineTransactionRow')) return;

    const newRow = document.createElement('tr');
    newRow.id = 'inlineTransactionRow';

    newRow.innerHTML = `
        <td><input type="date" class="form-control form-control-sm" id="txtTranDate"/></td>
        <td>
          <select id="payeeSelect" class="form-control form-control-sm payee-select" style="width: 150px;" id="ddlVendor" data-placeholder="Choose Payee">
            <option value="">Select Payee</option>
            <!-- dynamically add options from backend -->
          </select>
        </td>
        <td><input type="text" class="form-control form-control-sm" placeholder="Description" id="txtTranDesc" /></td>
          <td>
            <select id="ddlCategories" class="form-control form-control-sm" placeholder="Choose Category" onchange="categoryChange(this)">

            </select>
        </td>
        <td>
            <select class="form-control form-control-sm" id="ddlTranType">
                <option value="1">Debit</option>
                <option value="2">Credit</option>
            </select>
        </td>
        <td>
            <select id="ddlBank" class="form-control form-control-sm" placeholder="Bank">

            </select>
        </td>
        <td><input type="number" class="form-control form-control-sm" placeholder="Amount" id="txtTranAmount" /></td>
        
        <td colspan="3">
            <button class="btn btn-sm bg-success btn-success saveBtn">Save</button>
            <button class="btn btn-sm bg-danger btn-secondary cancelBtn">Cancel</button>
        </td>
    `;

    // Add to the top of table body
    tableBody.prepend(newRow);

    // Cancel button removes the row
    newRow.querySelector('.cancelBtn').addEventListener('click', () => {
        newRow.remove();
    });

    // Save logic can be added here
    newRow.querySelector('.saveBtn').addEventListener('click', () => {

        saveTransaction(newRow);

        if (result == "Success") {

            fetchTransactions();
        }
        else {
            alert("Save " + result);
            return;
        }


    });

    $('.payee-select').select2({
        tags: true,              // allows custom entry
        placeholder: 'Select or type a new payee',
        width: 'resolve'         // auto-adjust width
    });

    fetchGroups();
    fetchCategories();
    fetchBankAccounts();
    fetchVendors();

});


function saveTransaction(newRow) {

    var transactionDate = $("#txtTranDate").val().trim();

    var vendor = $(".payee-select").val();

    // var group = $("#ddlGroups").val();

    var category = $("#ddlCategories").val();

    var transactionType = $("#ddlTranType option:selected").text().trim();

    var amount = $("#txtTranAmount").val();

    var description = $("#txtTranDesc").val().trim();

    var bank = $("#ddlBank").val();

    if (transactionDate == "" || transactionDate == null) {
        alert("Save Failed Choose a valid transaction date");
        return;

    }

    // if (vendor == "" || vendor == null) {
    //     alert("Save Failed Choose a valid Vendor");
    //     return;
    // }

    // if (group == "" || group == null) {
    //     alert("Save Failed Choose a valid Group");
    //     return;
    // }

    if (category == "" || category == null) {
        alert("Save Failed Choose a valid Category");
        return;
    }

    if (transactionType == "" || transactionType == null) {
        alert("Save Failed Choose a valid transaction type");
        return;
    }

    if (amount == "" || amount == null) {
        alert("Save Failed Enter a valid Amount");
        return;
    }

    // if (description == "" || description == null) {
    //     alert("Save Failed Enter a valid description");
    //     return;
    // }

    if (bank == "" || bank == null) {
        alert("Save Failed Choose a valid bank");
        return;
    }

    let token = localStorage.getItem("AuthToken");

    $.ajax({
        url: URL + "/transaction/create",
        method: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: JSON.stringify({
            transaction_date: transactionDate,
            vendor_id: vendor,
            // group_id: group,
            category_id: category,
            transaction_type: transactionType,
            transaction_amount: amount,
            transaction_description: description,
            bank_account: bank,
        }),
        success: function (response) {

            if (response.transaction_date != null && response.transaction_date != undefined) {
                $('#addTransactionModal').modal('hide');

                $('#txtTranDate').val("");

                $('#txtTranAmount').val("");

                $('#txtTranDesc').val("");

                $('#tableTransactions').DataTable().clear().destroy();

                newRow.remove();

                fetchTransactions();

            }
        },
        error: function (xhr, status, error) {
            alert("Failed " + xhr.responseJSON.error);
        }
    });
}

$('#cancelCategoryBtn').on('click', function () {
    $('#categoryPopup').fadeOut();
    $('#newCategory').val('');
});

$('#cancelGroupBtn').on('click', function () {
    $('#groupPopup').fadeOut();
    $('#newGroup').val('');
});

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

    $.ajax({
        url: URL + "/transaction/delete/" + rowId,
        method: "PUT",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: JSON.stringify({
            is_active: isDeleted
        }),
        success: function (response) {

            $('#tableTransactions').DataTable().clear().destroy();

            fetchTransactions();
        },
        error: function (xhr, status, error) {
            alert("Oops... " + xhr.responseJSON.error);
        }
    });


}